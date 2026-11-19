import { describe, it, expect } from "vitest";

describe("Betting Explained & Decision Helper", () => {
  it("calculates American odds profit and payouts correctly", () => {
    // Minus odds (-150): Bet $150 to win $100
    const bet1 = 150;
    const odds1 = -150;
    const profit1 = (bet1 * 100) / Math.abs(odds1);
    expect(profit1).toBeCloseTo(100, 1);
    expect(bet1 + profit1).toBeCloseTo(250, 1);

    // Standard -110 odds: Bet $110 to win $100
    const bet2 = 110;
    const odds2 = -110;
    const profit2 = (bet2 * 100) / Math.abs(odds2);
    expect(profit2).toBeCloseTo(100, 1);

    // Plus odds (+150): Bet $100 to win $150
    const bet3 = 100;
    const odds3 = 150;
    const profit3 = (bet3 * odds3) / 100;
    expect(profit3).toBeCloseTo(150, 1);
    expect(bet3 + profit3).toBeCloseTo(250, 1);
  });

  it("calculates sportsbook implied win probability correctly", () => {
    // -110: 110 / (110 + 100) = 52.38%
    const oddsMinus110 = 110;
    const impliedMinus = (oddsMinus110 / (oddsMinus110 + 100)) * 100;
    expect(impliedMinus).toBeCloseTo(52.38, 1);

    // +150: 100 / (150 + 100) = 40.0%
    const oddsPlus150 = 150;
    const impliedPlus = (100 / (oddsPlus150 + 100)) * 100;
    expect(impliedPlus).toBeCloseTo(40.0, 1);

    // -200: 200 / (200 + 100) = 66.67%
    const oddsMinus200 = 200;
    const implied200 = (oddsMinus200 / (oddsMinus200 + 100)) * 100;
    expect(implied200).toBeCloseTo(66.67, 1);
  });

  it("verifies bankroll unit sizing rules (1% to 2% rule)", () => {
    const bankroll = 1000;
    const oneUnitMin = bankroll * 0.01; // 1% = $10
    const oneUnitMax = bankroll * 0.02; // 2% = $20

    expect(oneUnitMin).toBe(10);
    expect(oneUnitMax).toBe(20);
    expect(oneUnitMax).toBeLessThanOrEqual(bankroll * 0.05); // Never exceed 5%
  });

  it("verifies spread cover logic for football and puck line logic for hockey", () => {
    // Football: Bills -2.5 vs Chiefs
    // Score: Bills 27, Chiefs 24 (Margin: +3)
    const billsScore = 27;
    const chiefsScore = 24;
    const spread = -2.5;
    const billsCover = billsScore + spread > chiefsScore; // 24.5 > 24
    expect(billsCover).toBe(true);

    // Hockey Puck Line: Vegas +1.5 vs Toronto
    // Score: Toronto 3, Vegas 2 (Margin: 1 goal loss for Vegas)
    const torScore = 3;
    const vgkScore = 2;
    const puckLine = 1.5;
    const vgkCover = vgkScore + puckLine > torScore; // 3.5 > 3
    expect(vgkCover).toBe(true);
  });
});
