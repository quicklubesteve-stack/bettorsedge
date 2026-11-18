const fs = require("fs");
const path = require("path");

const raw = require("./nhl-2026-extracted.json");

// Process both conferences and assign playoff seeds
function processConference(teams, confName) {
  // Sort teams into divisions
  const divNames = [...new Set(teams.map((t) => t.divisionName))];
  const div1Name = divNames[0];
  const div2Name = divNames[1];

  const div1Teams = teams.filter((t) => t.divisionName === div1Name).sort((a, b) => a.divisionSequence - b.divisionSequence);
  const div2Teams = teams.filter((t) => t.divisionName === div2Name).sort((a, b) => a.divisionSequence - b.divisionSequence);

  // Determine conference seed 1 & 2 (division leaders)
  const div1Leader = div1Teams[0];
  const div2Leader = div2Teams[0];

  let seed1Team, seed2Team;
  if (div1Leader.conferenceSequence < div2Leader.conferenceSequence) {
    seed1Team = div1Leader;
    seed2Team = div2Leader;
  } else {
    seed1Team = div2Leader;
    seed2Team = div1Leader;
  }

  // Next: #2 and #3 in each division
  // Div leader 1's #2 and #3 -> seeds 4 & 5 (or 3 & 4)
  // Let's standardise Seeds 1-8:
  // Seed 1: Leader with better conf record
  // Seed 2: Other division leader
  // Seeds 3-6: The 2nd and 3rd place teams sorted by conferenceSequence
  // Seed 7: Wild Card 1 (wildcardSequence === 1)
  // Seed 8: Wild Card 2 (wildcardSequence === 2)

  const divRank2and3 = [...teams.filter((t) => t.divisionSequence === 2 || t.divisionSequence === 3)].sort(
    (a, b) => a.conferenceSequence - b.conferenceSequence
  );

  const wc1 = teams.find((t) => t.wildcardSequence === 1);
  const wc2 = teams.find((t) => t.wildcardSequence === 2);

  const seedMap = new Map();
  seedMap.set(seed1Team.teamAbbrev.default, 1);
  seedMap.set(seed2Team.teamAbbrev.default, 2);
  seedMap.set(divRank2and3[0].teamAbbrev.default, 3);
  seedMap.set(divRank2and3[1].teamAbbrev.default, 4);
  seedMap.set(divRank2and3[2].teamAbbrev.default, 5);
  seedMap.set(divRank2and3[3].teamAbbrev.default, 6);
  if (wc1) seedMap.set(wc1.teamAbbrev.default, 7);
  if (wc2) seedMap.set(wc2.teamAbbrev.default, 8);

  return teams.map((t) => {
    const code = t.teamAbbrev.default;
    const seed = seedMap.has(code) ? seedMap.get(code) : null;
    return {
      team: code,
      name: t.teamName.default,
      conf: t.conferenceName,
      div: t.divisionName,
      divRank: t.divisionSequence,
      confRank: t.conferenceSequence,
      leagueRank: t.leagueSequence,
      seed,
      gp: t.gamesPlayed,
      w: t.wins,
      l: t.losses,
      otl: t.otLosses,
      pts: t.points,
      rw: t.regulationWins,
      gf: t.goalFor,
      ga: t.goalAgainst,
      diff: t.goalDifferential,
      home: `${t.homeWins}-${t.homeLosses}-${t.homeOtLosses}`,
      away: `${t.roadWins}-${t.roadLosses}-${t.roadOtLosses}`,
      strk: `${t.streakCode}${t.streakCount}`,
      l10: `${t.l10Wins}-${t.l10Losses}-${t.l10OtLosses}`,
    };
  });
}

const eastern = raw.standings.filter((t) => t.conferenceName === "Eastern");
const western = raw.standings.filter((t) => t.conferenceName === "Western");

const parsedEastern = processConference(eastern, "Eastern");
const parsedWestern = processConference(western, "Western");

const allNhl = [...parsedEastern, ...parsedWestern];
fs.writeFileSync(path.join(__dirname, "nhl-standings-parsed.json"), JSON.stringify(allNhl, null, 2));

console.log(`Successfully parsed ${allNhl.length} NHL teams.`);
console.log("Eastern Seeds 1-8:");
parsedEastern
  .filter((t) => t.seed !== null)
  .sort((a, b) => a.seed - b.seed)
  .forEach((t) => console.log(`Seed ${t.seed}: ${t.team} (${t.name}) - ${t.pts} PTS [${t.div} #${t.divRank}]`));

console.log("\nWestern Seeds 1-8:");
parsedWestern
  .filter((t) => t.seed !== null)
  .sort((a, b) => a.seed - b.seed)
  .forEach((t) => console.log(`Seed ${t.seed}: ${t.team} (${t.name}) - ${t.pts} PTS [${t.div} #${t.divRank}]`));
