import { describe, it, expect } from "vitest";
import {
  americanToDecimal,
  americanToImpliedProb,
  calculateVigFreeProbabilities,
  calculateEV,
  calculateKellyStake,
  evaluateGameBettingValue,
} from "../src/lib/betting-value-engine";

describe("AI Betting Value & Expected Value Engine", () => {
  it("converts American odds to decimal odds accurately", () => {
    expect(americanToDecimal(150)).toBe(2.5);
    expect(americanToDecimal(-110)).toBe(1.9091);
    expect(americanToDecimal(-200)).toBe(1.5);
    expect(americanToDecimal(100)).toBe(2.0);
  });

  it("calculates raw implied probabilities accurately", () => {
    // +150 => 100 / (150 + 100) = 0.40 (40%)
    expect(americanToImpliedProb(150)).toBeCloseTo(0.40, 2);
    // -110 => 110 / (110 + 100) = 0.5238 (52.38%)
    expect(americanToImpliedProb(-110)).toBeCloseTo(0.5238, 2);
    // -200 => 200 / (200 + 100) = 0.6667 (66.67%)
    expect(americanToImpliedProb(-200)).toBeCloseTo(0.6667, 2);
  });

  it("removes vig and normalizes to fair probabilities summing to 100%", () => {
    // -110 / -110 standard two-way market
    const { fairA, fairB, bookmakerOverround } = calculateVigFreeProbabilities(-110, -110);
    expect(fairA).toBeCloseTo(0.50, 2);
    expect(fairB).toBeCloseTo(0.50, 2);
    expect(fairA + fairB).toBeCloseTo(1.0, 4);
    expect(bookmakerOverround).toBeGreaterThan(4.0); // Standard ~4.76% vig
  });

  it("calculates Expected Value (EV) correctly per $100 stake", () => {
    // 60% win prob at +100 odds:
    // Profit = $100, Loss = $100
    // EV = (0.60 * 100) - (0.40 * 100) = 60 - 40 = +$20.00
    const res = calculateEV(0.60, 100, 100);
    expect(res.ev).toBe(20.0);
    expect(res.roi).toBe(20.0);

    // 45% win prob at -110 odds:
    // Net profit = (1.9091 - 1) * 100 = $90.91
    // EV = (0.45 * 90.91) - (0.55 * 100) = 40.91 - 55 = -$14.09
    const negRes = calculateEV(0.45, -110, 100);
    expect(negRes.ev).toBeLessThan(0);
    expect(negRes.roi).toBeLessThan(0);
  });

  it("preserves invariant: flags NO BET / INSUFFICIENT EDGE when mathematical edge is negative or missing", () => {
    const evaluated = evaluateGameBettingValue(
      "test-game-1",
      "NFL",
      "1:00 PM EST",
      "Team A",
      "Team B",
      -110,
      -110,
      0.50, // AI predicts 50%
      0.50  // AI predicts 50%
    );

    expect(evaluated.homeValue.valueRating).toBe("NO BET / INSUFFICIENT EDGE");
    expect(evaluated.awayValue.valueRating).toBe("NO BET / INSUFFICIENT EDGE");
    expect(evaluated.homeValue.kellyRecommendedStakePct).toBe(0);
    expect(evaluated.awayValue.kellyRecommendedStakePct).toBe(0);
  });

  it("flags HIGH VALUE and allocates safe quarter-Kelly stake when positive EV exists", () => {
    const evaluated = evaluateGameBettingValue(
      "test-game-2",
      "NFL",
      "1:00 PM EST",
      "Dallas Cowboys",
      "Tennessee Titans",
      -130, // Market implies ~56.5% raw, ~54.2% vig-free
      +110,
      0.65, // AI predicts 65.0% on Dallas
      0.35
    );

    expect(evaluated.homeValue.valueRating).toBe("HIGH VALUE");
    expect(evaluated.homeValue.edge).toBeGreaterThan(5.0);
    expect(evaluated.homeValue.evPer100).toBeGreaterThan(5.0);
    expect(evaluated.homeValue.kellyRecommendedStakePct).toBeGreaterThan(0);
    expect(evaluated.homeValue.kellyRecommendedStakePct).toBeLessThanOrEqual(3.5); // Capped at safe bankroll max
  });
});
