import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "child_process";
import {
  syncLiveNhlStandings,
  syncLiveNflStandings,
  syncLiveInjuries,
  syncAllLiveSportsData,
} from "../src/lib/live-data-service";
import { evaluateAtsBettingValue } from "../src/lib/betting-value-engine";
import { prisma } from "../src/lib/db";

describe("Live Data Ingestion & ATS Betting Engine", () => {
  afterAll(() => {
    execSync("node scripts/seed-standings.js");
  });
  it("evaluates Against-The-Spread (ATS) odds with cover probabilities summing to 100.0%", () => {
    const nflAts = evaluateAtsBettingValue(
      "NFL",
      "DAL",
      "TEN",
      7.5,
      "HOME",
      0.785,
      "31 - 17",
      -110
    );

    expect(nflAts.spread).toBe(7.5);
    expect(nflAts.homeSpreadDisplay).toContain("DAL -7.5");
    expect(nflAts.awaySpreadDisplay).toContain("TEN +7.5");
    expect(nflAts.homeCoverProb + nflAts.awayCoverProb).toBeCloseTo(100.0, 1);
    expect(nflAts.coverProbability).toBeGreaterThan(50);
    expect(["HIGH VALUE", "MODERATE VALUE", "LEAN VALUE", "NO BET / INSUFFICIENT EDGE"]).toContain(
      nflAts.valueRating
    );

    const nhlAts = evaluateAtsBettingValue(
      "NHL",
      "EDM",
      "STL",
      1.5,
      "HOME",
      0.68,
      "4 - 2",
      -110
    );

    expect(nhlAts.spread).toBe(1.5);
    expect(nhlAts.homeCoverProb + nhlAts.awayCoverProb).toBeCloseTo(100.0, 1);
    expect(nhlAts.rationale).toBeTruthy();
  });

  it("syncs live NHL standings from official NHL API (api-web.nhle.com)", async () => {
    const res = await syncLiveNhlStandings();
    expect(res.count).toBe(32);

    const edm = await prisma.teamStandings.findFirst({
      where: { league: "NHL", team: "EDM" },
    });
    expect(edm).toBeDefined();
    expect(edm?.gamesPlayed).toBeGreaterThanOrEqual(20);
    expect(edm?.points).toBeGreaterThan(0);

    const min = await prisma.teamStandings.findFirst({
      where: { league: "NHL", team: "MIN" },
    });
    expect(min).toBeDefined();
    expect(min?.points).toBeGreaterThanOrEqual(30);
  });

  it("syncs live NFL standings from live ESPN API", async () => {
    const res = await syncLiveNflStandings();
    expect(res.count).toBe(32);

    const bills = await prisma.teamStandings.findFirst({
      where: { league: "NFL", team: "BUF" },
    });
    expect(bills).toBeDefined();
    expect(bills?.wins).toBeGreaterThanOrEqual(7);
  });

  it("syncs live injury reports and strictly preserves system invariants", async () => {
    const res = await syncLiveInjuries();
    expect(res.nhlCount + res.nflCount).toBeGreaterThan(0);

    // Invariant 1: Dak Prescott is ACTIVE on Dallas
    const dak = await prisma.teamRosterPlayer.findFirst({
      where: { league: "NFL", team: "DAL", name: { contains: "Prescott" } },
    });
    expect(dak).toBeDefined();
    expect(dak?.status).toBe("ACTIVE");

    // Invariant 2: A.J. Brown is OUT on Philadelphia
    const aj = await prisma.teamRosterPlayer.findFirst({
      where: { league: "NFL", team: "PHI", name: { contains: "A.J. Brown" } },
    });
    expect(aj).toBeDefined();
    expect(aj?.status).toBe("OUT");
  });
});
