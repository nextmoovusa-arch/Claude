import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as fs from "fs"
import * as path from "path"

const SECRET = process.env.SEED_SECRET ?? "varsity-seed-2026"

interface CoachData { email: string; isHeadCoach: boolean }
interface UniData { name: string; city: string; state: string; division: string; coaches: CoachData[] }

function makeSlug(name: string) {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const GENERIC_PREFIXES = /^(m|w|men|women|mens|womens|msoccer|wsoccer|mensoccer|womensoccer|soccer|athletics|calsoccer|smsoccer|ucdavissoccer|lmusoccer|coaching|coach|sports|athletic)/i

function extractNames(email: string) {
  const local = email.split("@")[0]
  if (GENERIC_PREFIXES.test(local)) return { firstName: "", lastName: "" }
  const dot = local.match(/^([a-z]+)\.([a-z]+)$/i)
  if (dot) return { firstName: dot[1][0].toUpperCase() + dot[1].slice(1).toLowerCase(), lastName: dot[2][0].toUpperCase() + dot[2].slice(1).toLowerCase() }
  return { firstName: "", lastName: "" }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("secret")
  if (token !== SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "No DATABASE_URL" }, { status: 503 })

  const seedDir = path.join(process.cwd(), "prisma/seeds")
  const allFiles = fs.readdirSync(seedDir).filter((f) => f.endsWith(".json")).sort()

  // Process one file per call, identified by index
  const fileIndex = parseInt(req.nextUrl.searchParams.get("file") ?? "0")
  if (fileIndex >= allFiles.length) {
    const total = await prisma.university.count()
    const coaches = await prisma.coach.count()
    return NextResponse.json({ done: true, universities: total, coaches, message: "Seed terminé ✅" })
  }

  const file = allFiles[fileIndex]
  const data: UniData[] = JSON.parse(fs.readFileSync(path.join(seedDir, file), "utf-8"))

  let unis = 0
  let coaches = 0

  for (const uni of data) {
    const s = makeSlug(uni.name)
    const university = await prisma.university.upsert({
      where: { slug: s },
      update: { city: uni.city, state: uni.state, division: uni.division as never },
      create: { name: uni.name, slug: s, city: uni.city, state: uni.state, division: uni.division as never },
    })
    unis++
    for (const c of uni.coaches) {
      const { firstName, lastName } = extractNames(c.email)
      const existing = await prisma.coach.findFirst({ where: { email: c.email, universityId: university.id } })
      if (!existing) {
        await prisma.coach.create({
          data: { email: c.email, firstName, lastName, isHeadCoach: c.isHeadCoach, universityId: university.id },
        })
        coaches++
      }
    }
  }

  return NextResponse.json({
    done: false,
    file,
    fileIndex,
    nextFile: fileIndex + 1,
    totalFiles: allFiles.length,
    unis,
    coaches,
    nextUrl: `/api/admin/seed?secret=${SECRET}&file=${fileIndex + 1}`,
  })
}
