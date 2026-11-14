import { describe, it, expect } from "vitest";
import { NFL_ALL_TEAMS, NHL_ALL_TEAMS } from "../src/lib/teams";
import { prisma } from "../src/lib/db";

describe("All Sports Teams Stats & Rankings Coverage", () => {
  it("defines all 32 NFL teams with unique abbreviations", () => {
    expect(NFL_ALL_TEAMS).toHaveLength(32);
    const abbrs = new Set(NFL_ALL_TEAMS.map((t) => t.abbr));
    expect(abbrs.size).toBe(32);

    const afcTeams = NFL_ALL_TEAMS.filter((t) => t.conference === "AFC");
    const nfcTeams = NFL_ALL_TEAMS.filter((t) => t.conference === "NFC");
    expect(afcTeams).toHaveLength(16);
    expect(nfcTeams).toHaveLength(16);
  });

  it("defines all 32 NHL teams with unique abbreviations", () => {
    expect(NHL_ALL_TEAMS).toHaveLength(32);
    const abbrs = new Set(NHL_ALL_TEAMS.map((t) => t.abbr));
    expect(abbrs.size).toBe(32);

    const eastTeams = NHL_ALL_TEAMS.filter((t) => t.conference === "Eastern");
    const westTeams = NHL_ALL_TEAMS.filter((t) => t.conference === "Western");
    expect(eastTeams).toHaveLength(16);
    expect(westTeams).toHaveLength(16);
  });

  it("seeded database contains plays across multiple NFL franchises", async () => {
    const playCount = await prisma.nflPlay.count();
    expect(playCount).toBeGreaterThanOrEqual(100);

    const distinctDefenses = await prisma.nflPlay.findMany({
      select: { defensiveTeam: true },
      distinct: ["defensiveTeam"],
    });
    expect(distinctDefenses.length).toBeGreaterThan(1);
  });

  it("seeded database contains stats across all 32 NHL teams", async () => {
    const nhlTeamCount = await prisma.nhlSpecialTeamsTeamStats.count();
    expect(nhlTeamCount).toBeGreaterThanOrEqual(32);
  });
});
