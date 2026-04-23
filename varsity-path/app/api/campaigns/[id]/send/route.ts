import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      contacts: {
        where: { status: "DRAFT" },
        include: { coach: true },
      },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 })
  }

  if (!campaign.contacts.length) {
    return NextResponse.json({ error: "Aucun contact à envoyer" }, { status: 400 })
  }

  // Mark contacts as SENT and record timestamp
  const now = new Date()
  await prisma.campaignContact.updateMany({
    where: { campaignId: params.id, status: "DRAFT" },
    data: { status: "SENT", sentAt: now },
  })

  // Update campaign sentAt
  await prisma.campaign.update({
    where: { id: params.id },
    data: { sentAt: now },
  })

  return NextResponse.json({
    sent: campaign.contacts.length,
    sentAt: now.toISOString(),
  })
}
