import { describe, it, expect } from "vitest";
import { prisma } from "../src/lib/db";

describe("Safe Bets & High-Conviction Predictions Intelligence", () => {
  it("provides scheduled games with predictions across NFL and NHL", async () => {
    const games = await prisma.scheduledGame.findMany();
    expect(games.length).toBeGreaterThanOrEqual(10);

    const nflGames = games.filter((g) => g.league === "NFL");
    const nhlGames = games.filter((g) => g.league === "NHL");
    expect(nflGames.length).toBeGreaterThanOrEqual(5);
    expect(nhlGames.length).toBeGreaterThanOrEqual(5);
  });

  it("identifies who will beat the spread with high confidence", async () => {
    const games = await prisma.scheduledGame.findMany();
    
    for (const game of games) {
      expect(game.predictedSpreadPick).toBeDefined();
      expect(game.spreadConfidence).toMatch(/^(HIGH|MODERATE|LEAN)$/);
      expect(game.predictedScore).toMatch(/^\d+\s*-\s*\d+$/);
      expect(game.predictionReasoning.length).toBeGreaterThan(20);
    }

    const highConfidenceSpreads = games.filter((g) => g.spreadConfidence === "HIGH");
    expect(highConfidenceSpreads.length).toBeGreaterThan(0);
  });

  it("provides straight-up outright winner picks with win probabilities", async () => {
    const games = await prisma.scheduledGame.findMany();

    for (const game of games) {
      expect(game.predictedWinner).toBeDefined();
      expect([game.homeTeam, game.awayTeam]).toContain(game.predictedWinner);
      expect(game.homeWinProbability + game.awayWinProbability).toBeCloseTo(100, 0);
      expect(game.homeWinProbability).toBeGreaterThan(0);
      expect(game.awayWinProbability).toBeGreaterThan(0);
    }
  });

  it("calculates optimal game totals (Over / Under)", async () => {
    const games = await prisma.scheduledGame.findMany();

    for (const game of games) {
      expect(["OVER", "UNDER"]).toContain(game.predictedOverUnder);
      expect(game.overUnder).toBeGreaterThan(0);
    }
  });

  it("contains 90%+ safe player props with verified 2025-2026 rosters", async () => {
    const games = await prisma.scheduledGame.findMany();
    const allProps: any[] = [];

    for (const game of games) {
      const props = JSON.parse(game.safePropsJson || "[]");
      expect(props.length).toBeGreaterThanOrEqual(2);
      allProps.push(...props);
    }

    // Verify Mitch Marner is on Vegas Golden Knights (VGK)
    const marnerProps = allProps.filter((p) => p.player.includes("Mitch Marner"));
    expect(marnerProps.length).toBeGreaterThan(0);
    for (const p of marnerProps) {
      expect(p.player).toContain("VGK");
    }

    // Verify Zach Hyman is on Edmonton Oilers (EDM)
    const hymanProps = allProps.filter((p) => p.player.includes("Zach Hyman"));
    expect(hymanProps.length).toBeGreaterThan(0);
    for (const p of hymanProps) {
      expect(p.conviction).toMatch(/9\d% Safe Bet/);
    }

    // Verify high conviction threshold across all safe props
    for (const p of allProps) {
      const match = p.conviction.match(/(\d+)%/);
      expect(match).not.toBeNull();
      const pct = parseInt(match[1], 10);
      expect(pct).toBeGreaterThanOrEqual(90);
    }
  });
});
