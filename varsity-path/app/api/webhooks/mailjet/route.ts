import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Mailjet event types we handle
type MailjetEvent = "sent" | "open" | "click" | "bounce" | "spam" | "blocked" | "unsub"

interface MailjetWebhookEvent {
  event: MailjetEvent
  CustomID: string   // = CampaignContact.id (set in send route)
  time: number       // Unix timestamp
  email?: string
  hard_bounce?: boolean
}

const EVENT_TO_STATUS: Partial<Record<MailjetEvent, string>> = {
  open:    "OPENED",
  click:   "CLICKED",
  bounce:  "BOUNCED",
  spam:    "SPAM",
  blocked: "BOUNCED",
}

export async function POST(req: NextRequest) {
  // Mailjet sends an array of events
  let events: MailjetWebhookEvent[]
  try {
    events = await req.json()
    if (!Array.isArray(events)) events = [events]
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!process.env.DATABASE_URL) {
    // Accept the webhook but do nothing — DB not connected
    return NextResponse.json({ ok: true, skipped: events.length })
  }

  let processed = 0

  for (const event of events) {
    const contactId = event.CustomID
    if (!contactId) continue

    const newStatus = EVENT_TO_STATUS[event.event]
    if (!newStatus) continue

    try {
      await prisma.campaignContact.update({
        where: { id: contactId },
        data: {
          status: newStatus,
          ...(event.event === "open" ? { openedAt: new Date(event.time * 1000) } : {}),
        },
      })
      processed++
    } catch {
      // Contact not found or already in a terminal state — ignore
    }
  }

  return NextResponse.json({ ok: true, processed })
}
