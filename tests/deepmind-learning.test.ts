import { describe, it, expect } from 'vitest';
import prisma from '../src/lib/db';
import {
  normalizeNhlCoordinates,
  calculateExpectedGoals,
  calculateExpectedPoints,
  calculateNflPlayEpa,
} from '../src/lib/learning/pbp-ingestion';
import { computeRelationalSynergy, updateTeamLatentProfiles } from '../src/lib/learning/relational-graph';
import {
  calculateBrierScore,
  optimizeModelWeights,
  getActiveModelWeightSnapshot,
} from '../src/lib/learning/weight-calibration';
import { runWeeklyLearningCycle } from '../src/lib/learning/weekly-learning-cycle';

describe('DeepMind-Inspired Play-by-Play & Model Calibration Engine', () => {
  describe('NHL Spatial Coordinate & Expected Goals (xG) Engine', () => {
    it('normalizes NHL coordinates so attacking net is always oriented appropriately', () => {
      // Home team defending left means home team attacks right (+X)
      const homeCoords = normalizeNhlCoordinates(70, 10, 'left', true);
      expect(homeCoords.xNorm).toBe(70);
      expect(homeCoords.yNorm).toBe(10);

      // Away team when home defends left attacks left (-X), mirrored to positive attacking zone
      const awayCoords = normalizeNhlCoordinates(70, 10, 'left', false);
      expect(awayCoords.xNorm).toBe(-70);
      expect(awayCoords.yNorm).toBe(-10);
    });

    it('calculates bounded Expected Goals (xG) rewarding high-danger shots', () => {
      // High danger slot shot: close to net (x=80, y=0)
      const slotShot = calculateExpectedGoals(80, 0, 'wrist', true, false, '1551');
      // Low danger point shot: far from net (x=30, y=25)
      const pointShot = calculateExpectedGoals(30, 25, 'slap', false, false, '1551');

      expect(slotShot.xG).toBeGreaterThan(pointShot.xG);
      expect(slotShot.xG).toBeLessThanOrEqual(0.85);
      expect(pointShot.xG).toBeGreaterThanOrEqual(0.01);
      expect(slotShot.isHighDanger).toBe(true);
      expect(pointShot.isHighDanger).toBe(false);
    });

    it('rewards power-play and rush situations with higher xG', () => {
      const evenShot = calculateExpectedGoals(75, 5, 'wrist', false, false, '1551');
      const ppRushShot = calculateExpectedGoals(75, 5, 'wrist', true, true, '1541');

      expect(ppRushShot.xG).toBeGreaterThan(evenShot.xG);
    });
  });

  describe('NFL Expected Points Added (EPA) Engine', () => {
    it('calculates expected points matching situational field position and down/distance', () => {
      // 1st and goal from opponent 2 yardline
      const goalLineEp = calculateExpectedPoints(1, 2, 2);
      // 3rd and 18 from own 10 yard line (yardline100 = 90)
      const own10Ep = calculateExpectedPoints(3, 18, 90);

      expect(goalLineEp).toBeGreaterThan(4.5);
      expect(own10Ep).toBeLessThan(0.5);
    });

    it('awards positive EPA for 1st down conversions and touchdowns, negative for turnovers', () => {
      // 1st and 10 from 50 yardline, gain 25 yards -> 1st down conversion
      const gainResult = calculateNflPlayEpa(1, 10, 50, 25, false, false);
      expect(gainResult.epa).toBeGreaterThan(0.5);
      expect(gainResult.isSuccess).toBe(true);

      // Turnover / interception from opponent 30 yardline
      const turnoverResult = calculateNflPlayEpa(2, 5, 30, 0, true, false);
      expect(turnoverResult.epa).toBeLessThan(-3.0);
      expect(turnoverResult.isSuccess).toBe(false);

      // Touchdown play from 10 yardline
      const tdResult = calculateNflPlayEpa(3, 2, 10, 10, false, true);
      expect(tdResult.epa).toBeGreaterThan(2.0);
      expect(tdResult.isSuccess).toBe(true);
    });
  });

  describe('TacticAI Relational Graph Synergy Engine', () => {
    it('computes relational synergy bounded between 0.82 and 1.25', () => {
      const healthySynergy = computeRelationalSynergy(1.0, 1.0, 0.65);
      const injuredSynergy = computeRelationalSynergy(0.8, 0.6, 0.40);

      expect(healthySynergy).toBeGreaterThanOrEqual(0.82);
      expect(healthySynergy).toBeLessThanOrEqual(1.25);
      expect(injuredSynergy).toBeGreaterThanOrEqual(0.82);
      expect(injuredSynergy).toBeLessThanOrEqual(1.25);
      expect(healthySynergy).toBeGreaterThan(injuredSynergy);
    });

    it('generates latent team profiles for all 32 NHL and 32 NFL teams', async () => {
      const nhlProfiles = await updateTeamLatentProfiles('NHL', 11);
      const nflProfiles = await updateTeamLatentProfiles('NFL', 11);

      expect(nhlProfiles.updatedCount).toBe(32);
      expect(nflProfiles.updatedCount).toBe(32);

      const sampleProfile = await prisma.teamLatentProfile.findFirst({
        where: { teamId: 'BUF', league: 'NFL', weekNumber: 11 },
      });
      expect(sampleProfile).not.toBeNull();
      expect(sampleProfile?.offensiveRating).toBeGreaterThan(80);
      expect(sampleProfile?.playerSynergyGraphScore).toBeGreaterThanOrEqual(0.82);
    });
  });

  describe('AlphaZero Closed-Loop Weight Calibration & Rollback Protection', () => {
    it('computes Brier score accurately', () => {
      // Perfect prediction: pred 1.0, outcome 1.0 -> brier 0
      const brierPerfect = calculateBrierScore([
        { prob: 1.0, outcome: 1.0 },
        { prob: 0.0, outcome: 0.0 },
      ]);
      expect(brierPerfect).toBe(0);

      // Coin flip: pred 0.5, outcome 1.0 -> (0.5 - 1)^2 = 0.25
      const brierCoinFlip = calculateBrierScore([
        { prob: 0.5, outcome: 1.0 },
        { prob: 0.5, outcome: 0.0 },
      ]);
      expect(brierCoinFlip).toBe(0.25);
    });

    it('optimizes model weights and protects against degradation via validation gating', async () => {
      const result = await optimizeModelWeights('NFL', 11);
      expect(result.reason).toBeDefined();
      expect(result.newValidationBrier).toBeGreaterThan(0);
      expect(result.weights).toBeDefined();
      expect(result.weights.playByPlayXgOrEpaWeight).toBeGreaterThan(0);
      expect(result.weights.relationalSynergyGraphWeight).toBeGreaterThan(0);

      // Verify active snapshot lookup
      const active = await getActiveModelWeightSnapshot('NFL');
      expect(active).not.toBeNull();
      expect(active?.isActive).toBe(true);
    });
  });

  describe('Master Weekly Learning Cycle Orchestration', () => {
    it('executes full weekly learning cycle end-to-end and returns structured report', async () => {
      const report = await runWeeklyLearningCycle({ customWeek: 11 });

      expect(report.timestamp).toBeDefined();
      expect(report.weekNumber).toBe(11);
      expect(report.nhlProfilesUpdated).toBe(32);
      expect(report.nflProfilesUpdated).toBe(32);
      expect(report.calibrationResult).toBeDefined();
      expect(report.topTeamRisers.length).toBeGreaterThan(0);
      expect(report.topTeamFallers.length).toBeGreaterThan(0);
      expect(report.activeModelSnapshotId).toBeDefined();
    });
  });
});
