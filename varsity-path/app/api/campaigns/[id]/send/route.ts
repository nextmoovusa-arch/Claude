import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface MailjetMessage {
  From: { Email: string; Name: string }
  To: { Email: string; Name: string }[]
  Subject: string
  TextPart: string
  CustomID: string
}

async function sendViaMailjet(messages: MailjetMessage[]): Promise<{ sent: number; failed: number }> {
  const apiKey    = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY

  if (!apiKey || !secretKey) {
    throw new Error("MAILJET_API_KEY ou MAILJET_SECRET_KEY manquant dans .env")
  }

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

  // Mailjet v3.1 accepts max 50 messages per request
  const BATCH_SIZE = 50
  let sent = 0
  let failed = 0

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE)
    const res = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Messages: batch }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Mailjet error:", err)
      failed += batch.length
      continue
    }

    const data = await res.json()
    for (const msg of data.Messages ?? []) {
      if (msg.Status === "success") sent++
      else failed++
    }
  }

  return { sent, failed }
}

function fillVariables(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // ── Without DB: return informative response ──────────────────────────────
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Base de données non connectée. Configurez DATABASE_URL dans .env" },
      { status: 503 }
    )
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      athlete: true,
      contacts: {
        where: { status: "DRAFT" },
        include: { coach: { include: { university: true } } },
      },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 })
  }

  if (!campaign.contacts.length) {
    return NextResponse.json({ error: "Aucun contact à envoyer" }, { status: 400 })
  }

  const senderName  = process.env.MAILJET_SENDER_NAME  ?? "NEXTMOOV USA Recruiting"
  const senderEmail = process.env.MAILJET_SENDER_EMAIL ?? "recruiting@nextmoovusa.com"

  // Build one Mailjet message per contact
  const messages: MailjetMessage[] = campaign.contacts.map((contact) => {
    const vars: Record<string, string> = {
      athleteFirstName: campaign.athlete.firstName,
      athleteLastName:  campaign.athlete.lastName,
      athleteEmail:     campaign.athlete.email ?? "",
      coachLastName:    contact.coach.lastName,
      universityName:   contact.coach.university?.name ?? "",
      position:         (campaign.athlete as any).primaryPosition ?? "",
      country:          (campaign.athlete as any).nationality ?? "",
      age:              "",
      currentClub:      (campaign.athlete as any).currentClub ?? "",
      gpa:              (campaign.athlete as any).gpaConverted?.toString() ?? "",
      toefl:            (campaign.athlete as any).toeflScore?.toString() ?? "",
      highlightUrl:     (campaign.athlete as any).highlightUrl ?? "",
    }

    return {
      From: { Email: senderEmail, Name: senderName },
      To:   [{ Email: contact.coach.email, Name: `${contact.coach.firstName} ${contact.coach.lastName}` }],
      Subject: fillVariables(campaign.subject, vars),
      TextPart: fillVariables(campaign.bodyHtml, vars),
      // CustomID lets Mailjet webhook identify which contact this belongs to
      CustomID: contact.id,
    }
  })

  let sent = 0
  let failed = 0

  try {
    const result = await sendViaMailjet(messages)
    sent   = result.sent
    failed = result.failed
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 })
  }

  const now = new Date()

  // Mark successfully-sent contacts
  if (sent > 0) {
    await prisma.campaignContact.updateMany({
      where: { campaignId: params.id, status: "DRAFT" },
      data: { status: "SENT", sentAt: now },
    })

    await prisma.campaign.update({
      where: { id: params.id },
      data: { sentAt: now },
    })
  }

  return NextResponse.json({ sent, failed, sentAt: now.toISOString() })
}
