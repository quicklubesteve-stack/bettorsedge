const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const NFL_TEAMS = [
  { abbr: "ARI", name: "Arizona Cardinals", blitzBase: 24, passBase: 56 },
  { abbr: "ATL", name: "Atlanta Falcons", blitzBase: 28, passBase: 58 },
  { abbr: "BAL", name: "Baltimore Ravens", blitzBase: 29, passBase: 48 },
  { abbr: "BUF", name: "Buffalo Bills", blitzBase: 21, passBase: 61 },
  { abbr: "CAR", name: "Carolina Panthers", blitzBase: 25, passBase: 57 },
  { abbr: "CHI", name: "Chicago Bears", blitzBase: 27, passBase: 55 },
  { abbr: "CIN", name: "Cincinnati Bengals", blitzBase: 26, passBase: 64 },
  { abbr: "CLE", name: "Cleveland Browns", blitzBase: 36, passBase: 59 },
  { abbr: "DAL", name: "Dallas Cowboys", blitzBase: 33, passBase: 62 },
  { abbr: "DEN", name: "Denver Broncos", blitzBase: 34, passBase: 56 },
  { abbr: "DET", name: "Detroit Lions", blitzBase: 31, passBase: 54 },
  { abbr: "GB", name: "Green Bay Packers", blitzBase: 28, passBase: 57 },
  { abbr: "HOU", name: "Houston Texans", blitzBase: 25, passBase: 60 },
  { abbr: "IND", name: "Indianapolis Colts", blitzBase: 19, passBase: 53 },
  { abbr: "JAX", name: "Jacksonville Jaguars", blitzBase: 29, passBase: 60 },
  { abbr: "KC", name: "Kansas City Chiefs", blitzBase: 38, passBase: 65 },
  { abbr: "LAC", name: "Los Angeles Chargers", blitzBase: 28, passBase: 54 },
  { abbr: "LAR", name: "Los Angeles Rams", blitzBase: 26, passBase: 59 },
  { abbr: "LV", name: "Las Vegas Raiders", blitzBase: 23, passBase: 58 },
  { abbr: "MIA", name: "Miami Dolphins", blitzBase: 32, passBase: 63 },
  { abbr: "MIN", name: "Minnesota Vikings", blitzBase: 46, passBase: 59 },
  { abbr: "NE", name: "New England Patriots", blitzBase: 27, passBase: 54 },
  { abbr: "NO", name: "New Orleans Saints", blitzBase: 26, passBase: 58 },
  { abbr: "NYG", name: "New York Giants", blitzBase: 39, passBase: 56 },
  { abbr: "NYJ", name: "New York Jets", blitzBase: 18, passBase: 59 },
  { abbr: "PHI", name: "Philadelphia Eagles", blitzBase: 24, passBase: 52 },
  { abbr: "PIT", name: "Pittsburgh Steelers", blitzBase: 35, passBase: 51 },
  { abbr: "SEA", name: "Seattle Seahawks", blitzBase: 27, passBase: 61 },
  { abbr: "SF", name: "San Francisco 49ers", blitzBase: 19, passBase: 51 },
  { abbr: "TB", name: "Tampa Bay Buccaneers", blitzBase: 41, passBase: 62 },
  { abbr: "TEN", name: "Tennessee Titans", blitzBase: 25, passBase: 55 },
  { abbr: "WAS", name: "Washington Commanders", blitzBase: 28, passBase: 56 },
];

const NHL_TEAMS = [
  { abbr: "ANA", name: "Anaheim Ducks", ppPct: 18.2, pkPct: 74.8, stars: [{ name: "Troy Terry", pos: "RW", g: 5, a: 8 }] },
  { abbr: "BOS", name: "Boston Bruins", ppPct: 24.5, pkPct: 83.2, stars: [{ name: "David Pastrnak", pos: "RW", g: 8, a: 9 }] },
  { abbr: "BUF", name: "Buffalo Sabres", ppPct: 19.4, pkPct: 78.5, stars: [{ name: "Tage Thompson", pos: "C", g: 6, a: 7 }] },
  { abbr: "CAR", name: "Carolina Hurricanes", ppPct: 27.2, pkPct: 85.1, stars: [{ name: "Sebastian Aho", pos: "C", g: 7, a: 11 }] },
  { abbr: "CBJ", name: "Columbus Blue Jackets", ppPct: 16.8, pkPct: 75.4, stars: [{ name: "Johnny Gaudreau", pos: "LW", g: 4, a: 7 }] },
  { abbr: "CGY", name: "Calgary Flames", ppPct: 19.8, pkPct: 81.3, stars: [{ name: "Nazem Kadri", pos: "C", g: 5, a: 8 }] },
  { abbr: "CHI", name: "Chicago Blackhawks", ppPct: 17.5, pkPct: 76.9, stars: [{ name: "Connor Bedard", pos: "C", g: 7, a: 10 }] },
  { abbr: "COL", name: "Colorado Avalanche", ppPct: 28.5, pkPct: 81.6, stars: [{ name: "Nathan MacKinnon", pos: "C", g: 9, a: 16 }, { name: "Cale Makar", pos: "D", g: 4, a: 15 }] },
  { abbr: "DAL", name: "Dallas Stars", ppPct: 26.1, pkPct: 82.9, stars: [{ name: "Jason Robertson", pos: "LW", g: 6, a: 11 }, { name: "Miro Heiskanen", pos: "D", g: 3, a: 10 }] },
  { abbr: "DET", name: "Detroit Red Wings", ppPct: 23.0, pkPct: 79.5, stars: [{ name: "Dylan Larkin", pos: "C", g: 7, a: 8 }] },
  { abbr: "EDM", name: "Edmonton Oilers", ppPct: 30.8, pkPct: 79.2, stars: [{ name: "Connor McDavid", pos: "C", g: 8, a: 16 }, { name: "Leon Draisaitl", pos: "C", g: 9, a: 12 }, { name: "Evan Bouchard", pos: "D", g: 3, a: 14 }] },
  { abbr: "FLA", name: "Florida Panthers", ppPct: 26.4, pkPct: 84.7, stars: [{ name: "Sam Reinhart", pos: "C", g: 9, a: 7 }, { name: "Aleksander Barkov", pos: "C", g: 5, a: 12 }, { name: "Matthew Tkachuk", pos: "LW", g: 6, a: 10 }] },
  { abbr: "LAK", name: "Los Angeles Kings", ppPct: 21.6, pkPct: 84.4, stars: [{ name: "Adrian Kempe", pos: "RW", g: 6, a: 7 }] },
  { abbr: "MIN", name: "Minnesota Wild", ppPct: 23.8, pkPct: 81.1, stars: [{ name: "Kirill Kaprizov", pos: "LW", g: 8, a: 14 }] },
  { abbr: "MTL", name: "Montreal Canadiens", ppPct: 18.9, pkPct: 77.2, stars: [{ name: "Cole Caufield", pos: "RW", g: 7, a: 5 }, { name: "Nick Suzuki", pos: "C", g: 4, a: 9 }] },
  { abbr: "NJD", name: "New Jersey Devils", ppPct: 25.2, pkPct: 82.0, stars: [{ name: "Jack Hughes", pos: "C", g: 7, a: 12 }] },
  { abbr: "NSH", name: "Nashville Predators", ppPct: 22.4, pkPct: 80.8, stars: [{ name: "Filip Forsberg", pos: "LW", g: 7, a: 8 }, { name: "Roman Josi", pos: "D", g: 4, a: 11 }] },
  { abbr: "NYI", name: "New York Islanders", ppPct: 18.5, pkPct: 80.2, stars: [{ name: "Mathew Barzal", pos: "C", g: 5, a: 10 }] },
  { abbr: "NYR", name: "New York Rangers", ppPct: 27.9, pkPct: 85.6, stars: [{ name: "Artemi Panarin", pos: "LW", g: 8, a: 15 }, { name: "Chris Kreider", pos: "LW", g: 8, a: 4 }, { name: "Adam Fox", pos: "D", g: 2, a: 12 }] },
  { abbr: "OTT", name: "Ottawa Senators", ppPct: 21.0, pkPct: 77.5, stars: [{ name: "Brady Tkachuk", pos: "LW", g: 6, a: 8 }, { name: "Tim Stützle", pos: "C", g: 5, a: 10 }] },
  { abbr: "PHI", name: "Philadelphia Flyers", ppPct: 15.6, pkPct: 83.1, stars: [{ name: "Travis Konecny", pos: "RW", g: 6, a: 7 }] },
  { abbr: "PIT", name: "Pittsburgh Penguins", ppPct: 22.1, pkPct: 79.9, stars: [{ name: "Sidney Crosby", pos: "C", g: 7, a: 11 }, { name: "Evgeni Malkin", pos: "C", g: 5, a: 9 }] },
  { abbr: "SEA", name: "Seattle Kraken", ppPct: 20.3, pkPct: 78.9, stars: [{ name: "Jared McCann", pos: "LW", g: 6, a: 7 }] },
  { abbr: "SJS", name: "San Jose Sharks", ppPct: 16.2, pkPct: 74.0, stars: [{ name: "Macklin Celebrini", pos: "C", g: 5, a: 6 }] },
  { abbr: "STL", name: "St. Louis Blues", ppPct: 20.5, pkPct: 79.1, stars: [{ name: "Robert Thomas", pos: "C", g: 4, a: 10 }] },
  { abbr: "TBL", name: "Tampa Bay Lightning", ppPct: 29.4, pkPct: 82.5, stars: [{ name: "Nikita Kucherov", pos: "RW", g: 9, a: 18 }, { name: "Brayden Point", pos: "C", g: 8, a: 7 }, { name: "Victor Hedman", pos: "D", g: 3, a: 12 }] },
  { abbr: "TOR", name: "Toronto Maple Leafs", ppPct: 25.0, pkPct: 84.1, stars: [{ name: "Auston Matthews", pos: "C", g: 8, a: 6 }, { name: "Mitch Marner", pos: "RW", g: 4, a: 14 }, { name: "William Nylander", pos: "RW", g: 7, a: 9 }] },
  { abbr: "UTA", name: "Utah Hockey Club", ppPct: 19.5, pkPct: 78.4, stars: [{ name: "Clayton Keller", pos: "RW", g: 6, a: 9 }] },
  { abbr: "VAN", name: "Vancouver Canucks", ppPct: 26.8, pkPct: 82.6, stars: [{ name: "J.T. Miller", pos: "C", g: 7, a: 11 }, { name: "Elias Pettersson", pos: "C", g: 6, a: 10 }, { name: "Quinn Hughes", pos: "D", g: 3, a: 14 }] },
  { abbr: "VGK", name: "Vegas Golden Knights", ppPct: 24.1, pkPct: 81.8, stars: [{ name: "Jack Eichel", pos: "C", g: 6, a: 13 }, { name: "Mark Stone", pos: "RW", g: 5, a: 11 }] },
  { abbr: "WPG", name: "Winnipeg Jets", ppPct: 26.5, pkPct: 84.9, stars: [{ name: "Kyle Connor", pos: "LW", g: 9, a: 8 }, { name: "Mark Scheifele", pos: "C", g: 6, a: 10 }] },
  { abbr: "WSH", name: "Washington Capitals", ppPct: 21.8, pkPct: 81.0, stars: [{ name: "Alex Ovechkin", pos: "LW", g: 9, a: 6 }, { name: "John Carlson", pos: "D", g: 3, a: 9 }] },
];

async function main() {
  console.log("Seeding all 32 NFL teams and 32 NHL teams...");

  // 1. Seed NFL Plays for all 32 NFL teams
  console.log("Generating NFL plays for all 32 franchises...");
  const plays = [];

  for (let t = 0; t < NFL_TEAMS.length; t++) {
    const team = NFL_TEAMS[t];
    const opp = NFL_TEAMS[(t + 1) % NFL_TEAMS.length];

    // 25 plays per team as defense & offense
    for (let i = 1; i <= 25; i++) {
      const down = (i % 4) + 1;
      const yardsToGo = down === 1 ? 10 : down === 2 ? 6 : down === 3 ? (i % 2 === 0 ? 8 : 3) : 2;
      const yardline100 = (i * 9) % 95 + 1;
      const isRedZone = yardline100 <= 20;
      const isGoalLine = yardline100 <= 5;
      const isFirstDrive = i <= 6;
      const afterTurnover = i % 7 === 0;
      const quarter = Math.min(4, Math.floor(i / 7) + 1);
      const scoreDiff = (i % 7) - 3;

      // Defensive perspective (team.abbr is defensiveTeam)
      const isBlitzDef = Math.random() * 100 < (down === 3 ? team.blitzBase * 1.35 : team.blitzBase);
      const isPassDef = Math.random() * 100 < opp.passBase;
      const isSackDef = isBlitzDef && Math.random() < 0.18;
      const isPressureDef = isBlitzDef || Math.random() < 0.22;
      const yardsGainedDef = isSackDef ? -7 : isPassDef ? (Math.random() > 0.4 ? 11 : 0) : Math.floor(Math.random() * 6) + 1;
      const isFirstDownDef = yardsGainedDef >= yardsToGo;

      plays.push({
        gameId: `NFL-2024-${team.abbr}-vs-${opp.abbr}`,
        season: 2024,
        week: (t % 14) + 1,
        possessionTeam: opp.abbr,
        defensiveTeam: team.abbr,
        down,
        yardsToGo,
        yardline100,
        quarter,
        timeRemainingSeconds: 900 - (i * 30),
        scoreDiff: -scoreDiff,
        playType: isPassDef ? (isSackDef ? "SACK" : "PASS") : "RUN",
        yardsGained: yardsGainedDef,
        isFirstDown: isFirstDownDef,
        isTouchdown: isRedZone && isFirstDownDef && yardsGainedDef >= yardline100,
        isTurnover: i % 18 === 0,
        isRedZone,
        isGoalLine,
        isTwoMinuteDrill: i % 10 === 0,
        driveNumber: Math.floor(i / 6) + 1,
        isFirstDrive,
        afterTurnover,
        afterPenalty: i % 11 === 0,
        personnel: isPassDef ? "11 Personnel" : "12 Personnel",
        formation: isPassDef ? "SHOTGUN" : "UNDER CENTER",
        isBlitz: isBlitzDef,
        isPressure: isPressureDef,
        isSack: isSackDef,
        isCompletion: isPassDef ? !isSackDef && yardsGainedDef > 0 : null,
        passingYards: isPassDef ? yardsGainedDef : null,
        isExplosivePlay: (isPassDef && yardsGainedDef >= 20) || (!isPassDef && yardsGainedDef >= 12),
        dataProvider: "MOCK_FIXTURE",
        isVerifiedBlitzData: true,
      });

      // Offensive perspective (team.abbr is possessionTeam)
      const isPassOff = Math.random() * 100 < (down === 3 && yardsToGo >= 7 ? team.passBase * 1.25 : team.passBase);
      const yardsGainedOff = isPassOff ? (Math.random() > 0.38 ? 12 : -1) : Math.floor(Math.random() * 5) + 2;
      const isFirstDownOff = yardsGainedOff >= yardsToGo;

      plays.push({
        gameId: `NFL-2024-${team.abbr}-vs-${opp.abbr}-2`,
        season: 2024,
        week: (t % 14) + 1,
        possessionTeam: team.abbr,
        defensiveTeam: opp.abbr,
        down,
        yardsToGo,
        yardline100,
        quarter,
        timeRemainingSeconds: 900 - (i * 30),
        scoreDiff,
        playType: isPassOff ? "PASS" : "RUN",
        yardsGained: yardsGainedOff,
        isFirstDown: isFirstDownOff,
        isTouchdown: isRedZone && isFirstDownOff && yardsGainedOff >= yardline100,
        isTurnover: i % 22 === 0,
        isRedZone,
        isGoalLine,
        isTwoMinuteDrill: i % 10 === 0,
        driveNumber: Math.floor(i / 6) + 1,
        isFirstDrive,
        afterTurnover,
        afterPenalty: i % 12 === 0,
        personnel: isPassOff ? "11 Personnel" : "21 Personnel",
        formation: isPassOff ? "SHOTGUN" : "PISTOL",
        isBlitz: Math.random() * 100 < opp.blitzBase,
        isPressure: Math.random() < 0.25,
        isSack: false,
        isCompletion: isPassOff ? yardsGainedOff > 0 : null,
        passingYards: isPassOff ? yardsGainedOff : null,
        isExplosivePlay: (isPassOff && yardsGainedOff >= 20) || (!isPassOff && yardsGainedOff >= 12),
        dataProvider: "MOCK_FIXTURE",
        isVerifiedBlitzData: true,
      });
    }
  }

  await prisma.nflPlay.createMany({ data: plays });
  console.log(`Seeded ${plays.length} NFL plays across all 32 teams.`);

  // 2. Seed all 32 NHL Teams Stats & Key Players
  console.log("Seeding all 32 NHL team statistics...");

  const nhlStatsData = [];
  const nhlPlayersData = [];

  for (const t of NHL_TEAMS) {
    const opps = Math.floor(Math.random() * 15) + 45; // 45-60 opps
    const ppGoals = Math.round((t.ppPct / 100) * opps);
    const timesSh = Math.floor(Math.random() * 12) + 40;
    const pkAllowed = Math.round(timesSh * (1 - t.pkPct / 100));

    nhlStatsData.push({
      team: t.abbr,
      season: "2024-2025",
      gameType: "REGULAR",
      ppOpportunities: opps,
      ppGoals,
      ppPct: t.ppPct,
      ppOpportunitiesPerGame: Number((opps / 16).toFixed(1)),
      ppGoalsPerGame: Number((ppGoals / 16).toFixed(2)),
      homePpPct: Number((t.ppPct + 2.5).toFixed(1)),
      awayPpPct: Number((t.ppPct - 2.5).toFixed(1)),
      l5PpPct: Number((t.ppPct + (Math.random() * 4 - 2)).toFixed(1)),
      l10PpPct: Number((t.ppPct + (Math.random() * 2 - 1)).toFixed(1)),
      timesShorthanded: timesSh,
      pkGoalsAllowed: pkAllowed,
      pkPct: t.pkPct,
      shGoalsScored: Math.floor(Math.random() * 3) + 1,
      shShotsAllowed: Math.floor(Math.random() * 25) + 55,
      shBlockedShots: Math.floor(Math.random() * 15) + 22,
      shTimeOnIceSeconds: timesSh * 115,
      homePkPct: Number((t.pkPct + 2.0).toFixed(1)),
      awayPkPct: Number((t.pkPct - 2.0).toFixed(1)),
      l5PkPct: Number((t.pkPct + (Math.random() * 3 - 1.5)).toFixed(1)),
      l10PkPct: Number((t.pkPct + (Math.random() * 2 - 1)).toFixed(1)),
      dataProvider: "MOCK_FIXTURE",
    });

    // Seed top players for this team
    for (let idx = 0; idx < t.stars.length; idx++) {
      const p = t.stars[idx];
      nhlPlayersData.push({
        playerId: `${t.abbr}-${idx + 1}`,
        name: p.name,
        team: t.abbr,
        position: p.pos,
        unit: idx === 0 ? "PP1" : idx === 1 ? "PP1" : "PP2",
        unitStatus: "CONFIRMED",
        ppTimeOnIcePerGame: Number((3.6 - idx * 0.4).toFixed(1)),
        ppGoals: p.g,
        ppAssists: p.a,
        ppPoints: p.g + p.a,
        ppShots: p.g * 4 + 8,
        ppShootingPct: Number(((p.g / (p.g * 4 + 8)) * 100).toFixed(1)),
        shareTeamPpGoals: Number(((p.g / Math.max(1, ppGoals)) * 100).toFixed(1)),
        shareTeamPpPoints: Number((((p.g + p.a) / Math.max(2, ppGoals * 2)) * 100).toFixed(1)),
        shTimeOnIcePerGame: p.pos === "D" ? 2.5 : 0.4,
        shBlockedShots: p.pos === "D" ? 14 : 3,
        shBlockedShotsPerMinute: p.pos === "D" ? 0.22 : 0.04,
        isInjured: false,
        source: "MOCK_FIXTURE",
      });
    }

    // Add a dedicated penalty killer defenseman
    nhlPlayersData.push({
      playerId: `${t.abbr}-DEF-PK`,
      name: `${t.name.split(" ")[0]} Top Shutdown D`,
      team: t.abbr,
      position: "D",
      unit: "PK1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 0.1,
      ppGoals: 0,
      ppAssists: 1,
      ppPoints: 1,
      ppShots: 2,
      ppShootingPct: 0.0,
      shareTeamPpGoals: 0.0,
      shareTeamPpPoints: 2.0,
      shTimeOnIcePerGame: 3.1,
      shBlockedShots: 18,
      shBlockedShotsPerMinute: 0.28,
      isInjured: false,
      source: "MOCK_FIXTURE",
    });
  }

  // Insert in chunks or createMany
  for (const s of nhlStatsData) {
    await prisma.nhlSpecialTeamsTeamStats.upsert({
      where: {
        team_season_gameType: {
          team: s.team,
          season: s.season,
          gameType: s.gameType,
        },
      },
      update: s,
      create: s,
    });
  }

  await prisma.nhlSpecialTeamsPlayer.createMany({ data: nhlPlayersData });
  console.log(`Seeded ${nhlStatsData.length} NHL team stats and ${nhlPlayersData.length} NHL players.`);
  console.log("All sports team data seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding all teams:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
