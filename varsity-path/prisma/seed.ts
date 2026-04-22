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
    const data: UniversityData[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log(`📄 Processing ${file}...`);

    for (const uni of data) {
      // Upsert university
      const university = await prisma.university.upsert({
        where: { name: uni.name },
        update: {
          city: uni.city,
          state: uni.state,
          division: uni.division,
        },
        create: {
          name: uni.name,
          city: uni.city,
          state: uni.state,
          division: uni.division,
        },
      });

      // Upsert coaches for this university
      for (const coachData of uni.coaches) {
        await prisma.coach.upsert({
          where: { email: coachData.email },
          update: {
            isHeadCoach: coachData.isHeadCoach,
            universityId: university.id,
          },
          create: {
            email: coachData.email,
            isHeadCoach: coachData.isHeadCoach,
            universityId: university.id,
          },
        });

        totalCoaches++;
      }

      totalUniversities++;

      // Track division stats
      if (!divisionStats[uni.division]) {
        divisionStats[uni.division] = { unis: 0, coaches: 0 };
      }
      divisionStats[uni.division].unis++;
      divisionStats[uni.division].coaches += uni.coaches.length;
    }

    console.log(`  ✓ ${data.length} universities processed\n`);
  }

  console.log("\n📊 ═══════════════════════════════════════");
  console.log("   SEED COMPLETION SUMMARY");
  console.log("═══════════════════════════════════════\n");

  for (const [division, stats] of Object.entries(divisionStats)) {
    console.log(`${division.padEnd(15)} → ${stats.unis.toString().padStart(3)} unis  |  ${stats.coaches.toString().padStart(3)} coaches`);
  }

  console.log("\n───────────────────────────────────────");
  console.log(`Total Universities: ${totalUniversities}`);
  console.log(`Total Coaches:      ${totalCoaches}`);
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
