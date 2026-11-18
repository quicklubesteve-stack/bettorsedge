import { describe, it, expect } from "vitest";
import { prisma } from "../src/lib/db";

describe("Live Standings & Playoff Picture (NFL & NHL 2025–2026 as of Nov 18, 2025)", () => {
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

  it("verifies official 2025-2026 NFL records as of November 18, 2025", async () => {
    const patriots = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "NE" } });
    expect(patriots?.wins).toBe(9);
    expect(patriots?.losses).toBe(2);

    const broncos = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "DEN" } });
    expect(broncos?.wins).toBe(9);
    expect(broncos?.losses).toBe(2);

    const colts = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "IND" } });
    expect(colts?.wins).toBe(8);
    expect(colts?.losses).toBe(2);

    const eagles = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "PHI" } });
    expect(eagles?.wins).toBe(8);
    expect(eagles?.losses).toBe(2);

    const rams = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "LAR" } });
    expect(rams?.wins).toBe(8);
    expect(rams?.losses).toBe(2);

    const bears = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "CHI" } });
    expect(bears?.wins).toBe(7);
    expect(bears?.losses).toBe(3);

    const chiefs = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "KC" } });
    expect(chiefs?.wins).toBe(5);
    expect(chiefs?.losses).toBe(5);

    const packers = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "GB" } });
    expect(packers?.wins).toBe(6);
    expect(packers?.losses).toBe(3);
    expect(packers?.ties).toBe(1);

    const cowboys = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "DAL" } });
    expect(cowboys?.wins).toBe(4);
    expect(cowboys?.losses).toBe(5);
    expect(cowboys?.ties).toBe(1);
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

  it("assigns valid playoff seeding to 2025-2026 contenders as of November 18, 2025", async () => {
    const afcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "AFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(afcSeeds.length).toBe(7);
    expect(afcSeeds[0].team).toBe("DEN"); // Seed 1
    expect(afcSeeds[1].team).toBe("NE");  // Seed 2
    expect(afcSeeds[2].team).toBe("IND"); // Seed 3
    expect(afcSeeds[3].team).toBe("PIT"); // Seed 4
    expect(afcSeeds[4].team).toBe("BUF"); // Seed 5
    expect(afcSeeds[5].team).toBe("LAC"); // Seed 6
    expect(afcSeeds[6].team).toBe("JAX"); // Seed 7

    const nfcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "NFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(nfcSeeds.length).toBe(7);
    expect(nfcSeeds[0].team).toBe("LAR"); // Seed 1
    expect(nfcSeeds[1].team).toBe("PHI"); // Seed 2
    expect(nfcSeeds[2].team).toBe("CHI"); // Seed 3
    expect(nfcSeeds[3].team).toBe("TB");  // Seed 4
    expect(nfcSeeds[4].team).toBe("SEA"); // Seed 5
    expect(nfcSeeds[5].team).toBe("GB");  // Seed 6
    expect(nfcSeeds[6].team).toBe("SF");  // Seed 7

    const eastNhlSeeds = await prisma.teamStandings.findMany({
      where: { league: "NHL", conference: "Eastern", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(eastNhlSeeds.length).toBe(8);
  });
});
