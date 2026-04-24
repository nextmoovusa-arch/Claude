import { NextRequest, NextResponse } from "next/server"

interface Recipient {
  email: string
  coachLastName?: string
  universityName?: string
  [key: string]: string | undefined
}

interface SendMailRequest {
  athleteId?: string
  templateId?: string
  subject: string
  body: string
  recipients: Recipient[]
}

interface MailjetMessage {
  From: { Email: string; Name: string }
  To: { Email: string; Name: string }[]
  Subject: string
  TextPart: string
  CustomID: string
}

function fillVariables(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

async function sendViaMailjet(
  messages: MailjetMessage[]
): Promise<{ sent: number; errors: number }> {
  const apiKey    = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY

  if (!apiKey || !secretKey) {
    throw new Error("MAILJET_API_KEY ou MAILJET_SECRET_KEY manquant dans .env")
  }

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

  const BATCH_SIZE = 50
  let sent   = 0
  let errors = 0

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
      console.error("Mailjet batch error:", err)
      errors += batch.length
      continue
    }

    const data = await res.json()
    for (const msg of data.Messages ?? []) {
      if (msg.Status === "success") sent++
      else errors++
    }
  }

  return { sent, errors }
}

export async function POST(req: NextRequest) {
  let payload: SendMailRequest

  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide" }, { status: 400 })
  }

  const { subject, body, recipients } = payload

  if (!subject || !body) {
    return NextResponse.json({ error: "subject et body sont requis" }, { status: 400 })
  }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return NextResponse.json({ error: "recipients doit être un tableau non vide" }, { status: 400 })
  }

  const senderName  = process.env.MAILJET_SENDER_NAME  ?? "NEXTMOOV USA Recruiting"
  const senderEmail = process.env.MAILJET_SENDER_EMAIL ?? "recruiting@nextmoovusa.com"

  // Build one message per recipient with personalised variables
  const messages: MailjetMessage[] = recipients.map((recipient, idx) => {
    const vars: Record<string, string> = {
      coachLastName:  recipient.coachLastName  ?? "",
      universityName: recipient.universityName ?? "",
      ...Object.fromEntries(
        Object.entries(recipient).filter(([, v]) => typeof v === "string") as [string, string][]
      ),
    }

    return {
      From: { Email: senderEmail, Name: senderName },
      To:   [{ Email: recipient.email, Name: recipient.coachLastName ?? recipient.email }],
      Subject:  fillVariables(subject, vars),
      TextPart: fillVariables(body, vars),
      CustomID: `mail-send-${idx}-${Date.now()}`,
    }
  })

  try {
    const result = await sendViaMailjet(messages)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
