import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const athleteId = searchParams.get("athleteId")

  const campaigns = await prisma.campaign.findMany({
    where: athleteId ? { athleteId } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      athlete: { select: { firstName: true, lastName: true } },
      _count: { select: { contacts: true } },
      contacts: {
        select: { status: true },
      },
    },
  })

  const result = campaigns.map((c) => ({
    id: c.id,
    athleteName: `${c.athlete.firstName} ${c.athlete.lastName}`,
    athleteId: c.athleteId,
    subject: c.subject,
    targetCount: c._count.contacts,
    sentCount: c.contacts.filter((cc) => cc.status !== "DRAFT").length,
    openedCount: c.contacts.filter((cc) => ["OPENED", "REPLIED"].includes(cc.status)).length,
    repliedCount: c.contacts.filter((cc) => cc.status === "REPLIED").length,
    createdAt: c.createdAt.toISOString(),
    sentAt: c.sentAt?.toISOString(),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const campaign = await prisma.campaign.create({
    data: {
      athleteId: body.athleteId,
      subject: body.subject,
      bodyHtml: body.bodyHtml,
      templateId: body.templateId ?? undefined,
    },
  })

  if (body.coachIds?.length) {
    const coaches = await prisma.coach.findMany({
      where: { id: { in: body.coachIds } },
      select: { id: true, universityId: true },
    })

    await prisma.campaignContact.createMany({
      data: coaches.map((coach) => ({
        campaignId: campaign.id,
        coachId: coach.id,
        universityId: coach.universityId,
        status: "DRAFT",
      })),
    })
  }

  return NextResponse.json(campaign, { status: 201 })
}
