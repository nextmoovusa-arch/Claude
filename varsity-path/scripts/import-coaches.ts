/**
 * Script d'import de la base coachs depuis un fichier Excel.
 *
 * Usage: npx ts-node scripts/import-coaches.ts <chemin-vers-le-fichier.xlsx>
 *
 * Colonnes attendues dans le fichier Excel (ordre flexible, noms insensibles à la casse) :
 *   university, city, state, division, coach_first_name, coach_last_name,
 *   coach_email, coach_title, is_head_coach
 */

import * as XLSX from "xlsx"
import * as path from "path"
import * as fs from "fs"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client")
import { Division } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)()

const DIVISION_MAP: Record<string, Division> = {
  "ncaa d1": "NCAA_D1",
  "ncaa d-1": "NCAA_D1",
  "d1": "NCAA_D1",
  "ncaa d2": "NCAA_D2",
  "ncaa d-2": "NCAA_D2",
  "d2": "NCAA_D2",
  "ncaa d3": "NCAA_D3",
  "ncaa d-3": "NCAA_D3",
  "d3": "NCAA_D3",
  "naia": "NAIA",
  "njcaa d1": "NJCAA_D1",
  "juco d1": "NJCAA_D1",
  "njcaa d2": "NJCAA_D2",
  "juco d2": "NJCAA_D2",
  "njcaa d3": "NJCAA_D3",
  "juco d3": "NJCAA_D3",
  "prep school": "PREP_SCHOOL",
  "prep": "PREP_SCHOOL",
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim().replace(/\s+/g, "_")
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

interface ImportReport {
  total: number
  universitiesCreated: number
  universitiesSkipped: number
  coachesCreated: number
  coachesUpdated: number
  coachesRejected: number
  errors: string[]
}

async function importCoaches(filePath: string): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.error(`Fichier introuvable : ${filePath}`)
    process.exit(1)
  }

  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, string>[]

  const report: ImportReport = {
    total: rows.length,
    universitiesCreated: 0,
    universitiesSkipped: 0,
    coachesCreated: 0,
    coachesUpdated: 0,
    coachesRejected: 0,
    errors: [],
  }

  console.log(`\n--- Import en cours : ${rows.length} lignes détectées ---\n`)

  for (let i = 0; i < rows.length; i++) {
    const rawRow = rows[i]
    // Normaliser les clés
    const row: Record<string, string> = {}
    for (const [k, v] of Object.entries(rawRow)) {
      row[normalizeHeader(k)] = String(v).trim()
    }

    const universityName = row["university"] || row["universite"] || row["school"] || ""
    const coachFirstName = row["coach_first_name"] || row["first_name"] || row["prenom"] || ""
    const coachLastName = row["coach_last_name"] || row["last_name"] || row["nom"] || ""
    const coachEmail = row["coach_email"] || row["email"] || ""
    const coachTitle = row["coach_title"] || row["title"] || row["poste"] || ""
    const isHeadCoach =
      (row["is_head_coach"] || row["head_coach"] || "").toLowerCase() === "true" ||
      (row["is_head_coach"] || row["head_coach"] || "").toLowerCase() === "yes" ||
      (row["is_head_coach"] || row["head_coach"] || "").toLowerCase() === "oui"
    const divisionRaw = (row["division"] || "").toLowerCase().trim()
    const city = row["city"] || row["ville"] || ""
    const state = row["state"] || row["etat"] || ""

    // Validation
    if (!universityName) {
      report.errors.push(`Ligne ${i + 2} : nom d'université manquant`)
      report.coachesRejected++
      continue
    }

    if (!coachLastName) {
      report.errors.push(`Ligne ${i + 2} (${universityName}) : nom de coach manquant`)
      report.coachesRejected++
      continue
    }

    if (coachEmail && !isValidEmail(coachEmail)) {
      report.errors.push(`Ligne ${i + 2} (${universityName} — ${coachLastName}) : email invalide "${coachEmail}"`)
      report.coachesRejected++
      continue
    }

    const division: Division | undefined = DIVISION_MAP[divisionRaw]

    // Upsert université
    const slug = slugify(universityName)
    let university = await prisma.university.findUnique({ where: { slug } })

    if (!university) {
      university = await prisma.university.create({
        data: {
          name: universityName,
          slug,
          city: city || undefined,
          state: state || undefined,
          division: division ?? undefined,
        },
      })
      report.universitiesCreated++
    } else {
      report.universitiesSkipped++
    }

    // Upsert coach (par email si disponible, sinon par nom + université)
    const existingCoach = coachEmail
      ? await prisma.coach.findFirst({ where: { email: coachEmail } })
      : await prisma.coach.findFirst({
          where: {
            universityId: university.id,
            firstName: coachFirstName,
            lastName: coachLastName,
          },
        })

    if (existingCoach) {
      await prisma.coach.update({
        where: { id: existingCoach.id },
        data: {
          title: coachTitle || existingCoach.title,
          isHeadCoach,
        },
      })
      report.coachesUpdated++
    } else {
      await prisma.coach.create({
        data: {
          universityId: university.id,
          firstName: coachFirstName,
          lastName: coachLastName,
          email: coachEmail || undefined,
          title: coachTitle || undefined,
          isHeadCoach,
        },
      })
      report.coachesCreated++
    }
  }

  // Rapport final
  console.log("╔══════════════════════════════════╗")
  console.log("║       RAPPORT D'IMPORT           ║")
  console.log("╠══════════════════════════════════╣")
  console.log(`║ Total lignes traitées : ${String(report.total).padEnd(8)}║`)
  console.log(`║ Universités créées    : ${String(report.universitiesCreated).padEnd(8)}║`)
  console.log(`║ Universités existantes: ${String(report.universitiesSkipped).padEnd(8)}║`)
  console.log(`║ Coachs créés          : ${String(report.coachesCreated).padEnd(8)}║`)
  console.log(`║ Coachs mis à jour     : ${String(report.coachesUpdated).padEnd(8)}║`)
  console.log(`║ Lignes rejetées       : ${String(report.coachesRejected).padEnd(8)}║`)
  console.log("╚══════════════════════════════════╝")

  if (report.errors.length > 0) {
    console.log("\nErreurs détectées :")
    report.errors.forEach((e) => console.log(`  - ${e}`))
  }

  await prisma.$disconnect()
}

const filePath = process.argv[2]
if (!filePath) {
  console.error("Usage: npx ts-node scripts/import-coaches.ts <chemin-vers-le-fichier.xlsx>")
  process.exit(1)
}

importCoaches(path.resolve(filePath)).catch((err) => {
  console.error("Erreur fatale :", err)
  prisma.$disconnect()
  process.exit(1)
})
