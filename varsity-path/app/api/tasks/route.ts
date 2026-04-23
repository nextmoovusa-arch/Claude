import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const athleteId = searchParams.get("athleteId")
  const status = searchParams.get("status")
  const category = searchParams.get("category")

  const tasks = await prisma.task.findMany({
    where: {
      ...(athleteId ? { athleteId } : {}),
      ...(status ? { status: status as never } : {}),
      ...(category ? { category: category as never } : {}),
    },
    orderBy: [{ priority: "asc" }, { dueDate: "asc" }],
    include: {
      athlete: { select: { firstName: true, lastName: true } },
      assignee: { select: { name: true } },
    },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const task = await prisma.task.create({
    data: {
      athleteId: body.athleteId,
      assigneeId: body.assigneeId ?? undefined,
      title: body.title,
      description: body.description ?? undefined,
      category: body.category,
      status: body.status ?? "TODO",
      priority: body.priority ?? 2,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    },
  })

  return NextResponse.json(task, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...data } = body

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.status === "DONE" ? { completedAt: new Date() } : {}),
      ...(data.title ? { title: data.title } : {}),
      ...(data.priority ? { priority: data.priority } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate ? new Date(data.dueDate) : null } : {}),
    },
  })

  return NextResponse.json(task)
}
