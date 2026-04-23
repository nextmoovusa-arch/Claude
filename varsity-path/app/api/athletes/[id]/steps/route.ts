import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { stepId, status, plannedDate } = await req.json()

  const step = await prisma.step.update({
    where: { id: stepId },
    data: {
      status,
      ...(status === "COMPLETED" ? { completedDate: new Date() } : {}),
      ...(plannedDate ? { plannedDate: new Date(plannedDate) } : {}),
    },
  })

  // Auto-advance: set the next PENDING step to IN_PROGRESS
  if (status === "COMPLETED") {
    const nextStep = await prisma.step.findFirst({
      where: { athleteId: params.id, status: "PENDING" },
      orderBy: { order: "asc" },
    })
    if (nextStep) {
      await prisma.step.update({
        where: { id: nextStep.id },
        data: { status: "IN_PROGRESS" },
      })
    }
  }

  return NextResponse.json(step)
}
