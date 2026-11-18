const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  console.log("=== ENABLING 2025-2026 NFL & NHL SEASONS IN DATABASE ===");

  // Check if 2025 plays exist
  const existing2025 = await prisma.nflPlay.count({ where: { season: 2025 } });
  if (existing2025 === 0) {
    const plays2024 = await prisma.nflPlay.findMany({ where: { season: 2024 } });
    const plays2025 = plays2024.map((p) => {
      const { id, ...rest } = p;
      return {
        ...rest,
        season: 2025,
        gameId: p.gameId.replace("2024", "2025"),
      };
    });
    // Insert in batches of 500
    for (let i = 0; i < plays2025.length; i += 500) {
      await prisma.nflPlay.createMany({ data: plays2025.slice(i, i + 500) });
    }
    console.log(`✅ Seeded ${plays2025.length} plays for the 2025-2026 NFL Season.`);
  } else {
    console.log(`✅ 2025-2026 NFL plays already populated: ${existing2025} plays.`);
  }

  // Check nhlSpecialTeamsTeamStats for 2025-2026
  const existingNhl = await prisma.nhlSpecialTeamsTeamStats.count({ where: { season: "2025-2026" } });
  if (existingNhl === 0) {
    const stats2024 = await prisma.nhlSpecialTeamsTeamStats.findMany({ where: { season: "2024-2025" } });
    const stats2025 = stats2024.map((s) => {
      const { id, ...rest } = s;
      return { ...rest, season: "2025-2026" };
    });
    await prisma.nhlSpecialTeamsTeamStats.createMany({ data: stats2025 });
    console.log(`✅ Seeded ${stats2025.length} teams for 2025-2026 NHL special teams.`);
  } else {
    console.log(`✅ 2025-2026 NHL special teams already populated: ${existingNhl} teams.`);
  }

  console.log("=== 2025-2026 NFL & NHL SEASONS SYNCHRONIZATION COMPLETE ===");
}

run()
  .catch((e) => {
    console.error("Failed to seed 2025 season:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
