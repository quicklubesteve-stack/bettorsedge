import { describe, it, expect } from "vitest";
import {
  calculatePowerPlayPct,
  calculatePenaltyKillPct,
  calculatePlayerShares,
  analyzePkUnits,
  analyzeBlockedShots,
  compareSpecialTeamsMatchup,
  NhlPlayerRecord,
  NhlTeamSpecialTeamsStats,
} from "../src/lib/nhl-analytics";

describe("NHL Special Teams Intelligence", () => {
  const sampleTeamStats: NhlTeamSpecialTeamsStats = {
    id: "ts-1",
    team: "EDM",
    season: "2024-2025",
    gameType: "REGULAR",
    ppOpportunities: 50,
    ppGoals: 15,
    ppPct: 30.0,
    ppOpportunitiesPerGame: 3.3,
    ppGoalsPerGame: 1.0,
    homePpPct: 32.0,
    awayPpPct: 28.0,
    l5PpPct: 35.0,
    l10PpPct: 31.0,
    timesShorthanded: 40,
    pkGoalsAllowed: 8,
    pkPct: 80.0,
    shGoalsScored: 2,
    shShotsAllowed: 60,
    shBlockedShots: 25,
    shTimeOnIceSeconds: 4800,
    homePkPct: 82.0,
    awayPkPct: 78.0,
    l5PkPct: 80.0,
    l10PkPct: 80.0,
    dataProvider: "MOCK_FIXTURE",
    lastUpdated: new Date().toISOString(),
  };

  const samplePlayers: NhlPlayerRecord[] = [
    {
      id: "p1",
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
      ppShots: 24,
      ppShootingPct: 0,
      shareTeamPpGoals: 0,
      shareTeamPpPoints: 0,
      shTimeOnIcePerGame: 0.1,
      shBlockedShots: 1,
      shBlockedShotsPerMinute: 0,
      isInjured: false,
      source: "MOCK_FIXTURE",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "p2",
      playerId: "EDM-29",
      name: "Leon Draisaitl",
      team: "EDM",
      position: "C",
      unit: "PP1",
      unitStatus: "CONFIRMED",
      ppTimeOnIcePerGame: 3.7,
      ppGoals: 9,
      ppAssists: 6,
      ppPoints: 15,
      ppShots: 30,
      ppShootingPct: 0,
      shareTeamPpGoals: 0,
      shareTeamPpPoints: 0,
      shTimeOnIcePerGame: 0.2,
      shBlockedShots: 2,
      shBlockedShotsPerMinute: 0,
      isInjured: false,
      source: "MOCK_FIXTURE",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "p3",
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
      ppShots: 1,
      ppShootingPct: 0,
      shareTeamPpGoals: 0,
      shareTeamPpPoints: 0,
      shTimeOnIcePerGame: 2.8,
      shBlockedShots: 14,
      shBlockedShotsPerMinute: 0,
      isInjured: false,
      source: "MOCK_FIXTURE",
      lastUpdated: new Date().toISOString(),
    },
  ];

  // Test 6: NHL power-play percentage calculations
  it("calculates team power-play percentage correctly as (PP Goals / PP Opportunities) * 100", () => {
    expect(calculatePowerPlayPct(15, 50)).toBe(30.0);
    expect(calculatePowerPlayPct(7, 28)).toBe(25.0);
    expect(calculatePowerPlayPct(0, 10)).toBe(0.0);
    expect(calculatePowerPlayPct(0, 0)).toBe(0.0);
  });

  // Test 7: NHL player scoring shares
  it("calculates individual player share of team power-play goals and points", () => {
    const teamPpGoals = 15;
    const teamPpPoints = 30; // 15 goals + assists
    const playersWithShares = calculatePlayerShares(samplePlayers, teamPpGoals, teamPpPoints);

    const mcdavid = playersWithShares.find((p) => p.name === "Connor McDavid");
    expect(mcdavid?.shareTeamPpGoals).toBe(40.0); // 6 / 15 * 100
    expect(mcdavid?.shareTeamPpPoints).toBe(53.3); // 16 / 30 * 100
    expect(mcdavid?.ppShootingPct).toBe(25.0); // 6 / 24 * 100

    const draisaitl = playersWithShares.find((p) => p.name === "Leon Draisaitl");
    expect(draisaitl?.shareTeamPpGoals).toBe(60.0); // 9 / 15 * 100
    expect(draisaitl?.ppShootingPct).toBe(30.0); // 9 / 30 * 100
  });

  // Test 8: NHL penalty-kill percentage calculations
  it("calculates team penalty-kill percentage correctly as ((Times SH - PP Goals Allowed) / Times SH) * 100", () => {
    expect(calculatePenaltyKillPct(40, 8)).toBe(80.0);
    expect(calculatePenaltyKillPct(50, 5)).toBe(90.0);
    expect(calculatePenaltyKillPct(10, 0)).toBe(100.0);
    expect(calculatePenaltyKillPct(0, 0)).toBe(100.0);
  });

  // Test 9: NHL shorthanded blocked-shot calculations
  it("strictly separates shorthanded blocked shots from all-situation blocked shots", () => {
    const blockedAnalysis = analyzeBlockedShots(samplePlayers, 120);
    expect(blockedAnalysis.allSituationBlockedShots).toBe(120);
    expect(blockedAnalysis.shorthandedBlockedShots).toBe(17); // 1 + 2 + 14
    expect(blockedAnalysis.defencemenShorthandedBlocks).toBe(14); // Nurse
    expect(blockedAnalysis.forwardsShorthandedBlocks).toBe(3); // McDavid + Draisaitl
    expect(blockedAnalysis.methodologyNote).toContain("exclusively reflect events occurring while team was killing penalties");
  });

  // Matchup Tool
  it("evaluates special teams matchup and warns against naive rate subtraction", () => {
    const torStats: NhlTeamSpecialTeamsStats = {
      ...sampleTeamStats,
      team: "TOR",
      pkPct: 84.0,
      timesShorthanded: 45,
      pkGoalsAllowed: 7,
    };

    const matchup = compareSpecialTeamsMatchup(
      sampleTeamStats,
      torStats,
      samplePlayers,
      samplePlayers
    );

    expect(matchup.powerPlayTeam).toBe("EDM");
    expect(matchup.penaltyKillTeam).toBe("TOR");
    expect(matchup.disclaimer).toContain("not be evaluated by naive rate subtraction");
  });
});
