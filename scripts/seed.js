const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashCode(code) {
  return crypto.createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}

async function main() {
  console.log("Seeding SportsEdge AI database...");

  // 1. Create Admin & Test Users
  const adminHash = await bcrypt.hash("AdminPass2026!", 10);
  const userHash = await bcrypt.hash("UserPass2026!", 10);
  const proHash = await bcrypt.hash("ProPass2026!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sportsedge.ai" },
    update: {},
    create: {
      email: "admin@sportsedge.ai",
      name: "Lead Administrator",
      passwordHash: adminHash,
      role: "ADMIN",
      plan: "PRO",
    },
  });

  const freeUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Free Sports Bettor",
      passwordHash: userHash,
      role: "USER",
      plan: "FREE",
    },
  });

  const proUser = await prisma.user.upsert({
    where: { email: "pro@example.com" },
    update: {},
    create: {
      email: "pro@example.com",
      name: "Paying Pro Member",
      passwordHash: proHash,
      role: "USER",
      plan: "PRO",
      proExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Created users:", { admin: admin.email, free: freeUser.email, pro: proUser.email });

  // 2. Create Promotional Codes
  const sampleCodes = [
    {
      code: "SPORTSEDGE-30DAY-GIFT",
      type: "ONE_MONTH",
      durationDays: 30,
      maxRedemptions: 100,
      isActive: true,
      notes: "Community gift giveaway - 30 days free Pro access",
    },
    {
      code: "SPORTSEDGE-1YEAR-VIP",
      type: "ONE_YEAR",
      durationDays: 365,
      maxRedemptions: 50,
      isActive: true,
      notes: "Annual VIP promotional grant",
    },
    {
      code: "SPORTSEDGE-PROMO-2026",
      type: "CUSTOM",
      durationDays: 60,
      maxRedemptions: 25,
      isActive: true,
      notes: "Spring 2026 60-day promotional campaign",
    },
    {
      code: "SPORTSEDGE-EXPIRED-TEST",
      type: "ONE_MONTH",
      durationDays: 30,
      maxRedemptions: 10,
      isActive: true,
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired yesterday
      notes: "Expired code testing",
    },
    {
      code: "SPORTSEDGE-DISABLED-TEST",
      type: "ONE_MONTH",
      durationDays: 30,
      maxRedemptions: 10,
      isActive: false, // Inactive
      notes: "Disabled code testing",
    },
    {
      code: "SPORTSEDGE-LIMIT-TEST",
      type: "ONE_MONTH",
      durationDays: 30,
      maxRedemptions: 1,
      timesRedeemed: 1, // Full
      isActive: true,
      notes: "Exhausted limit test",
    },
  ];

  for (const c of sampleCodes) {
    const codeHash = hashCode(c.code);
    await prisma.promoCode.upsert({
      where: { codeHash },
      update: {},
      create: {
        code: c.code,
        codeHash,
        type: c.type,
        durationDays: c.durationDays,
        maxRedemptions: c.maxRedemptions,
        timesRedeemed: c.timesRedeemed || 0,
        isActive: c.isActive,
        expiresAt: c.expiresAt || null,
        notes: c.notes,
        createdBy: admin.id,
      },
    });
  }
  console.log("Seeded promotional codes.");

  // 3. Seed NFL Defensive and Offensive Plays
  console.log("Seeding NFL Play-by-play development fixtures...");
  await prisma.nflPlay.deleteMany({});

  const nflPlays = [];
  // Generate 80 defensive plays for Example Team A
  for (let i = 1; i <= 80; i++) {
    const down = (i % 4) + 1;
    const yardsToGo = down === 1 ? 10 : down === 2 ? 6 : down === 3 ? (i % 2 === 0 ? 8 : 3) : 2;
    const yardline100 = (i * 7) % 95 + 1;
    const isRedZone = yardline100 <= 20;
    const isGoalLine = yardline100 <= 5;
    const isFirstDrive = i <= 10;
    const afterTurnover = i % 7 === 0;
    const quarter = Math.min(4, Math.floor(i / 20) + 1);
    const scoreDiff = (i % 5) - 2; // -2 to +2

    // Verified blitz data: 70 verified plays, 10 unverified
    const isVerified = i <= 70;
    // On 3rd down or redzone, blitz rate is higher (~45%)
    const isBlitz = isVerified ? (down === 3 || isRedZone ? (i % 2 === 0) : (i % 4 === 0)) : null;
    const isPass = i % 3 !== 0;
    const isSack = Boolean(isBlitz && i % 6 === 0);
    const isPressure = Boolean((isBlitz && i % 3 === 0) || (i % 8 === 0));
    const yardsGained = isSack ? -7 : isPass ? (i % 2 === 0 ? 12 : 0) : (i % 5) + 1;
    const isFirstDown = Boolean(yardsGained >= yardsToGo);

    nflPlays.push({
      gameId: `NFL-2024-GM-${Math.floor(i / 40) + 1}`,
      season: 2024,
      week: 10,
      possessionTeam: "Example Team B",
      defensiveTeam: "Example Team A",
      down,
      yardsToGo,
      yardline100,
      quarter,
      timeRemainingSeconds: 900 - (i * 10) % 900,
      scoreDiff,
      playType: isPass ? (isSack ? "SACK" : "PASS") : "RUN",
      yardsGained,
      isFirstDown,
      isTouchdown: isRedZone && isFirstDown && yardsGained >= yardline100,
      isTurnover: i % 15 === 0,
      isRedZone,
      isGoalLine,
      isTwoMinuteDrill: i % 9 === 0,
      driveNumber: Math.floor(i / 8) + 1,
      isFirstDrive,
      afterTurnover,
      afterPenalty: i % 11 === 0,
      personnel: isPass ? "11 Personnel" : "12 Personnel",
      formation: isPass ? "SHOTGUN" : "UNDER CENTER",
      isBlitz,
      isPressure,
      isSack,
      isCompletion: isPass ? !isSack && yardsGained > 0 : null,
      passingYards: isPass ? yardsGained : null,
      isExplosivePlay: (isPass && yardsGained >= 20) || (!isPass && yardsGained >= 12),
      dataProvider: isVerified ? "MOCK_FIXTURE" : "UNVERIFIED",
      isVerifiedBlitzData: isVerified,
    });
  }

  // Generate 80 offensive plays for Example Team A
  for (let i = 1; i <= 80; i++) {
    const down = (i % 4) + 1;
    const yardsToGo = down === 1 ? 10 : down === 2 ? 7 : down === 3 ? (i % 2 === 0 ? 9 : 2) : 1;
    const yardline100 = (i * 9) % 95 + 1;
    const isRedZone = yardline100 <= 20;
    const isGoalLine = yardline100 <= 5;
    const isFirstDrive = i <= 8;
    const afterTurnover = i % 8 === 0;
    const quarter = Math.min(4, Math.floor(i / 20) + 1);
    const scoreDiff = (i % 7) - 3;

    // Tendency: Pass on 3rd & long (75%), run on 1st & 10 (55%), run goal line (70%)
    let playType = "PASS";
    if (isGoalLine) {
      playType = i % 3 === 0 ? "PASS" : "RUN";
    } else if (down === 3 && yardsToGo >= 8) {
      playType = i % 4 === 0 ? "RUN" : "PASS";
    } else if (down === 1) {
      playType = i % 2 === 0 ? "RUN" : "PASS";
    } else {
      playType = i % 3 === 0 ? "RUN" : "PASS";
    }

    const isPass = playType === "PASS";
    const yardsGained = isPass ? (i % 2 === 0 ? 11 : -1) : (i % 4) + 2;
    const isFirstDown = yardsGained >= yardsToGo;

    const isSack = Boolean(playType === "SACK");
    nflPlays.push({
      gameId: `NFL-2024-GM-${Math.floor(i / 40) + 1}`,
      season: 2024,
      week: 10,
      possessionTeam: "Example Team A",
      defensiveTeam: "Example Team B",
      down,
      yardsToGo,
      yardline100,
      quarter,
      timeRemainingSeconds: 900 - (i * 10) % 900,
      scoreDiff,
      playType,
      yardsGained,
      isFirstDown: Boolean(isFirstDown),
      isTouchdown: Boolean(isRedZone && isFirstDown && yardsGained >= yardline100),
      isTurnover: Boolean(i % 20 === 0),
      isRedZone: Boolean(isRedZone),
      isGoalLine: Boolean(isGoalLine),
      isTwoMinuteDrill: Boolean(i % 10 === 0),
      driveNumber: Math.floor(i / 8) + 1,
      isFirstDrive: Boolean(isFirstDrive),
      afterTurnover: Boolean(afterTurnover),
      afterPenalty: Boolean(i % 12 === 0),
      personnel: isPass ? "11 Personnel" : "21 Personnel",
      formation: isPass ? "SHOTGUN" : "PISTOL",
      isBlitz: Boolean(i % 3 === 0),
      isPressure: Boolean(i % 4 === 0),
      isSack,
      isCompletion: isPass ? Boolean(yardsGained > 0) : null,
      passingYards: isPass ? yardsGained : null,
      isExplosivePlay: Boolean((isPass && yardsGained >= 20) || (!isPass && yardsGained >= 12)),
      dataProvider: "MOCK_FIXTURE",
      isVerifiedBlitzData: true,
    });
  }

  await prisma.nflPlay.createMany({ data: nflPlays });
  console.log(`Seeded ${nflPlays.length} NFL plays.`);

  // 4. Seed NHL Special Teams Data
  console.log("Seeding NHL Special Teams data...");
  await prisma.nhlSpecialTeamsTeamStats.deleteMany({});
  await prisma.nhlSpecialTeamsPlayer.deleteMany({});

  await prisma.nhlSpecialTeamsTeamStats.createMany({
    data: [
      {
        team: "EDM",
        season: "2024-2025",
        gameType: "REGULAR",
        ppOpportunities: 52,
        ppGoals: 16,
        ppPct: 30.8,
        ppOpportunitiesPerGame: 3.3,
        ppGoalsPerGame: 1.0,
        homePpPct: 33.3,
        awayPpPct: 28.0,
        l5PpPct: 35.7,
        l10PpPct: 32.0,
        timesShorthanded: 48,
        pkGoalsAllowed: 10,
        pkPct: 79.2,
        shGoalsScored: 3,
        shShotsAllowed: 78,
        shBlockedShots: 28,
        shTimeOnIceSeconds: 5400,
        homePkPct: 81.0,
        awayPkPct: 77.2,
        l5PkPct: 80.0,
        l10PkPct: 78.5,
        dataProvider: "MOCK_FIXTURE",
      },
      {
        team: "TOR",
        season: "2024-2025",
        gameType: "REGULAR",
        ppOpportunities: 48,
        ppGoals: 12,
        ppPct: 25.0,
        ppOpportunitiesPerGame: 3.0,
        ppGoalsPerGame: 0.75,
        homePpPct: 27.5,
        awayPpPct: 22.0,
        l5PpPct: 28.6,
        l10PpPct: 26.1,
        timesShorthanded: 44,
        pkGoalsAllowed: 7,
        pkPct: 84.1,
        shGoalsScored: 1,
        shShotsAllowed: 62,
        shBlockedShots: 34,
        shTimeOnIceSeconds: 5100,
        homePkPct: 86.4,
        awayPkPct: 81.8,
        l5PkPct: 85.0,
        l10PkPct: 83.3,
        dataProvider: "MOCK_FIXTURE",
      },
    ],
  });

  const nhlPlayers = [
    // EDM PP1
    {
      playerId: "EDM-97",
      name: "Connor McDavid",
      team: "EDM",
      position: "C",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.8,
      ppGoals: 6,
      ppAssists: 10,
      ppPoints: 16,
      ppShots: 28,
      ppShootingPct: 21.4,
      shareTeamPpGoals: 37.5,
      shareTeamPpPoints: 50.0,
      shTimeOnIcePerGame: 0.2,
      shBlockedShots: 1,
      shBlockedShotsPerMinute: 0.025,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "EDM-29",
      name: "Leon Draisaitl",
      team: "EDM",
      position: "C",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.7,
      ppGoals: 7,
      ppAssists: 8,
      ppPoints: 15,
      ppShots: 30,
      ppShootingPct: 23.3,
      shareTeamPpGoals: 43.8,
      shareTeamPpPoints: 46.9,
      shTimeOnIcePerGame: 0.4,
      shBlockedShots: 2,
      shBlockedShotsPerMinute: 0.025,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "EDM-2",
      name: "Evan Bouchard",
      team: "EDM",
      position: "D",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.6,
      ppGoals: 2,
      ppAssists: 11,
      ppPoints: 13,
      ppShots: 34,
      ppShootingPct: 5.9,
      shareTeamPpGoals: 12.5,
      shareTeamPpPoints: 40.6,
      shTimeOnIcePerGame: 0.1,
      shBlockedShots: 1,
      shBlockedShotsPerMinute: 0.05,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "EDM-18",
      name: "Zach Hyman",
      team: "EDM",
      position: "LW",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.5,
      ppGoals: 5,
      ppAssists: 4,
      ppPoints: 9,
      ppShots: 22,
      ppShootingPct: 22.7,
      shareTeamPpGoals: 31.3,
      shareTeamPpPoints: 28.1,
      shTimeOnIcePerGame: 0.1,
      shBlockedShots: 1,
      shBlockedShotsPerMinute: 0.05,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "EDM-93",
      name: "Ryan Nugent-Hopkins",
      team: "EDM",
      position: "C",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.4,
      ppGoals: 1,
      ppAssists: 8,
      ppPoints: 9,
      ppShots: 14,
      ppShootingPct: 7.1,
      shareTeamPpGoals: 6.3,
      shareTeamPpPoints: 28.1,
      shTimeOnIcePerGame: 1.8,
      shBlockedShots: 5,
      shBlockedShotsPerMinute: 0.138,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    // EDM PP2
    {
      playerId: "EDM-14",
      name: "Mattias Ekholm",
      team: "EDM",
      position: "D",
      unit: "PP2",
      unitStatus: "PROJECTED",
      ppTimeOnIcePerGame: 0.9,
      ppGoals: 0,
      ppAssists: 2,
      ppPoints: 2,
      ppShots: 8,
      ppShootingPct: 0.0,
      shareTeamPpGoals: 0.0,
      shareTeamPpPoints: 6.3,
      shTimeOnIcePerGame: 2.6,
      shBlockedShots: 12,
      shBlockedShotsPerMinute: 0.231,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    // EDM PK1 & PK2
    {
      playerId: "EDM-25",
      name: "Darnell Nurse",
      team: "EDM",
      position: "D",
      unit: "PK1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 0.2,
      ppGoals: 0,
      ppAssists: 0,
      ppPoints: 0,
      ppShots: 2,
      ppShootingPct: 0.0,
      shareTeamPpGoals: 0.0,
      shareTeamPpPoints: 0.0,
      shTimeOnIcePerGame: 2.8,
      shBlockedShots: 14,
      shBlockedShotsPerMinute: 0.25,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "EDM-10",
      name: "Derek Ryan",
      team: "EDM",
      position: "C",
      unit: "PK1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 0.0,
      ppGoals: 0,
      ppAssists: 0,
      ppPoints: 0,
      ppShots: 0,
      ppShootingPct: 0.0,
      shareTeamPpGoals: 0.0,
      shareTeamPpPoints: 0.0,
      shTimeOnIcePerGame: 2.2,
      shBlockedShots: 6,
      shBlockedShotsPerMinute: 0.136,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "EDM-28",
      name: "Connor Brown",
      team: "EDM",
      position: "RW",
      unit: "PK2",
      unitStatus: "REPORTED",
      ppTimeOnIcePerGame: 0.1,
      ppGoals: 0,
      ppAssists: 0,
      ppPoints: 0,
      ppShots: 1,
      ppShootingPct: 0.0,
      shareTeamPpGoals: 0.0,
      shareTeamPpPoints: 0.0,
      shTimeOnIcePerGame: 2.1,
      shBlockedShots: 4,
      shBlockedShotsPerMinute: 0.095,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    // TOR PP1 & PK
    {
      playerId: "TOR-34",
      name: "Auston Matthews",
      team: "TOR",
      position: "C",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.5,
      ppGoals: 6,
      ppAssists: 5,
      ppPoints: 11,
      ppShots: 32,
      ppShootingPct: 18.8,
      shareTeamPpGoals: 50.0,
      shareTeamPpPoints: 45.8,
      shTimeOnIcePerGame: 0.5,
      shBlockedShots: 3,
      shBlockedShotsPerMinute: 0.03,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "TOR-16",
      name: "Mitch Marner",
      team: "TOR",
      position: "RW",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.4,
      ppGoals: 2,
      ppAssists: 9,
      ppPoints: 11,
      ppShots: 15,
      ppShootingPct: 13.3,
      shareTeamPpGoals: 16.7,
      shareTeamPpPoints: 45.8,
      shTimeOnIcePerGame: 2.4,
      shBlockedShots: 7,
      shBlockedShotsPerMinute: 0.146,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "TOR-88",
      name: "William Nylander",
      team: "TOR",
      position: "RW",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.3,
      ppGoals: 3,
      ppAssists: 6,
      ppPoints: 9,
      ppShots: 26,
      ppShootingPct: 11.5,
      shareTeamPpGoals: 25.0,
      shareTeamPpPoints: 37.5,
      shTimeOnIcePerGame: 0.0,
      shBlockedShots: 0,
      shBlockedShotsPerMinute: 0.0,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "TOR-22",
      name: "Jake McCabe",
      team: "TOR",
      position: "D",
      unit: "PK1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 0.0,
      ppGoals: 0,
      ppAssists: 0,
      ppPoints: 0,
      ppShots: 0,
      ppShootingPct: 0.0,
      shareTeamPpGoals: 0.0,
      shareTeamPpPoints: 0.0,
      shTimeOnIcePerGame: 2.9,
      shBlockedShots: 16,
      shBlockedShotsPerMinute: 0.276,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
    {
      playerId: "TOR-3",
      name: "Chris Tanev",
      team: "TOR",
      position: "D",
      unit: "PK1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 0.0,
      ppGoals: 0,
      ppAssists: 0,
      ppPoints: 0,
      ppShots: 0,
      ppShootingPct: 0.0,
      shareTeamPpGoals: 0.0,
      shareTeamPpPoints: 0.0,
      shTimeOnIcePerGame: 3.0,
      shBlockedShots: 19,
      shBlockedShotsPerMinute: 0.317,
      isInjured: false,
      source: "MOCK_FIXTURE",
    },
  ];

  await prisma.nhlSpecialTeamsPlayer.createMany({ data: nhlPlayers });
  console.log(`Seeded ${nhlPlayers.length} NHL special-teams players.`);

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
