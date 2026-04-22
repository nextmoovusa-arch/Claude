import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface Coach {
  email: string;
  isHeadCoach: boolean;
}

interface UniversityData {
  name: string;
  city: string;
  state: string;
  division: string;
  coaches: Coach[];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractNamesFromEmail(email: string): { firstName: string; lastName: string } {
  const local = email.split("@")[0];
  // Try common patterns: first.last, flast, firstl
  const dotPattern = local.match(/^([a-z]+)\.([a-z]+)$/i);
  if (dotPattern) {
    return {
      firstName: capitalize(dotPattern[1]),
      lastName: capitalize(dotPattern[2]),
    };
  }
  // Fallback — treat entire local part as last name
  return { firstName: "", lastName: capitalize(local) };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function main() {
  console.log("🌱 Starting seed process...\n");

  const seedDir = path.join(__dirname, "seeds");
  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  let totalUniversities = 0;
  let totalCoaches = 0;
  const divisionStats: Record<string, { unis: number; coaches: number }> = {};

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    const data: UniversityData[] = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    process.stdout.write(`📄 Processing ${file}...`);

    for (const uni of data) {
      const slug = generateSlug(uni.name);

      const university = await prisma.university.upsert({
        where: { slug },
        update: {
          city: uni.city,
          state: uni.state,
          division: uni.division as never,
        },
        create: {
          name: uni.name,
          slug,
          city: uni.city,
          state: uni.state,
          division: uni.division as never,
        },
      });

      for (const coachData of uni.coaches) {
        const { firstName, lastName } = extractNamesFromEmail(coachData.email);

        // Check if a coach with this email already exists for this university
        const existing = await prisma.coach.findFirst({
          where: { email: coachData.email, universityId: university.id },
        });

        if (existing) {
          await prisma.coach.update({
            where: { id: existing.id },
            data: { isHeadCoach: coachData.isHeadCoach },
          });
        } else {
          await prisma.coach.create({
            data: {
              email: coachData.email,
              firstName,
              lastName,
              isHeadCoach: coachData.isHeadCoach,
              universityId: university.id,
            },
          });
        }

        totalCoaches++;
      }

      totalUniversities++;

      if (!divisionStats[uni.division]) {
        divisionStats[uni.division] = { unis: 0, coaches: 0 };
      }
      divisionStats[uni.division].unis++;
      divisionStats[uni.division].coaches += uni.coaches.length;
    }

    console.log(` ✓ ${data.length} universities`);
  }

  console.log("\n📊 ═══════════════════════════════════════");
  console.log("   SEED COMPLETION SUMMARY");
  console.log("═══════════════════════════════════════\n");

  for (const [division, stats] of Object.entries(divisionStats)) {
    const d = division.padEnd(15);
    const u = stats.unis.toString().padStart(3);
    const c = stats.coaches.toString().padStart(4);
    console.log(`${d} → ${u} universities  |  ${c} coaches`);
  }

  console.log("\n───────────────────────────────────────");
  console.log(`Total Universities : ${totalUniversities}`);
  console.log(`Total Coaches      : ${totalCoaches}`);
  console.log("═══════════════════════════════════════\n");
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
