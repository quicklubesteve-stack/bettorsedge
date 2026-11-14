import { describe, it, expect } from "vitest";
import {
  calculateBlitzRate,
  filterPlaysByCategory,
  calculateBlitzEffectiveness,
  classifyOffensivePlay,
  calculateOffensiveTendencies,
  predictSituationalBlitz,
  NflPlayRecord,
} from "../src/lib/nfl-analytics";

describe("NFL Analytics & Situational Intelligence", () => {
  const mockPlays: NflPlayRecord[] = [
    // 3rd down verified blitz play
    {
      id: "p1",
      gameId: "g1",
      season: 2024,
      week: 1,
      possessionTeam: "Opponent",
      defensiveTeam: "Team A",
      down: 3,
      yardsToGo: 8,
      yardline100: 35,
      quarter: 3,
      timeRemainingSeconds: 400,
      scoreDiff: -3,
      playType: "PASS",
      yardsGained: 0,
      isFirstDown: false,
      isTouchdown: false,
      isTurnover: false,
      isRedZone: false,
      isGoalLine: false,
      isTwoMinuteDrill: false,
      driveNumber: 5,
      isFirstDrive: false,
      afterTurnover: false,
      afterPenalty: false,
      isBlitz: true,
      isPressure: true,
      isSack: false,
      isCompletion: false,
      passingYards: 0,
      isExplosivePlay: false,
      dataProvider: "PFF",
      isVerifiedBlitzData: true,
    },
    // 3rd down verified non-blitz play
    {
      id: "p2",
      gameId: "g1",
      season: 2024,
      week: 1,
      possessionTeam: "Opponent",
      defensiveTeam: "Team A",
      down: 3,
      yardsToGo: 4,
      yardline100: 15,
      quarter: 2,
      timeRemainingSeconds: 100,
      scoreDiff: 0,
      playType: "PASS",
      yardsGained: 15,
      isFirstDown: true,
      isTouchdown: true,
      isTurnover: false,
      isRedZone: true,
      isGoalLine: false,
      isTwoMinuteDrill: true,
      driveNumber: 3,
      isFirstDrive: false,
      afterTurnover: true,
      afterPenalty: false,
      isBlitz: false,
      isPressure: false,
      isSack: false,
      isCompletion: true,
      passingYards: 15,
      isExplosivePlay: true,
      dataProvider: "PFF",
      isVerifiedBlitzData: true,
    },
    // 1st down run play
    {
      id: "p3",
      gameId: "g1",
      season: 2024,
      week: 1,
      possessionTeam: "Team A",
      defensiveTeam: "Opponent",
      down: 1,
      yardsToGo: 10,
      yardline100: 75,
      quarter: 1,
      timeRemainingSeconds: 880,
      scoreDiff: 0,
      playType: "RUN",
      yardsGained: 4,
      isFirstDown: false,
      isTouchdown: false,
      isTurnover: false,
      isRedZone: false,
      isGoalLine: false,
      isTwoMinuteDrill: false,
      driveNumber: 1,
      isFirstDrive: true,
      afterTurnover: false,
      afterPenalty: false,
      isBlitz: false,
      isPressure: false,
      isSack: false,
      isCompletion: null,
      passingYards: null,
      isExplosivePlay: false,
      dataProvider: "PFF",
      isVerifiedBlitzData: true,
    },
    // Kneel-down play
    {
      id: "p4",
      gameId: "g1",
      season: 2024,
      week: 1,
      possessionTeam: "Team A",
      defensiveTeam: "Opponent",
      down: 4,
      yardsToGo: 1,
      yardline100: 50,
      quarter: 4,
      timeRemainingSeconds: 20,
      scoreDiff: 4,
      playType: "KNEEL",
      yardsGained: -1,
      isFirstDown: false,
      isTouchdown: false,
      isTurnover: false,
      isRedZone: false,
      isGoalLine: false,
      isTwoMinuteDrill: false,
      driveNumber: 10,
      isFirstDrive: false,
      afterTurnover: false,
      afterPenalty: false,
      isBlitz: false,
      isPressure: false,
      isSack: false,
      isCompletion: null,
      passingYards: null,
      isExplosivePlay: false,
      dataProvider: "PFF",
      isVerifiedBlitzData: true,
    },
    // Unverified play (missing blitz data)
    {
      id: "p5",
      gameId: "g2",
      season: 2024,
      week: 2,
      possessionTeam: "Opponent",
      defensiveTeam: "Team A",
      down: 2,
      yardsToGo: 6,
      yardline100: 10,
      quarter: 1,
      timeRemainingSeconds: 700,
      scoreDiff: -7,
      playType: "PASS",
      yardsGained: 6,
      isFirstDown: true,
      isTouchdown: false,
      isTurnover: false,
      isRedZone: true,
      isGoalLine: false,
      isTwoMinuteDrill: false,
      driveNumber: 1,
      isFirstDrive: true,
      afterTurnover: false,
      afterPenalty: false,
      isBlitz: null, // UNVERIFIED!
      isPressure: true,
      isSack: false,
      isCompletion: true,
      passingYards: 6,
      isExplosivePlay: false,
      dataProvider: "STANDARD_BOX",
      isVerifiedBlitzData: false,
    },
  ];

  // Test 1: NFL blitz percentage calculations
  it("calculates blitz percentage accurately as (Blitzes / Eligible Plays) * 100", () => {
    expect(calculateBlitzRate(18, 40)).toBe(45.0);
    expect(calculateBlitzRate(10, 25)).toBe(40.0);
    expect(calculateBlitzRate(0, 15)).toBe(0.0);
    expect(calculateBlitzRate(0, 0)).toBeNull();
  });

  // Test 2: Down-and-distance filters
  it("filters plays by down and distance brackets accurately", () => {
    const categories = filterPlaysByCategory(mockPlays);
    expect(categories.hasVerifiedData).toBe(true);
    expect(categories.thirdDown.qualifyingPlays).toBe(2);
    expect(categories.thirdDown.blitzes).toBe(1);
    expect(categories.thirdDown.blitzRate).toBe(50.0);

    expect(categories.mediumYardage.qualifyingPlays).toBe(1); // p2 yardsToGo: 4
    expect(categories.longYardage.qualifyingPlays).toBe(2); // p1 (8), p3 (10)
  });

  // Test 3: Drive-based analysis
  it("accurately classifies opening drive and turnover-following drives", () => {
    const categories = filterPlaysByCategory(mockPlays);
    expect(categories.firstDrive.qualifyingPlays).toBe(1);
    expect(categories.afterTurnover.qualifyingPlays).toBe(1);
    expect(categories.twoMinute.qualifyingPlays).toBe(1);
  });

  // Test 4: Run/Pass classifications
  it("properly classifies designed runs, passes, scrambles, and excludes kneels", () => {
    expect(classifyOffensivePlay(mockPlays[0])).toBe("PASS");
    expect(classifyOffensivePlay(mockPlays[2])).toBe("RUN");
    expect(classifyOffensivePlay(mockPlays[3])).toBe("OTHER");

    const tendencies = calculateOffensiveTendencies(mockPlays, true);
    // Kneel should be excluded from denominator
    expect(tendencies.totalEligiblePlays).toBe(4);
    expect(tendencies.overall.runs).toBe(1);
    expect(tendencies.overall.passes).toBe(3);
    expect(tendencies.overall.runPercentage).toBe(25.0);
    expect(tendencies.overall.passPercentage).toBe(75.0);
  });

  // Test 5: Red-zone calculations
  it("accurately isolates red-zone defensive blitz frequency", () => {
    const categories = filterPlaysByCategory(mockPlays);
    expect(categories.redZone.qualifyingPlays).toBe(1);
    expect(categories.redZone.blitzes).toBe(0);
    expect(categories.redZone.blitzRate).toBe(0.0);
  });

  // Test 10: Missing or incomplete data
  it("handles unverified blitz data gracefully and flags unavailable status", () => {
    const unverifiedOnly = mockPlays.filter((p) => !p.isVerifiedBlitzData);
    const categories = filterPlaysByCategory(unverifiedOnly);

    expect(categories.hasVerifiedData).toBe(false);
    expect(categories.overall.blitzRate).toBeNull();

    const predictor = predictSituationalBlitz(unverifiedOnly, { down: 3 });
    expect(predictor.hasVerifiedData).toBe(false);
    expect(predictor.notes).toBe("Verified blitz data is unavailable for this game or situation.");
  });

  // Blitz effectiveness comparison
  it("compares blitzing vs non-blitzing defensive performance without conflating pressure with blitz", () => {
    const effectiveness = calculateBlitzEffectiveness(mockPlays);
    expect(effectiveness.hasVerifiedData).toBe(true);
    expect(effectiveness.blitzPlays).toBe(1);
    expect(effectiveness.nonBlitzPlays).toBe(3);
    expect(effectiveness.blitzCompletionPct).toBe(0.0); // 0/1 pass completed on blitz
    expect(effectiveness.nonBlitzCompletionPct).toBe(100.0); // 1/1 pass completed on non-blitz
  });
});
