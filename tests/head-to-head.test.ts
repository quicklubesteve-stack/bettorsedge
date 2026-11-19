import { describe, it, expect } from "vitest";
import { getHeadToHeadHistory } from "../src/lib/head-to-head";

describe("Head-to-Head Matchup History Engine", () => {
  it("provides authentic H2H history between Buffalo Bills and Kansas City Chiefs", () => {
    const h2h = getHeadToHeadHistory("NFL", "BUF", "KC");

    expect(h2h).toBeDefined();
    expect(h2h.league).toBe("NFL");
    expect(h2h.teamA.abbr).toBe("BUF");
    expect(h2h.teamB.abbr).toBe("KC");
    expect(h2h.totalMeetings).toBeGreaterThanOrEqual(5);

    // Verify points and averages
    expect(h2h.avgPointsTeamA).toBeGreaterThan(15);
    expect(h2h.avgPointsTeamB).toBeGreaterThan(15);
    expect(h2h.seriesRecord).toBeDefined();

    // Verify Last Win for both teams
    expect(h2h.lastWinTeamA).toBeDefined();
    expect(h2h.lastWinTeamA?.team).toBe("BUF");
    expect(h2h.lastWinTeamA?.date).toBe("Nov 17, 2024");
    expect(h2h.lastWinTeamA?.score).toBe("BUF 30, KC 21");

    expect(h2h.lastWinTeamB).toBeDefined();
    expect(h2h.lastWinTeamB?.team).toBe("KC");
    expect(h2h.lastWinTeamB?.date).toBe("Jan 21, 2024");
    expect(h2h.lastWinTeamB?.score).toBe("KC 27, BUF 24");

    // Verify past meetings list
    expect(h2h.pastMeetings.length).toBeGreaterThanOrEqual(5);
    const firstMeeting = h2h.pastMeetings[0];
    expect(firstMeeting.date).toBe("Nov 17, 2024");
    expect(firstMeeting.winner).toBe("BUF");
    expect(firstMeeting.teamAScore).toBe(30);
    expect(firstMeeting.teamBScore).toBe(21);
    expect(firstMeeting.totalPoints).toBe(51);
  });

  it("provides authentic H2H history for Baltimore Ravens vs Pittsburgh Steelers", () => {
    const h2h = getHeadToHeadHistory("NFL", "BAL", "PIT");

    expect(h2h.league).toBe("NFL");
    expect(h2h.lastWinTeamA?.team).toBe("BAL");
    expect(h2h.lastWinTeamB?.team).toBe("PIT");
    expect(h2h.lastWinTeamB?.date).toBe("Nov 17, 2024");
    expect(h2h.lastWinTeamB?.score).toBe("PIT 18, BAL 16");

    expect(h2h.pastMeetings.length).toBeGreaterThanOrEqual(5);
  });

  it("provides authentic H2H history for NHL Vegas Golden Knights vs Toronto Maple Leafs", () => {
    const h2h = getHeadToHeadHistory("NHL", "VGK", "TOR");

    expect(h2h.league).toBe("NHL");
    expect(h2h.totalMeetings).toBeGreaterThanOrEqual(6);

    // Verify Last Win for VGK and TOR
    expect(h2h.lastWinTeamA?.team).toBe("VGK");
    expect(h2h.lastWinTeamA?.score).toBe("VGK 6, TOR 2");
    expect(h2h.lastWinTeamB?.team).toBe("TOR");
    expect(h2h.lastWinTeamB?.score).toBe("TOR 7, VGK 3");

    // Verify goals averages
    expect(h2h.avgPointsTeamA).toBeGreaterThan(2);
    expect(h2h.avgPointsTeamB).toBeGreaterThan(2);
  });

  it("provides authentic H2H history for Edmonton Oilers vs Vegas Golden Knights", () => {
    const h2h = getHeadToHeadHistory("NHL", "EDM", "VGK");

    expect(h2h.league).toBe("NHL");
    expect(h2h.lastWinTeamA?.team).toBe("EDM");
    expect(h2h.lastWinTeamB?.team).toBe("VGK");
    expect(h2h.lastWinTeamB?.date).toBe("Nov 6, 2024");
    expect(h2h.lastWinTeamB?.score).toBe("VGK 4, EDM 2");
  });

  it("generates deterministic realistic fallback for any two teams", () => {
    const h2h = getHeadToHeadHistory("NFL", "GB", "CHI");

    expect(h2h.league).toBe("NFL");
    expect(h2h.totalMeetings).toBe(6);
    expect(h2h.pastMeetings.length).toBe(6);
    expect(h2h.lastWinTeamA).toBeDefined();
    expect(h2h.lastWinTeamB).toBeDefined();
    expect(h2h.overUnderTrend).toBeDefined();
    expect(h2h.atsTrend).toBeDefined();
  });
});
