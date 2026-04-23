import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const university = await prisma.university.findUnique({
    where: { id: params.id },
    include: {
      coaches: {
        orderBy: [{ isHeadCoach: "desc" }, { lastName: "asc" }],
      },
    },
  })

  if (!university) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(university)
}
