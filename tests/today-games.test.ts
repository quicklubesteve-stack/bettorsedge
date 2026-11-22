import { describe, it, expect } from "vitest";
import {
  getTorontoDate,
  getGameDateInToronto,
  formatGameTimeToronto,
  getGameStatus,
  calculateNflWinProbability,
  calculateNhlWinProbability,
} from "../src/lib/win-probability-engine";
import { getTodayGames } from "../src/lib/today-games-service";

describe("Today's Games & AI Win Probability Engine", () => {
  it("accurately determines date and formats in America/Toronto time zone", () => {
    const torontoDate = getTorontoDate();
    expect(torontoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const testGameDate = new Date("2026-11-21T23:00:00Z"); // 6:00 PM EST
    const dateStr = getGameDateInToronto(testGameDate);
    expect(dateStr).toBe("2026-11-21");

    const formatted = formatGameTimeToronto(testGameDate);
    expect(formatted).toContain("ET");
    expect(formatted).toContain("Nov 21");
  });

  it("calculates accurate game status (SCHEDULED, LIVE, FINAL)", () => {
    const now = new Date("2026-11-21T20:00:00Z");

    const futureGame = new Date("2026-11-21T23:00:00Z");
    expect(getGameStatus(futureGame, now)).toBe("SCHEDULED");

    const liveGame = new Date("2026-11-21T19:30:00Z");
    expect(getGameStatus(liveGame, now)).toBe("LIVE");

    const pastGame = new Date("2026-11-21T14:00:00Z");
    expect(getGameStatus(pastGame, now)).toBe("FINAL");
  });

  it("NFL Win Probability Engine incorporates records, QBs, injuries, and home field", () => {
    const analysis = calculateNflWinProbability({
      gameId: "TEST-NFL-DAL-CAR",
      gameDate: new Date("2026-11-22T18:00:00Z"),
      homeTeam: "CAR",
      awayTeam: "DAL",
      homeTeamName: "Carolina Panthers",
      awayTeamName: "Dallas Cowboys",
      homeRecord: { wins: 3, losses: 7, winPct: 0.3, streak: "L2" },
      awayRecord: { wins: 4, losses: 6, winPct: 0.4, streak: "W1" },
      homeMoneyline: 215,
      awayMoneyline: -260,
      spread: -6.5,
      spreadFavorite: "AWAY",
      overUnder: 44.5,
    });

    expect(analysis.league).toBe("NFL");
    expect(analysis.homeWinProbability + analysis.awayWinProbability).toBeCloseTo(100.0, 1);
    expect(analysis.predictedWinner).toBe("DAL");
    expect(analysis.predictedScore).toMatch(/^\d+\s*-\s*\d+$/);
    expect(["HIGH", "MODERATE", "LEAN"]).toContain(analysis.confidence);
    expect(analysis.dataQuality).toBe("VERIFIED_OFFICIAL");
    expect(analysis.qbMatchup?.awayQb.name).toBe("Dak Prescott");
    expect(analysis.qbMatchup?.awayQb.status).toBe("ACTIVE");
    expect(analysis.factors.length).toBeGreaterThanOrEqual(3);
  });

  it("verifies A.J. Brown injury impact penalty on Philadelphia", () => {
    const analysis = calculateNflWinProbability({
      gameId: "TEST-NFL-PHI-WAS",
      gameDate: new Date("2026-11-23T01:15:00Z"),
      homeTeam: "PHI",
      awayTeam: "WAS",
      homeTeamName: "Philadelphia Eagles",
      awayTeamName: "Washington Commanders",
      homeRecord: { wins: 8, losses: 2, winPct: 0.8 },
      awayRecord: { wins: 7, losses: 4, winPct: 0.636 },
      homeInjuries: [
        { name: "A.J. Brown", position: "WR", status: "OUT", isKeyPlayer: true, details: "Hamstring/Knee" },
      ],
    });

    const injFactor = analysis.factors.find((f) => f.name.includes("Injury"));
    expect(injFactor).toBeDefined();
    expect(analysis.injuryImpact.keyInjuries.some((k) => k.player === "A.J. Brown" && k.status === "OUT")).toBe(true);
  });

  it("NHL Win Probability Engine accounts for starting goaltenders, PP/PK, and injuries", () => {
    const analysis = calculateNhlWinProbability({
      gameId: "TEST-NHL-VGK-TOR",
      gameDate: new Date("2026-11-21T23:00:00Z"),
      homeTeam: "TOR",
      awayTeam: "VGK",
      homeTeamName: "Toronto Maple Leafs",
      awayTeamName: "Vegas Golden Knights",
      homeRecord: { wins: 11, losses: 6, otLosses: 2, winPct: 0.632, points: 24 },
      awayRecord: { wins: 14, losses: 5, otLosses: 2, winPct: 0.714, points: 30 },
      homeInjuries: [
        { name: "Auston Matthews", position: "C", status: "OUT", isKeyPlayer: true, details: "Upper Body" },
      ],
      homeMoneyline: 110,
      awayMoneyline: -130,
      overUnder: 6.5,
    });

    expect(analysis.league).toBe("NHL");
    expect(analysis.homeWinProbability + analysis.awayWinProbability).toBeCloseTo(100.0, 1);
    expect(analysis.goaltenderMatchup).toBeDefined();
    expect(analysis.goaltenderMatchup?.homeGoalie.name).toBe("Joseph Woll");
    expect(analysis.goaltenderMatchup?.awayGoalie.name).toBe("Adin Hill");
    expect(analysis.specialTeams).toBeDefined();
    expect(analysis.injuryImpact.keyInjuries.some((k) => k.player === "Auston Matthews" && k.status === "OUT")).toBe(true);
  });

  it("getTodayGames fetches today's games or gracefully falls back to next upcoming slate", async () => {
    // Test on reference date Nov 21, 2026 (Saturday)
    const refDate = new Date("2026-11-21T20:00:00Z");
    const result = await getTodayGames("ALL", refDate);

    expect(result.todayDateToronto).toBe("2026-11-21");
    expect(result.games.length).toBeGreaterThan(0);

    // Verify chronological ordering
    for (let i = 0; i < result.games.length - 1; i++) {
      const t1 = new Date(result.games[i].gameDate).getTime();
      const t2 = new Date(result.games[i + 1].gameDate).getTime();
      expect(t1).toBeLessThanOrEqual(t2);
    }

    // Verify each game has team brand, win probability summing to 100%, and status
    for (const g of result.games) {
      expect(g.homeBrand.primaryColor).toBeTruthy();
      expect(g.awayBrand.primaryColor).toBeTruthy();
      expect(g.homeWinProbability).toBeGreaterThan(0);
      expect(g.awayWinProbability).toBeGreaterThan(0);
      expect(Math.round(g.homeWinProbability + g.awayWinProbability)).toBe(100);
      expect(g.predictedWinner).toBeTruthy();
      expect(["SCHEDULED", "LIVE", "FINAL"]).toContain(g.gameStatus);
      expect(g.injuryImpact).toBeDefined();
    }
  });

  it("handles empty day for NFL on Saturday by displaying next upcoming Sunday slate", async () => {
    const refSaturday = new Date("2026-11-21T18:00:00Z");
    const nflResult = await getTodayGames("NFL", refSaturday);

    expect(nflResult.league).toBe("NFL");
    expect(nflResult.isUpcomingOnly).toBe(true);
    expect(nflResult.effectiveDate).toBe("2026-11-22");
    expect(nflResult.statusMessage).toContain("Sunday");
    expect(nflResult.games.length).toBeGreaterThanOrEqual(5);

    // Confirm Dallas game has Dak Prescott active
    const dalGame = nflResult.games.find((g) => g.awayTeam === "DAL" || g.homeTeam === "DAL");
    expect(dalGame).toBeDefined();
    const dalQb = dalGame?.homeTeam === "DAL" ? dalGame?.qbMatchup?.homeQb : dalGame?.qbMatchup?.awayQb;
    expect(dalQb?.name).toBe("Dak Prescott");
    expect(dalQb?.status).toBe("ACTIVE");
  });
});
