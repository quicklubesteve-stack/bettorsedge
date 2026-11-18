const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const nflRaw = require("./nfl-2026-extracted.json");

// Define conference seeds & rankConference for each conference
const afcOrder = ["BUF", "JAX", "CIN", "KC", "DEN", "PIT", "CLE", "NE", "LV", "BAL", "HOU", "IND", "NYJ", "TEN", "MIA", "LAC"];
const nfcOrder = ["SF", "DET", "NYG", "CAR", "CHI", "MIN", "LAR", "SEA", "GB", "DAL", "WAS", "TB", "NO", "ATL", "ARI", "PHI"];

// Define league rank (1 to 32) sorted by pct desc, net desc
const leagueRankOrder = [
  "BUF", "SF", "JAX", "CIN", "KC", "DET", "CHI", "MIN", "DEN", "PIT",
  "NYG", "LAR", "SEA", "GB", "CLE", "NE", "CAR", "DAL", "LV", "BAL",
  "WAS", "TB", "HOU", "NO", "IND", "ATL", "ARI", "PHI", "NYJ", "TEN",
  "MIA", "LAC"
];

const NFL_STANDINGS_NFL_COM = nflRaw.map((t) => {
  const isAfc = t.conf === "AFC";
  const confList = isAfc ? afcOrder : nfcOrder;
  const confRank = confList.indexOf(t.team) + 1;
  const seed = confRank <= 7 ? confRank : null;
  const leagueRank = leagueRankOrder.indexOf(t.team) + 1;

  return {
    ...t,
    confRank,
    seed,
    leagueRank,
  };
});

// NHL Standings (2026-11-18 Official NHL.com Division Standings)
const NHL_STANDINGS_2025 = require("./nhl-standings-parsed.json");

async function seedStandings() {
  console.log("=== SEEDING OFFICIAL 2026 NFL.COM DIVISION STANDINGS ===");

  await prisma.teamStandings.deleteMany({});

  const now = new Date();

  // 1. Seed NFL Standings directly scraped from https://www.nfl.com/standings/
  for (const t of NFL_STANDINGS_NFL_COM) {
    const gamesPlayed = t.w + t.l + t.t;
    const winPct = gamesPlayed > 0 ? Number(((t.w + 0.5 * t.t) / gamesPlayed).toFixed(3)) : 0;
    const pointDiff = t.net;

    await prisma.teamStandings.create({
      data: {
        league: "NFL",
        season: "2026",
        team: t.team,
        name: t.name,
        conference: t.conf,
        division: t.div,
        rankDivision: t.divRank,
        rankConference: t.confRank,
        rankLeague: t.leagueRank,
        playoffSeed: t.seed,
        gamesPlayed,
        wins: t.w,
        losses: t.l,
        ties: t.t,
        winPct,
        pointsFor: t.pf,
        pointsAgainst: t.pa,
        pointDiff,
        homeRecord: t.home,
        awayRecord: t.away,
        divisionRecord: t.divRec,
        conferenceRecord: t.confRec,
        streak: t.strk,
        lastTen: t.l5,
        lastUpdated: now,
      },
    });
  }
  console.log(`✅ Seeded all 32 NFL team standings matching official NFL.com table.`);

  // 2. Seed NHL Standings
  for (const t of NHL_STANDINGS_2025) {
    const goalDiff = t.gf - t.ga;

    await prisma.teamStandings.create({
      data: {
        league: "NHL",
        season: "2026",
        team: t.team,
        name: t.name,
        conference: t.conf,
        division: t.div,
        rankDivision: t.divRank,
        rankConference: t.confRank,
        rankLeague: t.leagueRank,
        playoffSeed: t.seed,
        gamesPlayed: t.gp,
        wins: t.w,
        losses: t.l,
        otLosses: t.otl,
        points: t.pts,
        regulationWins: t.rw,
        goalsFor: t.gf,
        goalsAgainst: t.ga,
        goalDiff,
        homeRecord: t.home,
        awayRecord: t.away,
        streak: t.strk,
        lastTen: t.l10,
        lastUpdated: now,
      },
    });
  }
  console.log(`✅ Seeded all 32 NHL team standings.`);

  console.log("=== 2026 NFL.COM STANDINGS SEED COMPLETE ===");
}

module.exports = { seedStandings, NFL_STANDINGS_NFL_COM, NHL_STANDINGS_2025 };

if (require.main === module) {
  seedStandings()
    .catch((e) => {
      console.error("Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
