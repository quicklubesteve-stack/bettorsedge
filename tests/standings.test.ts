import { describe, it, expect } from "vitest";
import { prisma } from "../src/lib/db";

describe("Live Standings & Playoff Picture (2026 NFL.com Division Standings)", () => {
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
      expect(team.streak).toMatch(/^[WL]\d+$/);
      expect(team.homeRecord).toMatch(/^\d+-\d+(-\d+)?$/);
      expect(team.awayRecord).toMatch(/^\d+-\d+(-\d+)?$/);
    }
  });

  it("verifies official records matching 2026 NFL.com division standings", async () => {
    const bills = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "BUF" } });
    expect(bills?.wins).toBe(8);
    expect(bills?.losses).toBe(1);

    const niners = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "SF" } });
    expect(niners?.wins).toBe(8);
    expect(niners?.losses).toBe(1);

    const jags = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "JAX" } });
    expect(jags?.wins).toBe(7);
    expect(jags?.losses).toBe(2);

    const bengals = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "CIN" } });
    expect(bengals?.wins).toBe(7);
    expect(bengals?.losses).toBe(2);

    const chiefs = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "KC" } });
    expect(chiefs?.wins).toBe(7);
    expect(chiefs?.losses).toBe(2);

    const broncos = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "DEN" } });
    expect(broncos?.wins).toBe(7);
    expect(broncos?.losses).toBe(2);

    const lions = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "DET" } });
    expect(lions?.wins).toBe(7);
    expect(lions?.losses).toBe(2);

    const giants = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "NYG" } });
    expect(giants?.wins).toBe(5);
    expect(giants?.losses).toBe(3);
    expect(giants?.ties).toBe(1);

    const commanders = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "WAS" } });
    expect(commanders?.wins).toBe(3);
    expect(commanders?.losses).toBe(5);
    expect(commanders?.ties).toBe(1);

    const eagles = await prisma.teamStandings.findFirst({ where: { league: "NFL", team: "PHI" } });
    expect(eagles?.wins).toBe(2);
    expect(eagles?.losses).toBe(7);
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

  it("verifies official records matching 2026-11-18 NHL.com division standings", async () => {
    const edm = await prisma.teamStandings.findFirst({ where: { league: "NHL", team: "EDM" } });
    expect(edm?.points).toBe(37);
    expect(edm?.wins).toBe(17);
    expect(edm?.losses).toBe(3);
    expect(edm?.otLosses).toBe(3);
    expect(edm?.playoffSeed).toBe(1);

    const min = await prisma.teamStandings.findFirst({ where: { league: "NHL", team: "MIN" } });
    expect(min?.points).toBe(36);
    expect(min?.wins).toBe(16);
    expect(min?.losses).toBe(3);
    expect(min?.otLosses).toBe(4);
    expect(min?.playoffSeed).toBe(2);

    const vgk = await prisma.teamStandings.findFirst({ where: { league: "NHL", team: "VGK" } });
    expect(vgk?.points).toBe(30);
    expect(vgk?.wins).toBe(13);
    expect(vgk?.losses).toBe(6);
    expect(vgk?.otLosses).toBe(4);

    const car = await prisma.teamStandings.findFirst({ where: { league: "NHL", team: "CAR" } });
    expect(car?.points).toBe(34);
    expect(car?.wins).toBe(16);
    expect(car?.losses).toBe(3);
    expect(car?.otLosses).toBe(2);
    expect(car?.playoffSeed).toBe(1);

    const tbl = await prisma.teamStandings.findFirst({ where: { league: "NHL", team: "TBL" } });
    expect(tbl?.points).toBe(30);
    expect(tbl?.wins).toBe(14);
    expect(tbl?.losses).toBe(5);
    expect(tbl?.otLosses).toBe(2);
    expect(tbl?.playoffSeed).toBe(2);

    const tor = await prisma.teamStandings.findFirst({ where: { league: "NHL", team: "TOR" } });
    expect(tor?.points).toBe(18);
    expect(tor?.wins).toBe(8);
    expect(tor?.losses).toBe(13);
    expect(tor?.otLosses).toBe(2);
    expect(tor?.streak).toBe("L7");
    expect(tor?.playoffSeed).toBeNull();
  });

  it("assigns valid playoff seeding according to official NFL.com order", async () => {
    const afcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "AFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(afcSeeds.length).toBe(7);
    expect(afcSeeds[0].team).toBe("BUF"); // Seed 1
    expect(afcSeeds[1].team).toBe("JAX"); // Seed 2
    expect(afcSeeds[2].team).toBe("CIN"); // Seed 3
    expect(afcSeeds[3].team).toBe("KC");  // Seed 4
    expect(afcSeeds[4].team).toBe("DEN"); // Seed 5
    expect(afcSeeds[5].team).toBe("PIT"); // Seed 6
    expect(afcSeeds[6].team).toBe("CLE"); // Seed 7

    const nfcSeeds = await prisma.teamStandings.findMany({
      where: { league: "NFL", conference: "NFC", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(nfcSeeds.length).toBe(7);
    expect(nfcSeeds[0].team).toBe("SF");  // Seed 1
    expect(nfcSeeds[1].team).toBe("DET"); // Seed 2
    expect(nfcSeeds[2].team).toBe("NYG"); // Seed 3
    expect(nfcSeeds[3].team).toBe("CAR"); // Seed 4
    expect(nfcSeeds[4].team).toBe("CHI"); // Seed 5
    expect(nfcSeeds[5].team).toBe("MIN"); // Seed 6
    expect(nfcSeeds[6].team).toBe("LAR"); // Seed 7

    const eastNhlSeeds = await prisma.teamStandings.findMany({
      where: { league: "NHL", conference: "Eastern", playoffSeed: { not: null } },
      orderBy: { playoffSeed: "asc" },
    });
    expect(eastNhlSeeds.length).toBe(8);
  });
});
