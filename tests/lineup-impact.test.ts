import { describe, it, expect } from "vitest";
import { getLineupImpactEvents } from "../src/lib/lineup-change-monitor";
import { getScheduleStatus, triggerManualSync } from "../src/lib/schedule-sync-service";

describe("Lineup Impact & Schedule Sync Services", () => {
  it("tracks Before/After probabilities for verified injury and lineup events", () => {
    const events = getLineupImpactEvents();
    expect(events.length).toBeGreaterThanOrEqual(5);

    // Verify Dak Prescott active QB1 event
    const dakEvent = events.find((e) => e.affectedTeam.includes("Dallas") && e.headline.includes("Dak Prescott"));
    expect(dakEvent).toBeDefined();
    expect(dakEvent?.afterWinProb).toBeGreaterThan(dakEvent!.beforeWinProb);
    expect(dakEvent?.probDelta).toBeGreaterThan(0);
    expect(dakEvent?.verifiedSourceUrl).toContain("nfl.com");

    // Verify A.J. Brown OUT event
    const ajBrownEvent = events.find((e) => e.headline.includes("A.J. Brown"));
    expect(ajBrownEvent).toBeDefined();
    expect(ajBrownEvent?.afterWinProb).toBeLessThan(ajBrownEvent!.beforeWinProb);
    expect(ajBrownEvent?.probDelta).toBeLessThan(0);
  });

  it("provides scheduled update config in America/Toronto timezone with all 5 daily checkpoints", () => {
    const status = getScheduleStatus();
    expect(status.timezone).toContain("America/Toronto");
    expect(status.cloudflareCronActive).toBe(true);
    expect(status.nextScheduledJobs.length).toBeGreaterThanOrEqual(4);

    const descriptions = status.nextScheduledJobs.map((j) => j.time);
    expect(descriptions.some((d) => d.includes("6:00 AM"))).toBe(true);
    expect(descriptions.some((d) => d.includes("12:00 PM"))).toBe(true);
    expect(descriptions.some((d) => d.includes("6:00 PM"))).toBe(true);
  });

  it("executes manual refresh on demand and prepends to the audit log", () => {
    const initialLogsCount = getScheduleStatus().recentLogs.length;
    const log = triggerManualSync("Vitest Test Suite");
    expect(log.status).toBe("SUCCESS");
    expect(log.recordsProcessed.nflRosters).toBe(32);
    expect(log.recordsProcessed.nhlRosters).toBe(32);

    const updatedStatus = getScheduleStatus();
    expect(updatedStatus.recentLogs[0].id).toBe(log.id);
  });
});
