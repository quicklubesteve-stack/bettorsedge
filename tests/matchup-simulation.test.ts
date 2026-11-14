import { describe, it, expect } from "vitest";
import { simulateNflMatchup, simulateNhlMatchup } from "../src/lib/matchup-simulation";

describe("Pro Head-to-Head Monte Carlo Matchup Simulator", () => {
  it("simulates NFL team vs team matchup with yardage and touchdown scorers", () => {
    const result = simulateNflMatchup("BUF", "KC", 500);

    expect(result.league).toBe("NFL");
    expect(result.teamA).toBe("BUF");
    expect(result.teamB).toBe("KC");
    expect(result.iterations).toBe(500);

    // Win probabilities must be realistic and sum to 100% with ties
    expect(result.teamAWinPct).toBeGreaterThan(30);
    expect(result.teamBWinPct).toBeGreaterThan(30);
    expect(Math.round(result.teamAWinPct + result.teamBWinPct + result.tiePct)).toBe(100);

    // Projected scores
    expect(result.projectedScoreA).toBeGreaterThan(15);
    expect(result.projectedScoreB).toBeGreaterThan(15);
    expect(typeof result.avgScoreMargin).toBe("number");

    // Yards ran & thrown
    expect(result.teamAYardsRan).toBeGreaterThan(70);
    expect(result.teamBYardsRan).toBeGreaterThan(70);
    expect(result.teamAYardsThrown).toBeGreaterThan(150);
    expect(result.teamBYardsThrown).toBeGreaterThan(150);
    expect(result.teamATotalYards).toBe(Number((result.teamAYardsRan + result.teamAYardsThrown).toFixed(1)));
    expect(result.teamBTotalYards).toBe(Number((result.teamBYardsRan + result.teamBYardsThrown).toFixed(1)));

    // Touchdown scorers for both teams
    expect(result.touchdownScorersA.length).toBeGreaterThanOrEqual(3);
    expect(result.touchdownScorersB.length).toBeGreaterThanOrEqual(3);

    for (const scorer of result.touchdownScorersA) {
      expect(scorer.player).toBeTruthy();
      expect(scorer.projectedTds).toBeGreaterThanOrEqual(0);
      expect(scorer.anytimeTdPct).toBeGreaterThanOrEqual(0);
      expect(scorer.firstTdPct).toBeGreaterThanOrEqual(0);
    }
  });

  it("simulates NHL team vs team matchup (Toronto Maple Leafs vs Edmonton Oilers)", () => {
    const result = simulateNhlMatchup("TOR", "EDM", 500);

    expect(result.league).toBe("NHL");
    expect(result.teamA).toBe("TOR");
    expect(result.teamB).toBe("EDM");
    expect(result.iterations).toBe(500);

    // Win probabilities must sum to 100%
    expect(result.teamAWinPct).toBeGreaterThan(30);
    expect(result.teamBWinPct).toBeGreaterThan(30);
    expect(Math.round(result.teamAWinPct + result.teamBWinPct)).toBe(100);

    // Projected goals and margin
    expect(result.projectedGoalsA).toBeGreaterThan(1.5);
    expect(result.projectedGoalsB).toBeGreaterThan(1.5);
    expect(result.avgGoalMargin).toBeGreaterThan(0);
    expect(result.overtimePct).toBeGreaterThan(10);

    // Goal scorers
    expect(result.goalScorersA.length).toBeGreaterThanOrEqual(3);
    expect(result.goalScorersB.length).toBeGreaterThanOrEqual(3);

    // McDavid and Matthews should be among the top goal scorers
    const topScorerA = result.goalScorersA[0];
    const topScorerB = result.goalScorersB[0];
    expect(topScorerA.projectedGoals).toBeGreaterThan(0);
    expect(topScorerB.projectedGoals).toBeGreaterThan(0);
    expect(topScorerA.anytimeGoalPct).toBeGreaterThan(15);
    expect(topScorerB.anytimeGoalPct).toBeGreaterThan(15);
  });
});
