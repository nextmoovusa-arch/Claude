import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const athlete = await prisma.athlete.findUnique({
    where: { id: params.id },
    include: {
      steps: { orderBy: { order: "asc" } },
      campaigns: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, subject: true, sentAt: true },
      },
      tasks: {
        where: { status: { not: "DONE" } },
        orderBy: [{ priority: "asc" }, { dueDate: "asc" }],
        take: 5,
      },
      documents: { orderBy: { uploadedAt: "desc" } },
    },
  })

  if (!athlete) {
    return NextResponse.json({ error: "Athlète introuvable" }, { status: 404 })
  }

  return NextResponse.json(athlete)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  const allowed = [
    "status", "firstName", "lastName", "dateOfBirth", "nationality",
    "currentClub", "primaryPosition", "secondaryPosition", "dominantFoot",
    "heightCm", "weightKg", "gpaConverted", "satScore", "actScore",
    "toeflScore", "ieltsScore", "targetDivisions", "preferredRegions",
    "familyBudgetUsd", "minScholarshipPct", "targetMajor", "agentNotes",
    "highlightUrl",
  ]

  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }

  const athlete = await prisma.athlete.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(athlete)
}
