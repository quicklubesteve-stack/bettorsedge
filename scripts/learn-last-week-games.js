const { PrismaClient } = require("@prisma/client");
const { processFinishedGame, ensureTeamWeights } = require("../src/lib/game-learning");

const prisma = new PrismaClient();

const LAST_WEEK_GAMES = [
  {
    gameId: "LEARN-W11-KC-BUF",
    league: "NFL",
    date: new Date("2026-11-17T21:25:00Z"),
    homeTeam: "BUF",
    awayTeam: "KC",
    homeTeamName: "Buffalo Bills",
    awayTeamName: "Kansas City Chiefs",
    actualHomeScore: 30,
    actualAwayScore: 21,
    actualScorers: ["Josh Allen", "James Cook", "Xavier Worthy", "Noah Gray"],
    actualFirstScorer: "James Cook",
    actualFirstTeamToScore: "BUF",
  },
  {
    gameId: "LEARN-W11-BAL-PIT",
    league: "NFL",
    date: new Date("2026-11-17T18:00:00Z"),
    homeTeam: "PIT",
    awayTeam: "BAL",
    homeTeamName: "Pittsburgh Steelers",
    awayTeamName: "Baltimore Ravens",
    actualHomeScore: 18,
    actualAwayScore: 16,
    actualScorers: ["Derrick Henry", "Isaiah Likely", "Chris Boswell"],
    actualFirstScorer: "Chris Boswell",
    actualFirstTeamToScore: "PIT",
  },
  {
    gameId: "LEARN-W11-SEA-SF",
    league: "NFL",
    date: new Date("2026-11-17T21:05:00Z"),
    homeTeam: "SF",
    awayTeam: "SEA",
    homeTeamName: "San Francisco 49ers",
    awayTeamName: "Seattle Seahawks",
    actualHomeScore: 17,
    actualAwayScore: 20,
    actualScorers: ["Christian McCaffrey", "Jauan Jennings", "Geno Smith", "Kenneth Walker"],
    actualFirstScorer: "Christian McCaffrey",
    actualFirstTeamToScore: "SF",
  },
  {
    gameId: "LEARN-W11-WAS-PHI",
    league: "NFL",
    date: new Date("2026-11-15T01:15:00Z"),
    homeTeam: "PHI",
    awayTeam: "WAS",
    homeTeamName: "Philadelphia Eagles",
    awayTeamName: "Washington Commanders",
    actualHomeScore: 26,
    actualAwayScore: 18,
    actualScorers: ["Saquon Barkley", "Jalen Hurts", "Brian Robinson", "Zach Ertz"],
    actualFirstScorer: "Brian Robinson",
    actualFirstTeamToScore: "WAS",
  },
  {
    gameId: "LEARN-W11-JAX-DET",
    league: "NFL",
    date: new Date("2026-11-17T18:00:00Z"),
    homeTeam: "DET",
    awayTeam: "JAX",
    homeTeamName: "Detroit Lions",
    awayTeamName: "Jacksonville Jaguars",
    actualHomeScore: 52,
    actualAwayScore: 6,
    actualScorers: ["David Montgomery", "Jahmyr Gibbs", "Amon-Ra St. Brown", "Jameson Williams", "Brock Wright"],
    actualFirstScorer: "David Montgomery",
    actualFirstTeamToScore: "DET",
  },
  {
    gameId: "LEARN-W11-DAL-HOU",
    league: "NFL",
    date: new Date("2026-11-18T01:15:00Z"),
    homeTeam: "DAL",
    awayTeam: "HOU",
    homeTeamName: "Dallas Cowboys",
    awayTeamName: "Houston Texans",
    actualHomeScore: 10,
    actualAwayScore: 34,
    actualScorers: ["Joe Mixon", "Ka'imi Fairbairn", "Brandon Aubrey"],
    actualFirstScorer: "Joe Mixon",
    actualFirstTeamToScore: "HOU",
  },
  {
    gameId: "LEARN-W11-GB-CHI",
    league: "NFL",
    date: new Date("2026-11-17T18:00:00Z"),
    homeTeam: "CHI",
    awayTeam: "GB",
    homeTeamName: "Chicago Bears",
    awayTeamName: "Green Bay Packers",
    actualHomeScore: 19,
    actualAwayScore: 20,
    actualScorers: ["Josh Jacobs", "Jayden Reed", "Roschon Johnson", "D'Andre Swift"],
    actualFirstScorer: "Jayden Reed",
    actualFirstTeamToScore: "GB",
  },
  {
    gameId: "LEARN-W11-MIN-TEN",
    league: "NFL",
    date: new Date("2026-11-17T18:00:00Z"),
    homeTeam: "TEN",
    awayTeam: "MIN",
    homeTeamName: "Tennessee Titans",
    awayTeamName: "Minnesota Vikings",
    actualHomeScore: 13,
    actualAwayScore: 23,
    actualScorers: ["Jordan Addison", "Sam Darnold", "Nick Westbrook-Ikhine"],
    actualFirstScorer: "Jordan Addison",
    actualFirstTeamToScore: "MIN",
  },
  // NHL GAMES
  {
    gameId: "LEARN-NHL-EDM-TOR",
    league: "NHL",
    date: new Date("2026-11-16T23:00:00Z"),
    homeTeam: "TOR",
    awayTeam: "EDM",
    homeTeamName: "Toronto Maple Leafs",
    awayTeamName: "Edmonton Oilers",
    actualHomeScore: 3,
    actualAwayScore: 4,
    actualScorers: ["Connor McDavid", "Leon Draisaitl", "Zach Hyman", "Matthew Knies", "Bobby McMann"],
    actualFirstScorer: "Matthew Knies",
    actualFirstTeamToScore: "TOR",
  },
  {
    gameId: "LEARN-NHL-VGK-UTA",
    league: "NHL",
    date: new Date("2026-11-16T02:00:00Z"),
    homeTeam: "UTA",
    awayTeam: "VGK",
    homeTeamName: "Utah Hockey Club",
    awayTeamName: "Vegas Golden Knights",
    actualHomeScore: 2,
    actualAwayScore: 4,
    actualScorers: ["Jack Eichel", "Tomas Hertl", "William Karlsson", "Logan Cooley"],
    actualFirstScorer: "Jack Eichel",
    actualFirstTeamToScore: "VGK",
  },
  {
    gameId: "LEARN-NHL-FLA-BOS",
    league: "NHL",
    date: new Date("2026-11-17T20:00:00Z"),
    homeTeam: "BOS",
    awayTeam: "FLA",
    homeTeamName: "Boston Bruins",
    awayTeamName: "Florida Panthers",
    actualHomeScore: 2,
    actualAwayScore: 3,
    actualScorers: ["Sam Reinhart", "Matthew Tkachuk", "David Pastrnak", "Brad Marchand"],
    actualFirstScorer: "David Pastrnak",
    actualFirstTeamToScore: "BOS",
  },
  {
    gameId: "LEARN-NHL-CAR-NYR",
    league: "NHL",
    date: new Date("2026-11-17T00:00:00Z"),
    homeTeam: "NYR",
    awayTeam: "CAR",
    homeTeamName: "New York Rangers",
    awayTeamName: "Carolina Hurricanes",
    actualHomeScore: 4,
    actualAwayScore: 2,
    actualScorers: ["Artemi Panarin", "Mika Zibanejad", "Chris Kreider", "Sebastian Aho"],
    actualFirstScorer: "Chris Kreider",
    actualFirstTeamToScore: "NYR",
  },
];

async function main() {
  console.log("Starting AI Ingestion & Self-Calibration for Last Week's Completed Games...");

  // Reset or ensure baseline weights for all teams
  const allNfl = ["KC", "BUF", "BAL", "PIT", "SF", "SEA", "PHI", "WAS", "DET", "JAX", "DAL", "HOU", "GB", "CHI", "MIN", "TEN"];
  const allNhl = ["TOR", "EDM", "VGK", "UTA", "BOS", "FLA", "NYR", "CAR"];

  for (const t of allNfl) {
    await ensureTeamWeights("NFL", t, t);
  }
  for (const t of allNhl) {
    await ensureTeamWeights("NHL", t, t);
  }

  // Delete any previous duplicate runs of these specific game IDs
  const gameIds = LAST_WEEK_GAMES.map((g) => g.gameId);
  await prisma.gameLearningRecord.deleteMany({
    where: { gameId: { in: gameIds } },
  });

  const results = [];

  for (const game of LAST_WEEK_GAMES) {
    console.log(`\n--- Learning from ${game.gameId} (${game.awayTeam} @ ${game.homeTeam}: ${game.actualAwayScore}-${game.actualHomeScore}) ---`);
    const record = await processFinishedGame(game);
    results.push(record);
    console.log(`Winner Correct: ${record.isWinnerCorrect} (${record.predictedWinner} vs ${record.actualWinner})`);
    console.log(`Score Margin Error: ${record.scoreMarginError}`);
    console.log(`Spread Correct: ${record.isSpreadCorrect} (${record.predictedSpread} -> ${record.actualSpreadCover})`);
    console.log(`Total Correct: ${record.isTotalCorrect} (${record.predictedTotal} -> actual ${record.actualTotal})`);
    console.log(`Insight: ${record.learningInsight}`);
  }

  console.log("\n=======================================================");
  console.log(`Successfully ingested and calibrated all ${results.length} games!`);
  console.log("=======================================================");
}

main()
  .catch((e) => {
    console.error("Error learning from last week games:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
