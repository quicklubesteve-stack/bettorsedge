import { describe, it, expect, beforeAll } from "vitest";
import {
  syncRosters,
  checkWeeklyRosterSync,
  getTeamRoster,
  getAllRosters,
  getActiveStartersForSimulation,
} from "../src/lib/roster-service";
import { getCurrentSeason, getNextFriday6pmET } from "../src/lib/season-config";
import { prisma } from "../src/lib/db";

describe("Weekly Team Rosters & Depth Charts System (2026-2027 Season)", () => {
  beforeAll(async () => {
    // Ensure clean roster sync
    await syncRosters("ALL", true);
  });

  it("automatically detects active 2026-2027 season and computes Friday 6:00 PM ET schedule", () => {
    const nflSeason = getCurrentSeason("NFL", new Date("2026-11-22"));
    const nhlSeason = getCurrentSeason("NHL", new Date("2026-11-22"));

    expect(nflSeason).toBe("2026-2027");
    expect(nhlSeason).toBe("2026-2027");

    const nextFriday = getNextFriday6pmET(new Date("2026-11-22T12:00:00Z"));
    expect(nextFriday.getUTCDay()).toBe(5); // Friday
    expect(nextFriday.getUTCHours()).toBe(23); // 18:00 EST = 23:00 UTC
  });

  it("synchronizes all 32 NFL teams with active players and sets Friday 6:00 PM ET next sync date", async () => {
    const meta = await prisma.rosterSyncMeta.findUnique({
      where: { league: "NFL" },
    });

    expect(meta).toBeDefined();
    expect(meta?.league).toBe("NFL");
    expect(meta?.totalTeams).toBe(32);
    expect(meta?.totalPlayers).toBeGreaterThanOrEqual(200);
    expect(meta?.updateFrequency).toBe("WEEKLY_FRIDAY_6PM_ET");
    expect(meta?.status).toBe("UP_TO_DATE");

    // Next sync is in the future
    expect(meta!.nextSyncDue.getTime()).toBeGreaterThan(meta!.lastSyncedAt.getTime());
  });

  it("synchronizes all 32 NHL teams with active lines and sets Friday 6:00 PM ET next sync date", async () => {
    const meta = await prisma.rosterSyncMeta.findUnique({
      where: { league: "NHL" },
    });

    expect(meta).toBeDefined();
    expect(meta?.league).toBe("NHL");
    expect(meta?.totalTeams).toBe(32);
    expect(meta?.totalPlayers).toBeGreaterThanOrEqual(180);
    expect(meta?.updateFrequency).toBe("WEEKLY_FRIDAY_6PM_ET");

    expect(meta!.nextSyncDue.getTime()).toBeGreaterThan(meta!.lastSyncedAt.getTime());
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

  it("verifies 2025-2026 roster accuracy: Mitch Marner on Vegas Golden Knights (not Toronto) and Zach Hyman on Edmonton", async () => {
    const torData = await getTeamRoster("NHL", "TOR");
    expect(torData.team).toBe("TOR");
    expect(torData.players.length).toBeGreaterThanOrEqual(7);

    const matthews = torData.players.find((p) => p.name === "Auston Matthews");
    const nylander = torData.players.find((p) => p.name === "William Nylander");
    const torMarner = torData.players.find((p) => p.name === "Mitch Marner");

    expect(matthews).toBeDefined();
    expect(matthews?.position).toBe("C");
    expect(matthews?.goalWeight).toBeGreaterThan(0.2);

    expect(nylander).toBeDefined();
    // In 2025-2026, Mitch Marner is no longer on the Toronto Maple Leafs
    expect(torMarner).toBeUndefined();

    // Verify Mitch Marner is on Vegas Golden Knights (VGK)
    const vgkData = await getTeamRoster("NHL", "VGK");
    expect(vgkData.team).toBe("VGK");
    const vgkMarner = vgkData.players.find((p) => p.name === "Mitch Marner");
    expect(vgkMarner).toBeDefined();
    expect(vgkMarner?.position).toBe("RW");
    expect(vgkMarner?.status).toBe("ACTIVE");

    // Verify Zach Hyman is on Edmonton Oilers (EDM)
    const edmData = await getTeamRoster("NHL", "EDM");
    expect(edmData.team).toBe("EDM");
    const edmHyman = edmData.players.find((p) => p.name === "Zach Hyman");
    const edmMcDavid = edmData.players.find((p) => p.name === "Connor McDavid");
    expect(edmHyman).toBeDefined();
    expect(edmHyman?.position).toBe("LW");
    expect(edmMcDavid).toBeDefined();
  });

  it("excludes injured/IR players from active simulation pool", async () => {
    // Dak Prescott is 100% active and healthy on Dallas
    const activeDallas = await getActiveStartersForSimulation("NFL", "DAL");
    const dak = activeDallas.find((p) => p.name === "Dak Prescott");
    expect(dak).toBeDefined();
    expect(dak?.status).toBe("ACTIVE");

    // Brandin Cooks is on IR, so excluded from active simulation
    const brandinCooks = activeDallas.find((p) => p.name === "Brandin Cooks");
    expect(brandinCooks).toBeUndefined();

    // A.J. Brown is injured (OUT per NFL.com), so excluded from active Philadelphia simulation
    const activePhilly = await getActiveStartersForSimulation("NFL", "PHI");
    const ajBrown = activePhilly.find((p) => p.name === "A.J. Brown");
    expect(ajBrown).toBeUndefined();
    const devonta = activePhilly.find((p) => p.name === "DeVonta Smith");
    expect(devonta).toBeDefined();
    expect(devonta?.status).toBe("ACTIVE");

    // Kirk Cousins is confirmed starting QB on Minnesota; Sam Darnold is OUT (injured)
    const activeVikings = await getActiveStartersForSimulation("NFL", "MIN");
    const cousins = activeVikings.find((p) => p.name === "Kirk Cousins");
    expect(cousins).toBeDefined();
    expect(cousins?.status).toBe("ACTIVE");
    expect(cousins?.depthOrder).toBe(1);

    const darnold = activeVikings.find((p) => p.name === "Sam Darnold");
    expect(darnold).toBeUndefined(); // Darnold is OUT, so excluded from active simulation pool
  });

  it("weekly sync check returns false if sync is not yet due", async () => {
    const needed = await checkWeeklyRosterSync();
    expect(needed).toBe(false); // Rosters were just synced, so no sync required yet
  });
});
