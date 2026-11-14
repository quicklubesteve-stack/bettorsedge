import { describe, it, expect, beforeAll } from "vitest";
import {
  syncRosters,
  checkWeeklyRosterSync,
  getTeamRoster,
  getAllRosters,
  getActiveStartersForSimulation,
} from "../src/lib/roster-service";
import { prisma } from "../src/lib/db";

describe("Weekly Team Rosters & Depth Charts System", () => {
  beforeAll(async () => {
    // Ensure clean roster sync
    await syncRosters("ALL", true);
  });

  it("synchronizes all 32 NFL teams with active players and sets 7-day next sync date", async () => {
    const meta = await prisma.rosterSyncMeta.findUnique({
      where: { league: "NFL" },
    });

    expect(meta).toBeDefined();
    expect(meta?.league).toBe("NFL");
    expect(meta?.totalTeams).toBe(32);
    expect(meta?.totalPlayers).toBeGreaterThanOrEqual(200);
    expect(meta?.updateFrequency).toBe("WEEKLY");
    expect(meta?.status).toBe("UP_TO_DATE");

    // Exactly 7 days (allow +/- a few seconds for test runtime)
    const diffDays =
      (meta!.nextSyncDue.getTime() - meta!.lastSyncedAt.getTime()) / (1000 * 60 * 60 * 24);
    expect(Math.round(diffDays)).toBe(7);
  });

  it("synchronizes all 32 NHL teams with active lines and sets 7-day next sync date", async () => {
    const meta = await prisma.rosterSyncMeta.findUnique({
      where: { league: "NHL" },
    });

    expect(meta).toBeDefined();
    expect(meta?.league).toBe("NHL");
    expect(meta?.totalTeams).toBe(32);
    expect(meta?.totalPlayers).toBeGreaterThanOrEqual(180);
    expect(meta?.updateFrequency).toBe("WEEKLY");

    const diffDays =
      (meta!.nextSyncDue.getTime() - meta!.lastSyncedAt.getTime()) / (1000 * 60 * 60 * 24);
    expect(Math.round(diffDays)).toBe(7);
  });

  it("fetches team roster for Kansas City Chiefs with starters and key positions", async () => {
    const data = await getTeamRoster("NFL", "KC");

    expect(data.team).toBe("KC");
    expect(data.players.length).toBeGreaterThanOrEqual(7);

    // Mahomes, Kelce, Hunt should be present
    const mahomes = data.players.find((p) => p.name === "Patrick Mahomes");
    const kelce = data.players.find((p) => p.name === "Travis Kelce");
    const hunt = data.players.find((p) => p.name === "Kareem Hunt");

    expect(mahomes).toBeDefined();
    expect(mahomes?.position).toBe("QB");
    expect(mahomes?.status).toBe("ACTIVE");
    expect(mahomes?.depthOrder).toBe(1);

    expect(kelce).toBeDefined();
    expect(kelce?.position).toBe("TE");
    expect(kelce?.depthOrder).toBe(1);

    expect(hunt).toBeDefined();
    expect(hunt?.position).toBe("RB");
  });

  it("fetches team roster for Toronto Maple Leafs with Matthews, Marner, and Nylander", async () => {
    const data = await getTeamRoster("NHL", "TOR");

    expect(data.team).toBe("TOR");
    expect(data.players.length).toBeGreaterThanOrEqual(7);

    const matthews = data.players.find((p) => p.name === "Auston Matthews");
    const nylander = data.players.find((p) => p.name === "William Nylander");
    const marner = data.players.find((p) => p.name === "Mitch Marner");

    expect(matthews).toBeDefined();
    expect(matthews?.position).toBe("C");
    expect(matthews?.goalWeight).toBeGreaterThan(0.2);

    expect(nylander).toBeDefined();
    expect(marner).toBeDefined();
  });

  it("excludes injured/IR players from active simulation pool", async () => {
    // In our seed, Dak Prescott is marked IR on Dallas
    const activeDallas = await getActiveStartersForSimulation("NFL", "DAL");

    const dak = activeDallas.find((p) => p.name === "Dak Prescott");
    const cooperRush = activeDallas.find((p) => p.name === "Cooper Rush");

    expect(dak).toBeUndefined(); // Injured, so excluded from active simulation
    expect(cooperRush).toBeDefined(); // Backup promoted to active
  });

  it("weekly sync check returns false if sync is not yet due", async () => {
    const needed = await checkWeeklyRosterSync();
    expect(needed).toBe(false); // Rosters were just synced, so no sync required yet
  });
});
