import { describe, it, expect } from "vitest";
import { prisma } from "../src/lib/db";

describe("Live Standings & Playoff Picture (NFL & NHL)", () => {
  it("contains complete 32-team standings for the NFL", async () => {
    const nflStandings = await prisma.teamStandings.findMany({
      where: { league: "NFL" },
    });
    expect(nflStandings).toHaveLength(32);

    const afc = nflStandings.filter((t) => t.conference === "AFC");
    const nfc = nflStandings.filter((t) => t.conference === "NFC");
    expect(afc).toHaveLength(16);
    expect(nfc).toHaveLength(16);

    for (const team of nflStandings) {
      expect(team.wins).toBeGreaterThanOrEqual(0);
      expect(team.losses).toBeGreaterThanOrEqual(0);
      expect(team.winPct).toBeGreaterThanOrEqual(0);
      expect(team.streak).toMatch(/^(W|L|T)\d+$/);
      expect(team.homeRecord).toMatch(/^\d+-\d+(-\d+)?$/);
      expect(team.awayRecord).toMatch(/^\d+-\d+(-\d+)?$/);
    }
  });

  it("contains complete 32-team standings for the NHL", async () => {
    const nhlStandings = await prisma.teamStandings.findMany({
      where: { league: "NHL" },
    });
    expect(nhlStandings).toHaveLength(32);

    const east = nhlStandings.filter((t) => t.conference === "Eastern");
    const west = nhlStandings.filter((t) => t.conference === "Western");
    expect(east).toHaveLength(16);
    expect(west).toHaveLength(16);

    for (const team of nhlStandings) {
      expect(team.gamesPlayed).toBeGreaterThanOrEqual(10);
      expect(team.points).toBeGreaterThan(0);
      expect(team.regulationWins).toBeGreaterThanOrEqual(0);
      expect(team.goalsFor).toBeGreaterThan(0);
      expect(team.goalsAgainst).toBeGreaterThan(0);
    }
  });

  it("assigns valid playoff seeding to top contenders", async () => {
    const afcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "AFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(afcSeeds.length).toBe(7);
    expect(afcSeeds[0].playoffSeed).toBe(1);
    expect(afcSeeds[6].playoffSeed).toBe(7);

    const nfcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "NFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(nfcSeeds.length).toBe(7);

    const eastNhlSeeds = await prisma.teamStandings.findMany({
      where: { league: "NHL", conference: "Eastern", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(eastNhlSeeds.length).toBe(8);
  });
});
