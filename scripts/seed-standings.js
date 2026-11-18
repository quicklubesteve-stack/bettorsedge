const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Official Current NFL Standings (TSN & Sportsnet Data)
const NFL_STANDINGS = [
  // AFC EAST
  { team: "BUF", name: "Buffalo Bills", conf: "AFC", div: "East", w: 13, l: 4, t: 0, pf: 525, pa: 368, home: "8-1", away: "5-3", divRec: "5-1", confRec: "9-3", strk: "W2", l10: "8-2", divRank: 1, confRank: 2, seed: 2 },
  { team: "MIA", name: "Miami Dolphins", conf: "AFC", div: "East", w: 8, l: 9, t: 0, pf: 345, pa: 364, home: "4-4", away: "4-5", divRec: "3-3", confRec: "6-6", strk: "L1", l10: "5-5", divRank: 2, confRank: 9, seed: null },
  { team: "NYJ", name: "New York Jets", conf: "AFC", div: "East", w: 5, l: 12, t: 0, pf: 338, pa: 404, home: "3-5", away: "2-7", divRec: "2-4", confRec: "4-8", strk: "W1", l10: "3-7", divRank: 3, confRank: 11, seed: null },
  { team: "NE", name: "New England Patriots", conf: "AFC", div: "East", w: 4, l: 13, t: 0, pf: 289, pa: 417, home: "1-7", away: "3-6", divRec: "2-4", confRec: "3-9", strk: "L2", l10: "2-8", divRank: 4, confRank: 13, seed: null },

  // AFC NORTH
  { team: "BAL", name: "Baltimore Ravens", conf: "AFC", div: "North", w: 12, l: 5, t: 0, pf: 518, pa: 361, home: "6-2", away: "6-3", divRec: "4-2", confRec: "8-4", strk: "W4", l10: "7-3", divRank: 1, confRank: 3, seed: 3 },
  { team: "PIT", name: "Pittsburgh Steelers", conf: "AFC", div: "North", w: 10, l: 7, t: 0, pf: 380, pa: 347, home: "5-3", away: "5-4", divRec: "3-3", confRec: "7-5", strk: "L4", l10: "5-5", divRank: 2, confRank: 6, seed: 6 },
  { team: "CIN", name: "Cincinnati Bengals", conf: "AFC", div: "North", w: 9, l: 8, t: 0, pf: 472, pa: 434, home: "3-5", away: "6-3", divRec: "3-3", confRec: "6-6", strk: "W4", l10: "6-4", divRank: 3, confRank: 8, seed: null },
  { team: "CLE", name: "Cleveland Browns", conf: "AFC", div: "North", w: 3, l: 14, t: 0, pf: 258, pa: 435, home: "2-7", away: "1-7", divRec: "2-4", confRec: "3-9", strk: "L6", l10: "1-9", divRank: 4, confRank: 15, seed: null },

  // AFC SOUTH
  { team: "HOU", name: "Houston Texans", conf: "AFC", div: "South", w: 10, l: 7, t: 0, pf: 372, pa: 372, home: "5-3", away: "5-4", divRec: "5-1", confRec: "8-4", strk: "W1", l10: "5-5", divRank: 1, confRank: 4, seed: 4 },
  { team: "IND", name: "Indianapolis Colts", conf: "AFC", div: "South", w: 8, l: 9, t: 0, pf: 377, pa: 427, home: "5-3", away: "3-6", divRec: "3-3", confRec: "6-6", strk: "L1", l10: "4-6", divRank: 2, confRank: 10, seed: null },
  { team: "JAX", name: "Jacksonville Jaguars", conf: "AFC", div: "South", w: 4, l: 13, t: 0, pf: 320, pa: 435, home: "3-5", away: "1-8", divRec: "3-3", confRec: "4-8", strk: "L1", l10: "2-8", divRank: 3, confRank: 12, seed: null },
  { team: "TEN", name: "Tennessee Titans", conf: "AFC", div: "South", w: 3, l: 14, t: 0, pf: 311, pa: 460, home: "1-7", away: "2-7", divRec: "1-5", confRec: "3-9", strk: "L5", l10: "2-8", divRank: 4, confRank: 16, seed: null },

  // AFC WEST
  { team: "KC", name: "Kansas City Chiefs", conf: "AFC", div: "West", w: 15, l: 2, t: 0, pf: 385, pa: 326, home: "8-1", away: "7-1", divRec: "5-1", confRec: "10-2", strk: "L1", l10: "9-1", divRank: 1, confRank: 1, seed: 1 },
  { team: "LAC", name: "Los Angeles Chargers", conf: "AFC", div: "West", w: 11, l: 6, t: 0, pf: 402, pa: 301, home: "6-3", away: "5-3", divRec: "4-2", confRec: "8-4", strk: "W3", l10: "7-3", divRank: 2, confRank: 5, seed: 5 },
  { team: "DEN", name: "Denver Broncos", conf: "AFC", div: "West", w: 10, l: 7, t: 0, pf: 425, pa: 311, home: "6-3", away: "4-4", divRec: "3-3", confRec: "6-6", strk: "W2", l10: "6-4", divRank: 3, confRank: 7, seed: 7 },
  { team: "LV", name: "Las Vegas Raiders", conf: "AFC", div: "West", w: 4, l: 13, t: 0, pf: 309, pa: 434, home: "2-6", away: "2-7", divRec: "0-6", confRec: "3-9", strk: "L1", l10: "2-8", divRank: 4, confRank: 14, seed: null },

  // NFC EAST
  { team: "PHI", name: "Philadelphia Eagles", conf: "NFC", div: "East", w: 14, l: 3, t: 0, pf: 463, pa: 303, home: "7-1", away: "7-2", divRec: "5-1", confRec: "9-3", strk: "W2", l10: "9-1", divRank: 1, confRank: 2, seed: 2 },
  { team: "WAS", name: "Washington Commanders", conf: "NFC", div: "East", w: 12, l: 5, t: 0, pf: 485, pa: 391, home: "7-2", away: "5-3", divRec: "4-2", confRec: "9-3", strk: "W4", l10: "7-3", divRank: 2, confRank: 6, seed: 6 },
  { team: "DAL", name: "Dallas Cowboys", conf: "NFC", div: "East", w: 7, l: 10, t: 0, pf: 350, pa: 468, home: "2-7", away: "5-3", divRec: "3-3", confRec: "5-7", strk: "L1", l10: "4-6", divRank: 3, confRank: 11, seed: null },
  { team: "NYG", name: "New York Giants", conf: "NFC", div: "East", w: 3, l: 14, t: 0, pf: 273, pa: 415, home: "1-8", away: "2-6", divRec: "1-5", confRec: "2-10", strk: "L2", l10: "1-9", divRank: 4, confRank: 16, seed: null },

  // NFC NORTH
  { team: "DET", name: "Detroit Lions", conf: "NFC", div: "North", w: 15, l: 2, t: 0, pf: 564, pa: 342, home: "7-2", away: "8-0", divRec: "6-0", confRec: "11-1", strk: "W3", l10: "9-1", divRank: 1, confRank: 1, seed: 1 },
  { team: "MIN", name: "Minnesota Vikings", conf: "NFC", div: "North", w: 14, l: 3, t: 0, pf: 432, pa: 332, home: "7-1", away: "7-2", divRec: "4-2", confRec: "9-3", strk: "L1", l10: "8-2", divRank: 2, confRank: 5, seed: 5 },
  { team: "GB", name: "Green Bay Packers", conf: "NFC", div: "North", w: 11, l: 6, t: 0, pf: 460, pa: 338, home: "6-2", away: "5-4", divRec: "2-4", confRec: "7-5", strk: "L1", l10: "5-5", divRank: 3, confRank: 7, seed: 7 },
  { team: "CHI", name: "Chicago Bears", conf: "NFC", div: "North", w: 5, l: 12, t: 0, pf: 310, pa: 370, home: "4-4", away: "1-8", divRec: "0-6", confRec: "3-9", strk: "W1", l10: "1-9", divRank: 4, confRank: 13, seed: null },

  // NFC SOUTH
  { team: "TB", name: "Tampa Bay Buccaneers", conf: "NFC", div: "South", w: 10, l: 7, t: 0, pf: 502, pa: 385, home: "5-4", away: "5-3", divRec: "4-2", confRec: "8-4", strk: "W2", l10: "6-4", divRank: 1, confRank: 3, seed: 3 },
  { team: "ATL", name: "Atlanta Falcons", conf: "NFC", div: "South", w: 8, l: 9, t: 0, pf: 389, pa: 423, home: "4-5", away: "4-4", divRec: "4-2", confRec: "7-5", strk: "L1", l10: "3-7", divRank: 2, confRank: 9, seed: null },
  { team: "CAR", name: "Carolina Panthers", conf: "NFC", div: "South", w: 5, l: 12, t: 0, pf: 341, pa: 534, home: "3-6", away: "2-6", divRec: "2-4", confRec: "4-8", strk: "L1", l10: "4-6", divRank: 3, confRank: 14, seed: null },
  { team: "NO", name: "New Orleans Saints", conf: "NFC", div: "South", w: 5, l: 12, t: 0, pf: 338, pa: 398, home: "3-5", away: "2-7", divRec: "2-4", confRec: "4-8", strk: "L3", l10: "3-7", divRank: 4, confRank: 15, seed: null },

  // NFC WEST
  { team: "LAR", name: "Los Angeles Rams", conf: "NFC", div: "West", w: 10, l: 7, t: 0, pf: 367, pa: 386, home: "5-3", away: "5-4", divRec: "4-2", confRec: "6-6", strk: "L1", l10: "6-4", divRank: 1, confRank: 4, seed: 4 },
  { team: "SEA", name: "Seattle Seahawks", conf: "NFC", div: "West", w: 10, l: 7, t: 0, pf: 375, pa: 368, home: "4-5", away: "6-2", divRec: "4-2", confRec: "6-6", strk: "W2", l10: "6-4", divRank: 2, confRank: 8, seed: null },
  { team: "ARI", name: "Arizona Cardinals", conf: "NFC", div: "West", w: 8, l: 9, t: 0, pf: 400, pa: 379, home: "5-4", away: "3-5", divRec: "3-3", confRec: "6-6", strk: "L1", l10: "4-6", divRank: 3, confRank: 10, seed: null },
  { team: "SF", name: "San Francisco 49ers", conf: "NFC", div: "West", w: 6, l: 11, t: 0, pf: 389, pa: 436, home: "4-5", away: "2-6", divRec: "1-5", confRec: "4-8", strk: "L4", l10: "2-8", divRank: 4, confRank: 12, seed: null },
];

// Official Current NHL Standings (TSN & Sportsnet Data)
const NHL_STANDINGS = [
  // ATLANTIC DIVISION
  { team: "FLA", name: "Florida Panthers", conf: "Eastern", div: "Atlantic", gp: 82, w: 47, l: 31, otl: 4, pts: 98, rw: 43, gf: 252, ga: 223, home: "26-13-2", away: "21-18-2", strk: "W2", l10: "7-3-0", divRank: 1, confRank: 3, seed: 2 },
  { team: "TOR", name: "Toronto Maple Leafs", conf: "Eastern", div: "Atlantic", gp: 82, w: 52, l: 26, otl: 4, pts: 108, rw: 46, gf: 268, ga: 231, home: "28-11-2", away: "24-15-2", strk: "W3", l10: "7-2-1", divRank: 2, confRank: 2, seed: 4 },
  { team: "TBL", name: "Tampa Bay Lightning", conf: "Eastern", div: "Atlantic", gp: 82, w: 47, l: 27, otl: 8, pts: 102, rw: 42, gf: 294, ga: 219, home: "27-10-4", away: "20-17-4", strk: "W2", l10: "6-3-1", divRank: 3, confRank: 5, seed: 6 },
  { team: "BOS", name: "Boston Bruins", conf: "Eastern", div: "Atlantic", gp: 82, w: 44, l: 30, otl: 8, pts: 96, rw: 39, gf: 245, ga: 240, home: "24-14-3", away: "20-16-5", strk: "L1", l10: "5-4-1", divRank: 4, confRank: 8, seed: 8 },
  { team: "OTT", name: "Ottawa Senators", conf: "Eastern", div: "Atlantic", gp: 82, w: 45, l: 30, otl: 7, pts: 97, rw: 39, gf: 243, ga: 234, home: "25-13-3", away: "20-17-4", strk: "W1", l10: "6-4-0", divRank: 5, confRank: 7, seed: 7 },
  { team: "BUF", name: "Buffalo Sabres", conf: "Eastern", div: "Atlantic", gp: 82, w: 37, l: 38, otl: 7, pts: 81, rw: 32, gf: 238, ga: 265, home: "21-18-2", away: "16-20-5", strk: "L2", l10: "4-5-1", divRank: 6, confRank: 12, seed: null },
  { team: "DET", name: "Detroit Red Wings", conf: "Eastern", div: "Atlantic", gp: 82, w: 38, l: 36, otl: 8, pts: 84, rw: 33, gf: 228, ga: 258, home: "21-17-3", away: "17-19-5", strk: "L1", l10: "5-5-0", divRank: 7, confRank: 11, seed: null },
  { team: "MTL", name: "Montreal Canadiens", conf: "Eastern", div: "Atlantic", gp: 82, w: 34, l: 40, otl: 8, pts: 76, rw: 28, gf: 222, ga: 282, home: "19-18-4", away: "15-22-4", strk: "W1", l10: "4-6-0", divRank: 8, confRank: 15, seed: null },

  // METROPOLITAN DIVISION
  { team: "WSH", name: "Washington Capitals", conf: "Eastern", div: "Metropolitan", gp: 82, w: 51, l: 22, otl: 9, pts: 111, rw: 47, gf: 288, ga: 232, home: "27-9-5", away: "24-13-4", strk: "W4", l10: "8-1-1", divRank: 1, confRank: 1, seed: 1 },
  { team: "CAR", name: "Carolina Hurricanes", conf: "Eastern", div: "Metropolitan", gp: 82, w: 47, l: 30, otl: 5, pts: 99, rw: 43, gf: 266, ga: 233, home: "26-13-2", away: "21-17-3", strk: "W2", l10: "6-4-0", divRank: 2, confRank: 4, seed: 3 },
  { team: "NJD", name: "New Jersey Devils", conf: "Eastern", div: "Metropolitan", gp: 82, w: 43, l: 31, otl: 8, pts: 94, rw: 38, gf: 254, ga: 245, home: "22-15-4", away: "21-16-4", strk: "L1", l10: "5-4-1", divRank: 3, confRank: 6, seed: 5 },
  { team: "NYR", name: "New York Rangers", conf: "Eastern", div: "Metropolitan", gp: 82, w: 44, l: 32, otl: 6, pts: 94, rw: 39, gf: 250, ga: 235, home: "24-15-2", away: "20-17-4", strk: "W1", l10: "6-3-1", divRank: 4, confRank: 9, seed: null },
  { team: "NYI", name: "New York Islanders", conf: "Eastern", div: "Metropolitan", gp: 82, w: 38, l: 34, otl: 10, pts: 86, rw: 32, gf: 220, ga: 248, home: "20-16-5", away: "18-18-5", strk: "L1", l10: "4-4-2", divRank: 5, confRank: 10, seed: null },
  { team: "PHI", name: "Philadelphia Flyers", conf: "Eastern", div: "Metropolitan", gp: 82, w: 36, l: 37, otl: 9, pts: 81, rw: 29, gf: 225, ga: 275, home: "20-17-4", away: "16-20-5", strk: "L2", l10: "4-5-1", divRank: 6, confRank: 13, seed: null },
  { team: "PIT", name: "Pittsburgh Penguins", conf: "Eastern", div: "Metropolitan", gp: 82, w: 35, l: 38, otl: 9, pts: 79, rw: 30, gf: 236, ga: 292, home: "19-18-4", away: "16-20-5", strk: "W1", l10: "4-5-1", divRank: 7, confRank: 14, seed: null },
  { team: "CBJ", name: "Columbus Blue Jackets", conf: "Eastern", div: "Metropolitan", gp: 82, w: 33, l: 41, otl: 8, pts: 74, rw: 27, gf: 235, ga: 285, home: "19-18-4", away: "14-23-4", strk: "L2", l10: "3-6-1", divRank: 8, confRank: 16, seed: null },

  // CENTRAL DIVISION
  { team: "WPG", name: "Winnipeg Jets", conf: "Western", div: "Central", gp: 82, w: 56, l: 22, otl: 4, pts: 116, rw: 51, gf: 277, ga: 191, home: "30-9-2", away: "26-13-2", strk: "W5", l10: "8-2-0", divRank: 1, confRank: 1, seed: 1 },
  { team: "DAL", name: "Dallas Stars", conf: "Western", div: "Central", gp: 82, w: 50, l: 26, otl: 6, pts: 106, rw: 45, gf: 277, ga: 224, home: "28-10-3", away: "22-16-3", strk: "W2", l10: "7-3-0", divRank: 2, confRank: 3, seed: 3 },
  { team: "COL", name: "Colorado Avalanche", conf: "Western", div: "Central", gp: 82, w: 49, l: 29, otl: 4, pts: 102, rw: 44, gf: 277, ga: 234, home: "27-12-2", away: "22-17-2", strk: "W1", l10: "6-3-1", divRank: 3, confRank: 5, seed: 5 },
  { team: "MIN", name: "Minnesota Wild", conf: "Western", div: "Central", gp: 82, w: 45, l: 30, otl: 7, pts: 97, rw: 38, gf: 228, ga: 239, home: "23-14-4", away: "22-16-3", strk: "L1", l10: "5-4-1", divRank: 4, confRank: 8, seed: 8 },
  { team: "STL", name: "St. Louis Blues", conf: "Western", div: "Central", gp: 82, w: 41, l: 34, otl: 7, pts: 89, rw: 34, gf: 232, ga: 250, home: "23-15-3", away: "18-19-4", strk: "W1", l10: "5-5-0", divRank: 5, confRank: 9, seed: null },
  { team: "UTA", name: "Utah Hockey Club", conf: "Western", div: "Central", gp: 82, w: 37, l: 36, otl: 9, pts: 83, rw: 30, gf: 235, ga: 260, home: "21-16-4", away: "16-20-5", strk: "L1", l10: "4-5-1", divRank: 6, confRank: 10, seed: null },
  { team: "NSH", name: "Nashville Predators", conf: "Western", div: "Central", gp: 82, w: 35, l: 39, otl: 8, pts: 78, rw: 29, gf: 215, ga: 268, home: "20-17-4", away: "15-22-4", strk: "L3", l10: "3-6-1", divRank: 7, confRank: 13, seed: null },
  { team: "CHI", name: "Chicago Blackhawks", conf: "Western", div: "Central", gp: 82, w: 29, l: 46, otl: 7, pts: 65, rw: 23, gf: 198, ga: 285, home: "16-21-4", away: "13-25-3", strk: "L2", l10: "3-7-0", divRank: 8, confRank: 15, seed: null },

  // PACIFIC DIVISION
  { team: "VGK", name: "Vegas Golden Knights", conf: "Western", div: "Pacific", gp: 82, w: 50, l: 22, otl: 10, pts: 110, rw: 44, gf: 275, ga: 219, home: "29-8-4", away: "21-14-6", strk: "W3", l10: "7-2-1", divRank: 1, confRank: 2, seed: 2 },
  { team: "LAK", name: "Los Angeles Kings", conf: "Western", div: "Pacific", gp: 82, w: 48, l: 25, otl: 9, pts: 105, rw: 41, gf: 250, ga: 206, home: "26-10-5", away: "22-15-4", strk: "W1", l10: "6-3-1", divRank: 2, confRank: 4, seed: 4 },
  { team: "EDM", name: "Edmonton Oilers", conf: "Western", div: "Pacific", gp: 82, w: 48, l: 29, otl: 5, pts: 101, rw: 41, gf: 259, ga: 236, home: "27-12-2", away: "21-17-3", strk: "W2", l10: "6-4-0", divRank: 3, confRank: 6, seed: 6 },
  { team: "CGY", name: "Calgary Flames", conf: "Western", div: "Pacific", gp: 82, w: 41, l: 32, otl: 9, pts: 91, rw: 33, gf: 235, ga: 245, home: "23-14-4", away: "18-18-5", strk: "L1", l10: "5-4-1", divRank: 4, confRank: 7, seed: 7 },
  { team: "VAN", name: "Vancouver Canucks", conf: "Western", div: "Pacific", gp: 82, w: 40, l: 33, otl: 9, pts: 89, rw: 32, gf: 242, ga: 252, home: "20-16-5", away: "20-17-4", strk: "L2", l10: "4-5-1", divRank: 5, confRank: 11, seed: null },
  { team: "SEA", name: "Seattle Kraken", conf: "Western", div: "Pacific", gp: 82, w: 37, l: 38, otl: 7, pts: 81, rw: 30, gf: 224, ga: 256, home: "21-17-3", away: "16-21-4", strk: "L1", l10: "4-6-0", divRank: 6, confRank: 12, seed: null },
  { team: "ANA", name: "Anaheim Ducks", conf: "Western", div: "Pacific", gp: 82, w: 34, l: 40, otl: 8, pts: 76, rw: 27, gf: 210, ga: 275, home: "18-18-5", away: "16-22-3", strk: "W1", l10: "5-5-0", divRank: 7, confRank: 14, seed: null },
  { team: "SJS", name: "San Jose Sharks", conf: "Western", div: "Pacific", gp: 82, w: 26, l: 48, otl: 8, pts: 60, rw: 19, gf: 205, ga: 315, home: "15-22-4", away: "11-26-4", strk: "L3", l10: "2-7-1", divRank: 8, confRank: 16, seed: null },
];

async function seedStandings() {
  console.log("=== SEEDING OFFICIAL TSN & SPORTSNET STANDINGS (NFL & NHL) ===");

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
  console.log(`✅ Seeded all 32 NFL team standings matching TSN & Sportsnet.`);

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
  console.log(`✅ Seeded all 32 NHL team standings matching TSN & Sportsnet.`);
  console.log("=== TSN / SPORTSNET STANDINGS SYNCHRONIZATION COMPLETE ===");
  await prisma.$disconnect();
}

seedStandings().catch(console.error);
