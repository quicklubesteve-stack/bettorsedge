import { describe, it, expect } from "vitest";
import {
  runPredictiveSimulation,
  classifyActualPlay,
  predictModel0,
  predictModel1,
  predictModel2,
  predictModel3,
} from "../src/lib/simulation-engine";

describe("Predictive Simulation & Model Calibration Engine", () => {
  it("correctly classifies passing and running play types", () => {
    expect(classifyActualPlay({ playType: "PASS" })).toBe("PASS");
    expect(classifyActualPlay({ playType: "SACK" })).toBe("PASS");
    expect(classifyActualPlay({ playType: "RUN" })).toBe("RUN");
    expect(classifyActualPlay({ playType: "SCRAMBLE" })).toBe("RUN");
    expect(classifyActualPlay({ playType: "KNEEL" })).toBeNull();
    expect(classifyActualPlay({ playType: "SPIKE" })).toBeNull();
  });

  it("Model 3 identifies high-conviction 3rd & long passing situations", () => {
    const play = {
      id: "1",
      gameId: "g1",
      possessionTeam: "KC",
      defensiveTeam: "SF",
      down: 3,
      yardsToGo: 10,
      yardline100: 45,
      quarter: 2,
      timeRemainingSeconds: 400,
      scoreDiff: 0,
      playType: "PASS",
      isRedZone: false,
      isGoalLine: false,
      isTwoMinuteDrill: false,
    };
    const pred = predictModel3(play);
    expect(pred.isHighConviction).toBe(true);
    expect(pred.predicted).toBe("PASS");
    expect(pred.passProb).toBeGreaterThanOrEqual(0.80);
  });

  it("Model 3 identifies high-conviction short-yardage and goal-line running situations", () => {
    const play = {
      id: "2",
      gameId: "g2",
      possessionTeam: "BAL",
      defensiveTeam: "PIT",
      down: 4,
      yardsToGo: 1,
      yardline100: 2,
      quarter: 3,
      timeRemainingSeconds: 500,
      scoreDiff: 3,
      playType: "RUN",
      isRedZone: true,
      isGoalLine: true,
      isTwoMinuteDrill: false,
    };
    const pred = predictModel3(play);
    expect(pred.isHighConviction).toBe(true);
    expect(pred.predicted).toBe("RUN");
    expect(pred.passProb).toBeLessThanOrEqual(0.20);
  });

  it("Simulation achieves >= 90% empirical accuracy on high-conviction plays", async () => {
    const report = await runPredictiveSimulation();

    expect(report.eligiblePlays).toBeGreaterThanOrEqual(100);
    expect(report.iterations).toHaveLength(4);

    // Iteration 0 baseline should be < 70%
    expect(report.iterations[0].accuracy).toBeLessThan(70);

    // Iteration 3 calibrated model must achieve >= 90%
    const finalModel = report.iterations[3];
    expect(finalModel.meetsTarget).toBe(true);
    expect(finalModel.accuracy).toBeGreaterThanOrEqual(90.0);
    expect(finalModel.passAccuracy).toBeGreaterThanOrEqual(90.0);
    expect(finalModel.runAccuracy).toBeGreaterThanOrEqual(88.0);
    expect(report.finalAccuracy).toBeGreaterThanOrEqual(90.0);
    expect(report.isSuccess).toBe(true);
  });
});
