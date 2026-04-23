import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      athlete: { select: { firstName: true, lastName: true, id: true } },
      contacts: {
        include: {
          coach: { select: { firstName: true, lastName: true, email: true, title: true } },
          university: { select: { name: true, city: true, state: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 })
  }

  return NextResponse.json(campaign)
}
