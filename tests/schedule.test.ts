import { describe, it, expect } from "vitest";
import { prisma } from "../src/lib/db";

describe("Game Schedule, Odds, Spreads & Safe Prop Predictions", () => {
  it("contains scheduled games for both NFL and NHL leagues", async () => {
    const games = await prisma.scheduledGame.findMany();
    expect(games.length).toBeGreaterThanOrEqual(6);

    const nflGames = games.filter((g) => g.league === "NFL");
    const nhlGames = games.filter((g) => g.league === "NHL");
    expect(nflGames.length).toBeGreaterThanOrEqual(3);
    expect(nhlGames.length).toBeGreaterThanOrEqual(3);
  });

  it("each scheduled game has valid moneyline, point spread, and win probability", async () => {
    const games = await prisma.scheduledGame.findMany();
    for (const game of games) {
      expect(game.homeMoneyline).toBeDefined();
      expect(game.awayMoneyline).toBeDefined();
      expect(typeof game.spread).toBe("number");
      expect(game.overUnder).toBeGreaterThan(0);

      // Win probabilities must be positive and sum approximately to 100%
      expect(game.homeWinProbability).toBeGreaterThan(0);
      expect(game.awayWinProbability).toBeGreaterThan(0);
      const sumProb = game.homeWinProbability + game.awayWinProbability;
      expect(Math.round(sumProb)).toBe(100);
    }
  });

  it("each scheduled game provides AI score prediction and spread pick", async () => {
    const games = await prisma.scheduledGame.findMany();
    for (const game of games) {
      expect(game.predictedWinner).toBeTruthy();
      expect(game.predictedScore).toMatch(/\d+\s*-\s*\d+/);
      expect(game.predictedSpreadPick).toBeTruthy();
      expect(["HIGH", "MODERATE", "LEAN"]).toContain(game.spreadConfidence);
      expect(["OVER", "UNDER"]).toContain(game.predictedOverUnder);
      expect(game.predictionReasoning.length).toBeGreaterThan(20);
    }
  });

  it("each scheduled game provides first team to score and player first scorer props", async () => {
    const games = await prisma.scheduledGame.findMany();
    for (const game of games) {
      expect(game.firstTeamToScore).toBeTruthy();
      expect(game.firstTeamReasoning.length).toBeGreaterThan(15);

      expect(game.homeFirstScorer).toBeTruthy();
      expect(game.homeFirstScorerOdds).toBeTruthy();
      expect(game.homeFirstScorerReason.length).toBeGreaterThan(15);

      expect(game.awayFirstScorer).toBeTruthy();
      expect(game.awayFirstScorerOdds).toBeTruthy();
      expect(game.awayFirstScorerReason.length).toBeGreaterThan(15);

      // Safe props json
      const safeProps = JSON.parse(game.safePropsJson);
      expect(Array.isArray(safeProps)).toBe(true);
      expect(safeProps.length).toBeGreaterThanOrEqual(2);
      for (const prop of safeProps) {
        expect(prop.player).toBeTruthy();
        expect(prop.prop).toBeTruthy();
        expect(prop.conviction).toMatch(/Safe/i);
        expect(prop.reason.length).toBeGreaterThan(10);
      }
    }
  });
});
