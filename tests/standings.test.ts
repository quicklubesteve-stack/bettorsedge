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

  it("verifies official Week 11 records from NFL.com", async () => {
    const chiefs = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "KC" } });
    expect(chiefs?.wins).toBe(9);
    expect(chiefs?.losses).toBe(1);

    const lions = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "DET" } });
    expect(lions?.wins).toBe(9);
    expect(lions?.losses).toBe(1);

    const bills = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "BUF" } });
    expect(bills?.wins).toBe(9);
    expect(bills?.losses).toBe(2);

    const eagles = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "PHI" } });
    expect(eagles?.wins).toBe(8);
    expect(eagles?.losses).toBe(2);

    const steelers = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "PIT" } });
    expect(steelers?.wins).toBe(8);
    expect(steelers?.losses).toBe(2);

    const vikings = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "MIN" } });
    expect(vikings?.wins).toBe(8);
    expect(vikings?.losses).toBe(2);

    const texans = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "HOU" } });
    expect(texans?.wins).toBe(7);
    expect(texans?.losses).toBe(4);

    const cardinals = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "ARI" } });
    expect(cardinals?.wins).toBe(6);
    expect(cardinals?.losses).toBe(4);

    // NFC West 5-5 tiebreakers
    const rams = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "LAR" } });
    const seahawks = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "SEA" } });
    const niners = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "SF" } });
    expect(rams?.wins).toBe(5);
    expect(rams?.losses).toBe(5);
    expect(seahawks?.wins).toBe(5);
    expect(seahawks?.losses).toBe(5);
    expect(niners?.wins).toBe(5);
    expect(niners?.losses).toBe(5);
    expect(rams?.rankDivision).toBe(2);
    expect(seahawks?.rankDivision).toBe(3);
    expect(niners?.rankDivision).toBe(4);
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

  it("assigns valid playoff seeding to top contenders matching NFL.com", async () => {
    const afcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "AFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(afcSeeds.length).toBe(7);
    expect(afcSeeds[0].team).toBe("KC");  // Seed 1
    expect(afcSeeds[1].team).toBe("BUF"); // Seed 2
    expect(afcSeeds[2].team).toBe("PIT"); // Seed 3
    expect(afcSeeds[3].team).toBe("HOU"); // Seed 4
    expect(afcSeeds[4].team).toBe("LAC"); // Seed 5
    expect(afcSeeds[5].team).toBe("BAL"); // Seed 6
    expect(afcSeeds[6].team).toBe("DEN"); // Seed 7

    const nfcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "NFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(nfcSeeds.length).toBe(7);
    expect(nfcSeeds[0].team).toBe("DET"); // Seed 1
    expect(nfcSeeds[1].team).toBe("PHI"); // Seed 2
    expect(nfcSeeds[2].team).toBe("ARI"); // Seed 3
    expect(nfcSeeds[3].team).toBe("ATL"); // Seed 4
    expect(nfcSeeds[4].team).toBe("MIN"); // Seed 5
    expect(nfcSeeds[5].team).toBe("GB");  // Seed 6
    expect(nfcSeeds[6].team).toBe("WAS"); // Seed 7

    const eastNhlSeeds = await prisma.teamStandings.findMany({
      where: { league: "NHL", conference: "Eastern", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(eastNhlSeeds.length).toBe(8);
  });
});
