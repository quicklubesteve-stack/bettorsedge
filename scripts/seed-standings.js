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

// NHL Standings (2025–2026)
const NHL_STANDINGS_2025 = [
  // ATLANTIC DIVISION
  { team: "FLA", name: "Florida Panthers", conf: "Eastern", div: "Atlantic", gp: 18, w: 12, l: 5, otl: 1, pts: 25, rw: 11, gf: 67, ga: 56, home: "6-3-1", away: "6-2-0", strk: "W1", l10: "7-3-0", divRank: 1, confRank: 3, leagueRank: 5, seed: 2 },
  { team: "TOR", name: "Toronto Maple Leafs", conf: "Eastern", div: "Atlantic", gp: 19, w: 11, l: 6, otl: 2, pts: 24, rw: 9, gf: 58, ga: 51, home: "7-3-0", away: "4-3-2", strk: "L1", l10: "6-3-1", divRank: 2, confRank: 5, leagueRank: 6, seed: 4 },
  { team: "TBL", name: "Tampa Bay Lightning", conf: "Eastern", div: "Atlantic", gp: 16, w: 9, l: 6, otl: 1, pts: 19, rw: 8, gf: 57, ga: 46, home: "5-1-1", away: "4-5-0", strk: "W2", l10: "5-4-1", divRank: 3, confRank: 7, leagueRank: 13, seed: 6 },
  { team: "BOS", name: "Boston Bruins", conf: "Eastern", div: "Atlantic", gp: 20, w: 8, l: 9, otl: 3, pts: 19, rw: 7, gf: 50, ga: 70, home: "5-4-1", away: "3-5-2", strk: "L2", l10: "4-5-1", divRank: 4, confRank: 8, leagueRank: 14, seed: 8 },
  { team: "OTT", name: "Ottawa Senators", conf: "Eastern", div: "Atlantic", gp: 17, w: 8, l: 8, otl: 1, pts: 17, rw: 7, gf: 55, ga: 54, home: "5-2-1", away: "3-6-0", strk: "L2", l10: "4-5-1", divRank: 5, confRank: 11, leagueRank: 18, seed: null },
  { team: "BUF", name: "Buffalo Sabres", conf: "Eastern", div: "Atlantic", gp: 18, w: 8, l: 9, otl: 1, pts: 17, rw: 7, gf: 57, ga: 61, home: "5-5-0", away: "3-4-1", strk: "L2", l10: "4-5-1", divRank: 6, confRank: 12, leagueRank: 19, seed: null },
  { team: "DET", name: "Detroit Red Wings", conf: "Eastern", div: "Atlantic", gp: 18, w: 7, l: 9, otl: 2, pts: 16, rw: 6, gf: 44, ga: 57, home: "4-4-1", away: "3-5-1", strk: "L2", l10: "3-5-2", divRank: 7, confRank: 15, leagueRank: 24, seed: null },
  { team: "MTL", name: "Montreal Canadiens", conf: "Eastern", div: "Atlantic", gp: 19, w: 7, l: 10, otl: 2, pts: 16, rw: 6, gf: 52, ga: 74, home: "4-5-1", away: "3-5-1", strk: "W2", l10: "4-5-1", divRank: 8, confRank: 16, leagueRank: 25, seed: null },

  // METROPOLITAN DIVISION
  { team: "WSH", name: "Washington Capitals", conf: "Eastern", div: "Metropolitan", gp: 18, w: 13, l: 4, otl: 1, pts: 27, rw: 13, gf: 78, ga: 50, home: "7-2-1", away: "6-2-0", strk: "W3", l10: "8-1-1", divRank: 1, confRank: 1, leagueRank: 2, seed: 1 },
  { team: "CAR", name: "Carolina Hurricanes", conf: "Eastern", div: "Metropolitan", gp: 17, w: 13, l: 4, otl: 0, pts: 26, rw: 11, gf: 67, ga: 43, home: "7-1-0", away: "6-3-0", strk: "L1", l10: "8-2-0", divRank: 2, confRank: 2, leagueRank: 3, seed: 3 },
  { team: "NJD", name: "New Jersey Devils", conf: "Eastern", div: "Metropolitan", gp: 21, w: 12, l: 7, otl: 2, pts: 26, rw: 11, gf: 72, ga: 59, home: "4-4-2", away: "8-3-0", strk: "L1", l10: "6-3-1", divRank: 3, confRank: 4, leagueRank: 4, seed: 5 },
  { team: "NYR", name: "New York Rangers", conf: "Eastern", div: "Metropolitan", gp: 16, w: 11, l: 4, otl: 1, pts: 23, rw: 10, gf: 59, ga: 40, home: "5-2-1", away: "6-2-0", strk: "W2", l10: "7-3-0", divRank: 4, confRank: 6, leagueRank: 8, seed: 7 },
  { team: "NYI", name: "New York Islanders", conf: "Eastern", div: "Metropolitan", gp: 18, w: 7, l: 7, otl: 4, pts: 18, rw: 6, gf: 45, ga: 55, home: "3-4-2", away: "4-3-2", strk: "L1", l10: "4-3-3", divRank: 5, confRank: 9, leagueRank: 15, seed: null },
  { team: "PHI", name: "Philadelphia Flyers", conf: "Eastern", div: "Metropolitan", gp: 19, w: 8, l: 9, otl: 2, pts: 18, rw: 5, gf: 53, ga: 67, home: "4-4-0", away: "4-5-2", strk: "L1", l10: "5-4-1", divRank: 6, confRank: 10, leagueRank: 16, seed: null },
  { team: "PIT", name: "Pittsburgh Penguins", conf: "Eastern", div: "Metropolitan", gp: 20, w: 7, l: 10, otl: 3, pts: 17, rw: 6, gf: 56, ga: 76, home: "4-4-1", away: "3-6-2", strk: "W1", l10: "4-4-2", divRank: 7, confRank: 13, leagueRank: 20, seed: null },
  { team: "CBJ", name: "Columbus Blue Jackets", conf: "Eastern", div: "Metropolitan", gp: 18, w: 7, l: 9, otl: 2, pts: 16, rw: 6, gf: 56, ga: 64, home: "5-3-1", away: "2-6-1", strk: "W1", l10: "4-5-1", divRank: 8, confRank: 14, leagueRank: 23, seed: null },

  // CENTRAL DIVISION
  { team: "WPG", name: "Winnipeg Jets", conf: "Western", div: "Central", gp: 18, w: 15, l: 3, otl: 0, pts: 30, rw: 14, gf: 77, ga: 43, home: "8-1-0", away: "7-2-0", strk: "L2", l10: "7-3-0", divRank: 1, confRank: 1, leagueRank: 1, seed: 1 },
  { team: "MIN", name: "Minnesota Wild", conf: "Western", div: "Central", gp: 17, w: 11, l: 3, otl: 3, pts: 25, rw: 10, gf: 58, ga: 41, home: "4-1-1", away: "7-2-2", strk: "L1", l10: "6-2-2", divRank: 2, confRank: 2, leagueRank: 7, seed: 3 },
  { team: "DAL", name: "Dallas Stars", conf: "Western", div: "Central", gp: 16, w: 11, l: 5, otl: 0, pts: 22, rw: 11, gf: 55, ga: 37, home: "7-1-0", away: "4-4-0", strk: "W3", l10: "7-3-0", divRank: 3, confRank: 4, leagueRank: 9, seed: 5 },
  { team: "COL", name: "Colorado Avalanche", conf: "Western", div: "Central", gp: 18, w: 10, l: 8, otl: 0, pts: 20, rw: 9, gf: 62, ga: 67, home: "6-5-0", away: "4-3-0", strk: "W1", l10: "6-4-0", divRank: 4, confRank: 8, leagueRank: 11, seed: 8 },
  { team: "UTA", name: "Utah Hockey Club", conf: "Western", div: "Central", gp: 18, w: 7, l: 8, otl: 3, pts: 17, rw: 5, gf: 49, ga: 59, home: "4-4-1", away: "3-4-2", strk: "L1", l10: "3-5-2", divRank: 5, confRank: 10, leagueRank: 17, seed: null },
  { team: "STL", name: "St. Louis Blues", conf: "Western", div: "Central", gp: 19, w: 8, l: 10, otl: 1, pts: 17, rw: 5, gf: 46, ga: 65, home: "4-5-1", away: "4-5-0", strk: "L1", l10: "3-6-1", divRank: 6, confRank: 11, leagueRank: 21, seed: null },
  { team: "CHI", name: "Chicago Blackhawks", conf: "Western", div: "Central", gp: 18, w: 6, l: 11, otl: 1, pts: 13, rw: 4, gf: 41, ga: 56, home: "2-4-0", away: "4-7-1", strk: "L2", l10: "4-5-1", divRank: 7, confRank: 14, leagueRank: 29, seed: null },
  { team: "NSH", name: "Nashville Predators", conf: "Western", div: "Central", gp: 18, w: 5, l: 10, otl: 3, pts: 13, rw: 5, gf: 41, ga: 59, home: "4-6-0", away: "1-4-3", strk: "L4", l10: "2-5-3", divRank: 8, confRank: 15, leagueRank: 30, seed: null },

  // PACIFIC DIVISION
  { team: "VGK", name: "Vegas Golden Knights", conf: "Western", div: "Pacific", gp: 18, w: 11, l: 5, otl: 2, pts: 24, rw: 10, gf: 72, ga: 57, home: "8-2-0", away: "3-3-2", strk: "L1", l10: "6-3-1", divRank: 1, confRank: 3, leagueRank: 10, seed: 2 },
  { team: "LAK", name: "Los Angeles Kings", conf: "Western", div: "Pacific", gp: 19, w: 10, l: 6, otl: 3, pts: 23, rw: 9, gf: 59, ga: 52, home: "5-1-1", away: "5-5-2", strk: "L1", l10: "5-4-1", divRank: 2, confRank: 5, leagueRank: 12, seed: 4 },
  { team: "EDM", name: "Edmonton Oilers", conf: "Western", div: "Pacific", gp: 19, w: 9, l: 8, otl: 2, pts: 20, rw: 6, gf: 52, ga: 60, home: "4-5-1", away: "5-3-1", strk: "L1", l10: "5-4-1", divRank: 3, confRank: 6, leagueRank: 15, seed: 6 },
  { team: "CGY", name: "Calgary Flames", conf: "Western", div: "Pacific", gp: 18, w: 9, l: 6, otl: 3, pts: 21, rw: 6, gf: 50, ga: 51, home: "5-3-1", away: "4-3-2", strk: "L1", l10: "4-5-1", divRank: 4, confRank: 7, leagueRank: 14, seed: 7 },
  { team: "VAN", name: "Vancouver Canucks", conf: "Western", div: "Pacific", gp: 17, w: 9, l: 5, otl: 3, pts: 21, rw: 7, gf: 54, ga: 53, home: "3-4-3", away: "6-1-0", strk: "L1", l10: "5-4-1", divRank: 5, confRank: 9, leagueRank: 16, seed: null },
  { team: "SEA", name: "Seattle Kraken", conf: "Western", div: "Pacific", gp: 19, w: 9, l: 9, otl: 1, pts: 19, rw: 7, gf: 57, ga: 57, home: "6-3-1", away: "3-6-0", strk: "W4", l10: "5-5-0", divRank: 6, confRank: 12, leagueRank: 22, seed: null },
  { team: "ANA", name: "Anaheim Ducks", conf: "Western", div: "Pacific", gp: 17, w: 7, l: 8, otl: 2, pts: 16, rw: 5, gf: 42, ga: 52, home: "4-4-1", away: "3-4-1", strk: "W2", l10: "4-5-1", divRank: 7, confRank: 14, leagueRank: 26, seed: null },
  { team: "SJS", name: "San Jose Sharks", conf: "Western", div: "Pacific", gp: 20, w: 6, l: 10, otl: 4, pts: 16, rw: 4, gf: 51, ga: 69, home: "4-4-1", away: "2-6-3", strk: "L3", l10: "2-7-1", divRank: 8, confRank: 16, leagueRank: 28, seed: null },
];

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
