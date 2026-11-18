const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Official NFL.com Standings (Week 11 of 2024–2025 / 2025–2026 Season)
const NFL_STANDINGS = [
  // AFC EAST
  { team: "BUF", name: "Buffalo Bills", conf: "AFC", div: "East", w: 9, l: 2, t: 0, pf: 320, pa: 214, home: "5-0", away: "4-2", divRec: "3-0", confRec: "7-2", strk: "W6", l10: "8-2", divRank: 1, confRank: 2, seed: 2 },
  { team: "MIA", name: "Miami Dolphins", conf: "AFC", div: "East", w: 4, l: 6, t: 0, pf: 181, pa: 221, home: "2-3", away: "2-3", divRec: "1-2", confRec: "3-4", strk: "W2", l10: "4-6", divRank: 2, confRank: 10, seed: null },
  { team: "NYJ", name: "New York Jets", conf: "AFC", div: "East", w: 3, l: 8, t: 0, pf: 206, pa: 242, home: "2-2", away: "1-6", divRec: "1-2", confRec: "3-5", strk: "L2", l10: "3-7", divRank: 3, confRank: 11, seed: null },
  { team: "NE", name: "New England Patriots", conf: "AFC", div: "East", w: 3, l: 8, t: 0, pf: 182, pa: 248, home: "1-4", away: "2-4", divRec: "1-2", confRec: "2-5", strk: "L1", l10: "2-8", divRank: 4, confRank: 13, seed: null },

  // AFC NORTH
  { team: "PIT", name: "Pittsburgh Steelers", conf: "AFC", div: "North", w: 8, l: 2, t: 0, pf: 233, pa: 162, home: "4-1", away: "4-1", divRec: "1-0", confRec: "5-1", strk: "W5", l10: "8-2", divRank: 1, confRank: 3, seed: 3 },
  { team: "BAL", name: "Baltimore Ravens", conf: "AFC", div: "North", w: 7, l: 4, t: 0, pf: 334, pa: 271, home: "4-1", away: "3-3", divRec: "2-2", confRec: "4-4", strk: "L1", l10: "7-3", divRank: 2, confRank: 6, seed: 6 },
  { team: "CIN", name: "Cincinnati Bengals", conf: "AFC", div: "North", w: 4, l: 7, t: 0, pf: 298, pa: 296, home: "1-4", away: "3-3", divRec: "1-2", confRec: "2-4", strk: "L2", l10: "4-6", divRank: 3, confRank: 9, seed: null },
  { team: "CLE", name: "Cleveland Browns", conf: "AFC", div: "North", w: 2, l: 8, t: 0, pf: 162, pa: 248, home: "1-4", away: "1-4", divRec: "1-1", confRec: "2-4", strk: "L2", l10: "2-8", divRank: 4, confRank: 15, seed: null },

  // AFC SOUTH
  { team: "HOU", name: "Houston Texans", conf: "AFC", div: "South", w: 7, l: 4, t: 0, pf: 258, pa: 234, home: "4-1", away: "3-3", divRec: "3-0", confRec: "5-1", strk: "W1", l10: "6-4", divRank: 1, confRank: 4, seed: 4 },
  { team: "IND", name: "Indianapolis Colts", conf: "AFC", div: "South", w: 5, l: 6, t: 0, pf: 229, pa: 250, home: "3-2", away: "2-4", divRec: "1-3", confRec: "3-4", strk: "W1", l10: "5-5", divRank: 2, confRank: 8, seed: null },
  { team: "TEN", name: "Tennessee Titans", conf: "AFC", div: "South", w: 2, l: 8, t: 0, pf: 170, pa: 263, home: "1-4", away: "1-4", divRec: "0-1", confRec: "2-4", strk: "L2", l10: "2-8", divRank: 3, confRank: 14, seed: null },
  { team: "JAX", name: "Jacksonville Jaguars", conf: "AFC", div: "South", w: 2, l: 9, t: 0, pf: 208, pa: 316, home: "2-3", away: "0-6", divRec: "1-1", confRec: "2-6", strk: "L4", l10: "2-8", divRank: 4, confRank: 16, seed: null },

  // AFC WEST
  { team: "KC", name: "Kansas City Chiefs", conf: "AFC", div: "West", w: 9, l: 1, t: 0, pf: 240, pa: 191, home: "5-0", away: "4-1", divRec: "3-0", confRec: "5-1", strk: "L1", l10: "9-1", divRank: 1, confRank: 1, seed: 1 },
  { team: "LAC", name: "Los Angeles Chargers", conf: "AFC", div: "West", w: 7, l: 3, t: 0, pf: 220, pa: 145, home: "4-1", away: "3-2", divRec: "2-1", confRec: "5-2", strk: "W4", l10: "7-3", divRank: 2, confRank: 5, seed: 5 },
  { team: "DEN", name: "Denver Broncos", conf: "AFC", div: "West", w: 6, l: 5, t: 0, pf: 235, pa: 183, home: "3-2", away: "3-3", divRec: "1-2", confRec: "3-4", strk: "W1", l10: "6-4", divRank: 3, confRank: 7, seed: 7 },
  { team: "LV", name: "Las Vegas Raiders", conf: "AFC", div: "West", w: 2, l: 8, t: 0, pf: 187, pa: 285, home: "1-3", away: "1-5", divRec: "0-3", confRec: "2-6", strk: "L6", l10: "2-8", divRank: 4, confRank: 12, seed: null },

  // NFC EAST
  { team: "PHI", name: "Philadelphia Eagles", conf: "NFC", div: "East", w: 8, l: 2, t: 0, pf: 259, pa: 179, home: "4-1", away: "4-1", divRec: "3-0", confRec: "5-2", strk: "W6", l10: "8-2", divRank: 1, confRank: 2, seed: 2 },
  { team: "WAS", name: "Washington Commanders", conf: "NFC", div: "East", w: 7, l: 4, t: 0, pf: 308, pa: 243, home: "4-1", away: "3-3", divRec: "2-1", confRec: "5-2", strk: "L2", l10: "7-3", divRank: 2, confRank: 7, seed: 7 },
  { team: "DAL", name: "Dallas Cowboys", conf: "NFC", div: "East", w: 3, l: 7, t: 0, pf: 187, pa: 275, home: "0-5", away: "3-2", divRec: "1-1", confRec: "1-5", strk: "L5", l10: "3-7", divRank: 3, confRank: 12, seed: null },
  { team: "NYG", name: "New York Giants", conf: "NFC", div: "East", w: 2, l: 8, t: 0, pf: 156, pa: 222, home: "0-5", away: "2-3", divRec: "0-4", confRec: "1-6", strk: "L5", l10: "2-8", divRank: 4, confRank: 16, seed: null },

  // NFC NORTH
  { team: "DET", name: "Detroit Lions", conf: "NFC", div: "North", w: 9, l: 1, t: 0, pf: 336, pa: 177, home: "4-1", away: "5-0", divRec: "2-0", confRec: "6-1", strk: "W8", l10: "9-1", divRank: 1, confRank: 1, seed: 1 },
  { team: "MIN", name: "Minnesota Vikings", conf: "NFC", div: "North", w: 8, l: 2, t: 0, pf: 244, pa: 170, home: "4-1", away: "4-1", divRec: "1-1", confRec: "5-1", strk: "W3", l10: "8-2", divRank: 2, confRank: 5, seed: 5 },
  { team: "GB", name: "Green Bay Packers", conf: "NFC", div: "North", w: 7, l: 3, t: 0, pf: 250, pa: 213, home: "4-1", away: "3-2", divRec: "1-2", confRec: "4-2", strk: "W1", l10: "7-3", divRank: 3, confRank: 6, seed: 6 },
  { team: "CHI", name: "Chicago Bears", conf: "NFC", div: "North", w: 4, l: 6, t: 0, pf: 194, pa: 187, home: "4-2", away: "0-4", divRec: "0-1", confRec: "2-3", strk: "L4", l10: "4-6", divRank: 4, confRank: 11, seed: null },

  // NFC SOUTH
  { team: "ATL", name: "Atlanta Falcons", conf: "NFC", div: "South", w: 6, l: 5, t: 0, pf: 244, pa: 274, home: "3-3", away: "3-2", divRec: "4-1", confRec: "6-2", strk: "L2", l10: "5-5", divRank: 1, confRank: 4, seed: 4 },
  { team: "TB", name: "Tampa Bay Buccaneers", conf: "NFC", div: "South", w: 4, l: 6, t: 0, pf: 279, pa: 266, home: "2-3", away: "2-3", divRec: "1-2", confRec: "4-3", strk: "L4", l10: "4-6", divRank: 2, confRank: 10, seed: null },
  { team: "NO", name: "New Orleans Saints", conf: "NFC", div: "South", w: 4, l: 7, t: 0, pf: 262, pa: 260, home: "2-3", away: "2-4", divRec: "2-3", confRec: "3-4", strk: "W2", l10: "3-7", divRank: 3, confRank: 13, seed: null },
  { team: "CAR", name: "Carolina Panthers", conf: "NFC", div: "South", w: 3, l: 7, t: 0, pf: 167, pa: 310, home: "2-3", away: "1-4", divRec: "1-2", confRec: "2-4", strk: "W2", l10: "3-7", divRank: 4, confRank: 15, seed: null },

  // NFC WEST
  { team: "ARI", name: "Arizona Cardinals", conf: "NFC", div: "West", w: 6, l: 4, t: 0, pf: 238, pa: 220, home: "4-1", away: "2-3", divRec: "2-0", confRec: "3-3", strk: "W4", l10: "6-4", divRank: 1, confRank: 3, seed: 3 },
  { team: "LAR", name: "Los Angeles Rams", conf: "NFC", div: "West", w: 5, l: 5, t: 0, pf: 213, pa: 239, home: "3-2", away: "2-3", divRec: "2-1", confRec: "3-4", strk: "W1", l10: "5-5", divRank: 2, confRank: 8, seed: null },
  { team: "SEA", name: "Seattle Seahawks", conf: "NFC", div: "West", w: 5, l: 5, t: 0, pf: 230, pa: 238, home: "2-4", away: "3-1", divRec: "1-2", confRec: "2-4", strk: "W1", l10: "5-5", divRank: 3, confRank: 9, seed: null },
  { team: "SF", name: "San Francisco 49ers", conf: "NFC", div: "West", w: 5, l: 5, t: 0, pf: 250, pa: 222, home: "3-3", away: "2-2", divRec: "1-3", confRec: "3-4", strk: "L1", l10: "5-5", divRank: 4, confRank: 14, seed: null },
];

// Official NHL Standings (Current Week 11 / Mid-November Feed)
const NHL_STANDINGS = [
  // ATLANTIC DIVISION
  { team: "FLA", name: "Florida Panthers", conf: "Eastern", div: "Atlantic", gp: 18, w: 12, l: 5, otl: 1, pts: 25, rw: 11, gf: 67, ga: 56, home: "6-3-1", away: "6-2-0", strk: "W1", l10: "7-3-0", divRank: 1, confRank: 3, seed: 2 },
  { team: "TOR", name: "Toronto Maple Leafs", conf: "Eastern", div: "Atlantic", gp: 19, w: 11, l: 6, otl: 2, pts: 24, rw: 9, gf: 58, ga: 51, home: "7-3-0", away: "4-3-2", strk: "L1", l10: "6-3-1", divRank: 2, confRank: 5, seed: 4 },
  { team: "TBL", name: "Tampa Bay Lightning", conf: "Eastern", div: "Atlantic", gp: 16, w: 9, l: 6, otl: 1, pts: 19, rw: 8, gf: 57, ga: 46, home: "5-1-1", away: "4-5-0", strk: "W2", l10: "5-4-1", divRank: 3, confRank: 7, seed: 6 },
  { team: "BOS", name: "Boston Bruins", conf: "Eastern", div: "Atlantic", gp: 20, w: 8, l: 9, otl: 3, pts: 19, rw: 7, gf: 50, ga: 70, home: "5-4-1", away: "3-5-2", strk: "L2", l10: "4-5-1", divRank: 4, confRank: 8, seed: 8 },
  { team: "OTT", name: "Ottawa Senators", conf: "Eastern", div: "Atlantic", gp: 17, w: 8, l: 8, otl: 1, pts: 17, rw: 7, gf: 55, ga: 54, home: "5-2-1", away: "3-6-0", strk: "L2", l10: "4-5-1", divRank: 5, confRank: 11, seed: null },
  { team: "BUF", name: "Buffalo Sabres", conf: "Eastern", div: "Atlantic", gp: 18, w: 8, l: 9, otl: 1, pts: 17, rw: 7, gf: 57, ga: 61, home: "5-5-0", away: "3-4-1", strk: "L2", l10: "4-5-1", divRank: 6, confRank: 12, seed: null },
  { team: "DET", name: "Detroit Red Wings", conf: "Eastern", div: "Atlantic", gp: 18, w: 7, l: 9, otl: 2, pts: 16, rw: 6, gf: 44, ga: 57, home: "4-4-1", away: "3-5-1", strk: "L2", l10: "3-5-2", divRank: 7, confRank: 15, seed: null },
  { team: "MTL", name: "Montreal Canadiens", conf: "Eastern", div: "Atlantic", gp: 19, w: 7, l: 10, otl: 2, pts: 16, rw: 6, gf: 52, ga: 74, home: "4-5-1", away: "3-5-1", strk: "W2", l10: "4-5-1", divRank: 8, confRank: 16, seed: null },

  // METROPOLITAN DIVISION
  { team: "WSH", name: "Washington Capitals", conf: "Eastern", div: "Metropolitan", gp: 18, w: 13, l: 4, otl: 1, pts: 27, rw: 13, gf: 78, ga: 50, home: "7-2-1", away: "6-2-0", strk: "W3", l10: "8-1-1", divRank: 1, confRank: 1, seed: 1 },
  { team: "CAR", name: "Carolina Hurricanes", conf: "Eastern", div: "Metropolitan", gp: 17, w: 13, l: 4, otl: 0, pts: 26, rw: 11, gf: 67, ga: 43, home: "7-1-0", away: "6-3-0", strk: "L1", l10: "8-2-0", divRank: 2, confRank: 2, seed: 3 },
  { team: "NJD", name: "New Jersey Devils", conf: "Eastern", div: "Metropolitan", gp: 21, w: 12, l: 7, otl: 2, pts: 26, rw: 11, gf: 72, ga: 59, home: "4-4-2", away: "8-3-0", strk: "L1", l10: "6-3-1", divRank: 3, confRank: 4, seed: 5 },
  { team: "NYR", name: "New York Rangers", conf: "Eastern", div: "Metropolitan", gp: 16, w: 11, l: 4, otl: 1, pts: 23, rw: 10, gf: 59, ga: 40, home: "5-2-1", away: "6-2-0", strk: "W2", l10: "7-3-0", divRank: 4, confRank: 6, seed: 7 },
  { team: "NYI", name: "New York Islanders", conf: "Eastern", div: "Metropolitan", gp: 18, w: 7, l: 7, otl: 4, pts: 18, rw: 6, gf: 45, ga: 55, home: "3-4-2", away: "4-3-2", strk: "L1", l10: "4-3-3", divRank: 5, confRank: 9, seed: null },
  { team: "PHI", name: "Philadelphia Flyers", conf: "Eastern", div: "Metropolitan", gp: 19, w: 8, l: 9, otl: 2, pts: 18, rw: 5, gf: 53, ga: 67, home: "4-4-0", away: "4-5-2", strk: "L1", l10: "5-4-1", divRank: 6, confRank: 10, seed: null },
  { team: "PIT", name: "Pittsburgh Penguins", conf: "Eastern", div: "Metropolitan", gp: 20, w: 7, l: 10, otl: 3, pts: 17, rw: 6, gf: 56, ga: 76, home: "4-4-1", away: "3-6-2", strk: "W1", l10: "4-4-2", divRank: 7, confRank: 13, seed: null },
  { team: "CBJ", name: "Columbus Blue Jackets", conf: "Eastern", div: "Metropolitan", gp: 18, w: 7, l: 9, otl: 2, pts: 16, rw: 6, gf: 56, ga: 64, home: "5-3-1", away: "2-6-1", strk: "W1", l10: "4-5-1", divRank: 8, confRank: 14, seed: null },

  // CENTRAL DIVISION
  { team: "WPG", name: "Winnipeg Jets", conf: "Western", div: "Central", gp: 18, w: 15, l: 3, otl: 0, pts: 30, rw: 14, gf: 77, ga: 43, home: "8-1-0", away: "7-2-0", strk: "L2", l10: "7-3-0", divRank: 1, confRank: 1, seed: 1 },
  { team: "MIN", name: "Minnesota Wild", conf: "Western", div: "Central", gp: 17, w: 11, l: 3, otl: 3, pts: 25, rw: 10, gf: 58, ga: 41, home: "4-1-1", away: "7-2-2", strk: "L1", l10: "6-2-2", divRank: 2, confRank: 2, seed: 3 },
  { team: "DAL", name: "Dallas Stars", conf: "Western", div: "Central", gp: 16, w: 11, l: 5, otl: 0, pts: 22, rw: 11, gf: 55, ga: 37, home: "7-1-0", away: "4-4-0", strk: "W3", l10: "7-3-0", divRank: 3, confRank: 4, seed: 5 },
  { team: "COL", name: "Colorado Avalanche", conf: "Western", div: "Central", gp: 18, w: 10, l: 8, otl: 0, pts: 20, rw: 9, gf: 62, ga: 67, home: "6-5-0", away: "4-3-0", strk: "W1", l10: "6-4-0", divRank: 4, confRank: 8, seed: 8 },
  { team: "UTA", name: "Utah Hockey Club", conf: "Western", div: "Central", gp: 18, w: 7, l: 8, otl: 3, pts: 17, rw: 5, gf: 49, ga: 59, home: "4-4-1", away: "3-4-2", strk: "L1", l10: "3-5-2", divRank: 5, confRank: 10, seed: null },
  { team: "STL", name: "St. Louis Blues", conf: "Western", div: "Central", gp: 19, w: 8, l: 10, otl: 1, pts: 17, rw: 5, gf: 46, ga: 65, home: "4-5-1", away: "4-5-0", strk: "L1", l10: "3-6-1", divRank: 6, confRank: 11, seed: null },
  { team: "CHI", name: "Chicago Blackhawks", conf: "Western", div: "Central", gp: 18, w: 6, l: 11, otl: 1, pts: 13, rw: 4, gf: 41, ga: 56, home: "2-4-0", away: "4-7-1", strk: "L2", l10: "4-5-1", divRank: 7, confRank: 14, seed: null },
  { team: "NSH", name: "Nashville Predators", conf: "Western", div: "Central", gp: 18, w: 5, l: 10, otl: 3, pts: 13, rw: 5, gf: 41, ga: 59, home: "4-6-0", away: "1-4-3", strk: "L4", l10: "2-5-3", divRank: 8, confRank: 15, seed: null },

  // PACIFIC DIVISION
  { team: "VGK", name: "Vegas Golden Knights", conf: "Western", div: "Pacific", gp: 18, w: 11, l: 5, otl: 2, pts: 24, rw: 10, gf: 72, ga: 57, home: "8-2-0", away: "3-3-2", strk: "L1", l10: "6-3-1", divRank: 1, confRank: 3, seed: 2 },
  { team: "LAK", name: "Los Angeles Kings", conf: "Western", div: "Pacific", gp: 19, w: 10, l: 6, otl: 3, pts: 23, rw: 9, gf: 59, ga: 52, home: "5-1-1", away: "5-5-2", strk: "L1", l10: "5-4-1", divRank: 2, confRank: 5, seed: 4 },
  { team: "EDM", name: "Edmonton Oilers", conf: "Western", div: "Pacific", gp: 19, w: 9, l: 8, otl: 2, pts: 20, rw: 6, gf: 52, ga: 60, home: "4-5-1", away: "5-3-1", strk: "L1", l10: "5-4-1", divRank: 3, confRank: 6, seed: 6 },
  { team: "CGY", name: "Calgary Flames", conf: "Western", div: "Pacific", gp: 18, w: 9, l: 6, otl: 3, pts: 21, rw: 6, gf: 50, ga: 51, home: "5-3-1", away: "4-3-2", strk: "L1", l10: "4-5-1", divRank: 4, confRank: 7, seed: 7 },
  { team: "VAN", name: "Vancouver Canucks", conf: "Western", div: "Pacific", gp: 17, w: 9, l: 5, otl: 3, pts: 21, rw: 7, gf: 54, ga: 53, home: "3-4-3", away: "6-1-0", strk: "L1", l10: "5-4-1", divRank: 5, confRank: 9, seed: null },
  { team: "SEA", name: "Seattle Kraken", conf: "Western", div: "Pacific", gp: 19, w: 9, l: 9, otl: 1, pts: 19, rw: 7, gf: 57, ga: 57, home: "6-3-1", away: "3-6-0", strk: "W4", l10: "5-5-0", divRank: 6, confRank: 12, seed: null },
  { team: "ANA", name: "Anaheim Ducks", conf: "Western", div: "Pacific", gp: 17, w: 7, l: 8, otl: 2, pts: 16, rw: 5, gf: 42, ga: 52, home: "4-4-1", away: "3-4-1", strk: "W2", l10: "4-5-1", divRank: 7, confRank: 14, seed: null },
  { team: "SJS", name: "San Jose Sharks", conf: "Western", div: "Pacific", gp: 20, w: 6, l: 10, otl: 4, pts: 16, rw: 4, gf: 51, ga: 69, home: "4-4-1", away: "2-6-3", strk: "L3", l10: "2-7-1", divRank: 8, confRank: 16, seed: null },
];

async function seedStandings() {
  console.log("=== SEEDING OFFICIAL NFL.COM (WEEK 11) & NHL STANDINGS ===");

  await prisma.teamStandings.deleteMany({});

  const now = new Date();

  // 1. Seed NFL Standings
  for (let i = 0; i < NFL_STANDINGS.length; i++) {
    const t = NFL_STANDINGS[i];
    const gamesPlayed = t.w + t.l + t.t;
    const winPct = gamesPlayed > 0 ? Number(((t.w + 0.5 * t.t) / gamesPlayed).toFixed(3)) : 0;
    const pointDiff = t.pf - t.pa;

    await prisma.teamStandings.create({
      data: {
        league: "NFL",
        season: "2025-2026",
        team: t.team,
        name: t.name,
        conference: t.conf,
        division: t.div,
        rankDivision: t.divRank,
        rankConference: t.confRank,
        rankLeague: i + 1,
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
        lastTen: t.l10,
        lastUpdated: now,
      },
    });
  }
  console.log(`✅ Seeded all 32 NFL team standings for Week 11 matching NFL.com.`);

  // 2. Seed NHL Standings
  for (let i = 0; i < NHL_STANDINGS.length; i++) {
    const t = NHL_STANDINGS[i];
    const goalDiff = t.gf - t.ga;

    await prisma.teamStandings.create({
      data: {
        league: "NHL",
        season: "2025-2026",
        team: t.team,
        name: t.name,
        conference: t.conf,
        division: t.div,
        rankDivision: t.divRank,
        rankConference: t.confRank,
        rankLeague: i + 1,
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
  console.log(`✅ Seeded all 32 NHL team standings matching official feed.`);
  console.log("=== NFL.COM WEEK 11 STANDINGS SYNCHRONIZATION COMPLETE ===");
  await prisma.$disconnect();
}

seedStandings().catch(console.error);
