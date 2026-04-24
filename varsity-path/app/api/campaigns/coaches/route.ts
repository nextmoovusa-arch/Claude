import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") ?? ""
  const division = searchParams.get("division") ?? ""
  const state = searchParams.get("state") ?? ""

  const where = {
    AND: [
      search
        ? { OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
            { state: { contains: search, mode: "insensitive" as const } },
          ]}
        : {},
      division ? { division: division as never } : {},
      state ? { state } : {},
      // Only universities that have at least one coach with an email
      { coaches: { some: { email: { not: null } } } },
    ],
  }

  const universities = await prisma.university.findMany({
    where,
    take: 100,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      division: true,
      coaches: {
        where: { email: { not: null } },
        orderBy: [{ isHeadCoach: "desc" }, { lastName: "asc" }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isHeadCoach: true,
        },
      },
    },
  })

  return NextResponse.json(universities)
}
