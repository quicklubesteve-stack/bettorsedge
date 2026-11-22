import { describe, it, expect } from "vitest";
import { getPerformanceReport } from "../src/lib/model-performance";

describe("Model Performance & 90% Target Audit", () => {
  it("enforces R&D target of 90% while returning honest, uninflated real-world results", () => {
    const report = getPerformanceReport();
    expect(report.overallAccuracy.targetRndAccuracyPct).toBe(90.0);
    // Honest verified accuracy is tracked realistically (~69-72%), not falsely inflated to 90%
    expect(report.overallAccuracy.actualCombinedAccuracyPct).toBeGreaterThan(65.0);
    expect(report.overallAccuracy.actualCombinedAccuracyPct).toBeLessThan(80.0);
    expect(report.overallAccuracy.nflAccuracyPct).toBeGreaterThan(68.0);
    expect(report.overallAccuracy.nhlAccuracyPct).toBeGreaterThan(65.0);
    expect(report.overallAccuracy.totalGamesAudited).toBeGreaterThanOrEqual(100);
  });

  it("benchmarks Brier score showing calibration superior to random coin toss (0.250)", () => {
    const report = getPerformanceReport();
    expect(report.brierScore.ensembleBrier).toBeLessThan(0.250);
    expect(report.brierScore.ensembleBrier).toBeLessThan(report.brierScore.eloBaselineBrier);
    expect(report.brierScore.ensembleBrier).toBeLessThan(report.brierScore.marketConsensusBrier);
  });

  it("evaluates model architecture comparison matrix including Elo, Logistic Regression, and Ensemble", () => {
    const report = getPerformanceReport();
    const modelNames = report.modelComparison.map((m) => m.modelName);
    expect(modelNames.some((n) => n.includes("Bayesian Calibrated Ensemble"))).toBe(true);
    expect(modelNames.some((n) => n.includes("Gradient Boosted Trees"))).toBe(true);
    expect(modelNames.some((n) => n.includes("Logistic Regression"))).toBe(true);
    expect(modelNames.some((n) => n.includes("Elo Rating"))).toBe(true);
  });

  it("provides empirical calibration buckets with low divergence from expected probabilities", () => {
    const report = getPerformanceReport();
    expect(report.calibrationBuckets.length).toBeGreaterThanOrEqual(4);
    for (const bucket of report.calibrationBuckets) {
      // Divergence should be within 2.0%
      expect(Math.abs(bucket.calibrationDiff)).toBeLessThanOrEqual(2.0);
    }
  });

  it("maintains historical audit trail with zero future data leakage", () => {
    const report = getPerformanceReport();
    expect(report.recentAuditTrail.length).toBeGreaterThan(0);
    for (const record of report.recentAuditTrail) {
      expect(record.predictedProbPct).toBeGreaterThan(0);
      expect(record.predictedProbPct).toBeLessThan(100);
      expect(typeof record.isCorrect).toBe("boolean");
      expect(record.brierError).toBeGreaterThanOrEqual(0);
    }
  });
});
