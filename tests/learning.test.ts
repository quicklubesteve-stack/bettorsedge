import { describe, it, expect, beforeAll } from "vitest";
import {
  processFinishedGame,
  getLearningOverview,
  ensureTeamWeights,
} from "../src/lib/game-learning";
import { prisma } from "../src/lib/db";

describe("AI Continuous Learning & Self-Calibration Engine", () => {
  beforeAll(async () => {
    // Ensure baseline weights
    await ensureTeamWeights("NFL", "KC", "Kansas City Chiefs");
    await ensureTeamWeights("NFL", "BUF", "Buffalo Bills");
  });

  it("processes a completed game and updates team dynamic weights based on score residuals", async () => {
    const initialWeightsKC = await prisma.teamAdaptiveWeights.findUnique({
      where: { league_team: { league: "NFL", team: "KC" } },
    });

    const initialOff = initialWeightsKC?.offensiveRating ?? 100.0;

    // Process a high-scoring game for KC (34 points vs predicted ~24.5)
    const record = await processFinishedGame({
      gameId: `TEST-GAME-${Date.now()}`,
      league: "NFL",
      homeTeam: "KC",
      awayTeam: "BUF",
      homeTeamName: "Kansas City Chiefs",
      awayTeamName: "Buffalo Bills",
      actualHomeScore: 34,
      actualAwayScore: 21,
      actualScorers: ["Travis Kelce", "Xavier Worthy", "James Cook"],
      actualFirstScorer: "Travis Kelce",
      actualFirstTeamToScore: "KC",
    });

    expect(record).toBeDefined();
    expect(record.isWinnerCorrect).toBe(true);
    expect(record.actualWinner).toBe("KC");
    expect(record.learningInsight).toContain("Learned from KC vs BUF");

    // Check that KC's offensive rating increased because they beat prediction
    const updatedWeightsKC = await prisma.teamAdaptiveWeights.findUnique({
      where: { league_team: { league: "NFL", team: "KC" } },
    });

    expect(updatedWeightsKC?.offensiveRating).toBeGreaterThan(initialOff);
    expect(updatedWeightsKC?.gamesProcessed).toBeGreaterThan(0);
  });

  it("boosts player touchdown probability weight after scoring in a game", async () => {
    // Create or find a test player
    const playerName = `TestScorer-${Date.now()}`;
    const player = await prisma.teamRosterPlayer.create({
      data: {
        league: "NFL",
        team: "KC",
        teamName: "Kansas City Chiefs",
        name: playerName,
        jerseyNumber: 99,
        position: "WR",
        unit: "OFFENSE",
        depthOrder: 2,
        status: "ACTIVE",
        roleDescription: "Test Scorer",
        statsSummary: "Test stats",
        simulationWeight: 0.8,
        touchdownWeight: 0.20,
        season: "2024",
      },
    });

    const weightBefore = player.touchdownWeight;

    await processFinishedGame({
      gameId: `TEST-PLAYER-${Date.now()}`,
      league: "NFL",
      homeTeam: "KC",
      awayTeam: "DEN",
      homeTeamName: "Kansas City Chiefs",
      awayTeamName: "Denver Broncos",
      actualHomeScore: 24,
      actualAwayScore: 17,
      actualScorers: [playerName],
      actualFirstScorer: playerName,
    });

    const playerAfter = await prisma.teamRosterPlayer.findUnique({
      where: { id: player.id },
    });

    expect(playerAfter?.touchdownWeight).toBeGreaterThan(weightBefore);
  });

  it("calculates cumulative accuracy and maintains model generation progression", async () => {
    const overview = await getLearningOverview("NFL");

    expect(overview.totalGamesLearned).toBeGreaterThan(0);
    expect(overview.overallAccuracyPct).toBeGreaterThan(70);
    expect(overview.avgScoreMarginError).toBeLessThan(10);
    expect(overview.recentLearnings.length).toBeGreaterThan(0);
    expect(overview.accuracyTrend.length).toBeGreaterThan(0);
  });
});
