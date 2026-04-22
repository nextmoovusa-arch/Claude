import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const athletes = await prisma.athlete.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      status: true,
      currentClub: true,
      primaryPosition: true,
      gpaConverted: true,
      targetDivisions: true,
      createdAt: true,
    },
  })

  return NextResponse.json(athletes)
}

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()

  // Récupérer ou créer le User agent
  const agentUser = await prisma.user.findFirst({ where: { clerkId: userId } })
  if (!agentUser) {
    return NextResponse.json(
      { error: "Compte agent introuvable — synchronisez votre profil Clerk" },
      { status: 400 }
    )
  }

  // Créer un User pour l'athlète si email fourni
  let athleteUserId: string
  if (body.email) {
    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      athleteUserId = existing.id
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: body.email,
          name: `${body.firstName} ${body.lastName}`,
          role: "ATHLETE",
        },
      })
      athleteUserId = newUser.id
    }
  } else {
    const placeholder = await prisma.user.create({
      data: {
        email: `athlete-${Date.now()}@placeholder.varsitypath`,
        name: `${body.firstName} ${body.lastName}`,
        role: "ATHLETE",
      },
    })
    athleteUserId = placeholder.id
  }

  const athlete = await prisma.athlete.create({
    data: {
      userId: athleteUserId,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      nationality: body.nationality || undefined,
      currentClub: body.currentClub || undefined,
      primaryPosition: body.primaryPosition || undefined,
      secondaryPosition: body.secondaryPosition || undefined,
      dominantFoot: body.dominantFoot || undefined,
      heightCm: body.heightCm ? parseInt(body.heightCm) : undefined,
      weightKg: body.weightKg ? parseInt(body.weightKg) : undefined,
      targetDivisions: body.targetDivisions ?? [],
      preferredRegions: body.preferredRegions
        ? body.preferredRegions.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      familyBudgetUsd: body.familyBudgetUsd ? parseInt(body.familyBudgetUsd) : undefined,
      minScholarshipPct: body.minScholarshipPct ? parseInt(body.minScholarshipPct) : undefined,
      targetMajor: body.targetMajor || undefined,
      agentNotes: body.agentNotes || undefined,
      status: body.status ?? "PROSPECT",
    },
  })

  // Créer les 10 étapes du parcours standard
  const steps = [
    "Signature du contrat",
    "Création du profil complet",
    "Dossier académique finalisé",
    "Tests standardisés passés",
    "Inscription NCAA Eligibility Center",
    "Vidéo highlights produite",
    "Shortlist universités validée",
    "Campagne d'emails lancée",
    "Offres reçues et étudiées",
    "Université choisie — NLI signé",
  ]

  await prisma.step.createMany({
    data: steps.map((title, i) => ({
      athleteId: athlete.id,
      order: i + 1,
      title,
      status: i === 0 ? "IN_PROGRESS" : "PENDING",
    })),
  })

  return NextResponse.json(athlete, { status: 201 })
}
