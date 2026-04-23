import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") ?? ""
  const division = searchParams.get("division") ?? ""
  const state = searchParams.get("state") ?? ""
  const page = parseInt(searchParams.get("page") ?? "1")
  const limit = parseInt(searchParams.get("limit") ?? "50")
  const skip = (page - 1) * limit

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { city: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {},
      division ? { division: division as never } : {},
      state ? { state } : {},
    ],
  }

  const [universities, total] = await Promise.all([
    prisma.university.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        division: true,
        _count: { select: { coaches: true } },
      },
    }),
    prisma.university.count({ where }),
  ])

  return NextResponse.json({ universities, total, page, limit })
}
