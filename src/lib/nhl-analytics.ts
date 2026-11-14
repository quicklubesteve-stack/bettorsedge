export interface NhlPlayerRecord {
  id: string;
  playerId: string;
  name: string;
  team: string;
  position: "C" | "LW" | "RW" | "D" | "G" | string;
  unit: "PP1" | "PP2" | "PK1" | "PK2" | "INFERRED_PK" | string;
  unitStatus: "CONFIRMED" | "REPORTED" | "PROJECTED" | "INFERRED";
  ppTimeOnIcePerGame: number; // in minutes
  ppGoals: number;
  ppAssists: number;
  ppPoints: number;
  ppShots: number;
  ppShootingPct: number;
  shareTeamPpGoals: number; // percentage
  shareTeamPpPoints: number; // percentage
  shTimeOnIcePerGame: number; // in minutes
  shBlockedShots: number;
  shBlockedShotsPerMinute: number;
  isInjured: boolean;
  injuryNote?: string | null;
  source: string;
  lastUpdated: string;
}

export interface NhlTeamSpecialTeamsStats {
  id: string;
  team: string;
  season: string;
  gameType: string;
  ppOpportunities: number;
  ppGoals: number;
  ppPct: number;
  ppOpportunitiesPerGame: number;
  ppGoalsPerGame: number;
  homePpPct: number;
  awayPpPct: number;
  l5PpPct: number;
  l10PpPct: number;
  timesShorthanded: number;
  pkGoalsAllowed: number;
  pkPct: number;
  shGoalsScored: number;
  shShotsAllowed: number;
  shBlockedShots: number;
  shTimeOnIceSeconds: number;
  homePkPct: number;
  awayPkPct: number;
  l5PkPct: number;
  l10PkPct: number;
  dataProvider: string;
  lastUpdated: string;
}

export function calculatePowerPlayPct(ppGoals: number, ppOpportunities: number): number {
  if (ppOpportunities === 0) return 0.0;
  return Number(((ppGoals / ppOpportunities) * 100).toFixed(1));
}

export function calculatePenaltyKillPct(timesShorthanded: number, ppGoalsAllowed: number): number {
  if (timesShorthanded === 0) return 100.0;
  return Number((((timesShorthanded - ppGoalsAllowed) / timesShorthanded) * 100).toFixed(1));
}

export function calculatePlayerShares(
  players: NhlPlayerRecord[],
  teamPpGoals: number,
  teamPpPoints: number
): NhlPlayerRecord[] {
  return players.map((player) => {
    const shareTeamPpGoals =
      teamPpGoals > 0 ? Number(((player.ppGoals / teamPpGoals) * 100).toFixed(1)) : 0;
    const shareTeamPpPoints =
      teamPpPoints > 0 ? Number(((player.ppPoints / teamPpPoints) * 100).toFixed(1)) : 0;
    const ppShootingPct =
      player.ppShots > 0 ? Number(((player.ppGoals / player.ppShots) * 100).toFixed(1)) : 0;
    const totalShMinutes = player.shTimeOnIcePerGame * 20; // approximate season minutes
    const shBlockedShotsPerMinute =
      totalShMinutes > 0 ? Number((player.shBlockedShots / totalShMinutes).toFixed(3)) : 0;

    return {
      ...player,
      shareTeamPpGoals,
      shareTeamPpPoints,
      ppShootingPct,
      shBlockedShotsPerMinute,
    };
  });
}

export function filterPlayerScoringTable(
  players: NhlPlayerRecord[],
  filter: {
    unit?: string;
    position?: string;
    minShots?: number;
    sortBy?: "ppGoals" | "ppPoints" | "ppShots" | "shareTeamPpGoals";
  }
) {
  let list = [...players];

  if (filter.unit) {
    list = list.filter((p) => p.unit === filter.unit);
  }
  if (filter.position) {
    list = list.filter((p) => p.position === filter.position);
  }
  if (filter.minShots) {
    list = list.filter((p) => p.ppShots >= filter.minShots!);
  }

  const sortKey = filter.sortBy || "ppPoints";
  list.sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));

  return list;
}

export function analyzePkUnits(players: NhlPlayerRecord[]) {
  const pkPlayers = players.filter((p) => p.unit.includes("PK") || p.shTimeOnIcePerGame > 0.5);

  const forwards = pkPlayers
    .filter((p) => ["C", "LW", "RW", "F"].includes(p.position))
    .sort((a, b) => b.shTimeOnIcePerGame - a.shTimeOnIcePerGame);

  const defencemen = pkPlayers
    .filter((p) => p.position === "D")
    .sort((a, b) => b.shTimeOnIcePerGame - a.shTimeOnIcePerGame);

  // Group top pairs
  const topDpair = defencemen.slice(0, 2);
  const secondDpair = defencemen.slice(2, 4);
  const topFwdPair = forwards.slice(0, 2);
  const secondFwdPair = forwards.slice(2, 4);

  return {
    primaryForwards: forwards.slice(0, 4),
    primaryDefencemen: defencemen.slice(0, 4),
    topDpair,
    secondDpair,
    topFwdPair,
    secondFwdPair,
    injuredKillers: pkPlayers.filter((p) => p.isInjured),
  };
}

export function analyzeBlockedShots(
  players: NhlPlayerRecord[],
  teamTotalAllSituationBlockedShots: number
) {
  // Shorthanded blocked shots
  const shBlockedTotal = players.reduce((acc, p) => acc + p.shBlockedShots, 0);
  const defencemen = players.filter((p) => p.position === "D");
  const forwards = players.filter((p) => ["C", "LW", "RW", "F"].includes(p.position));

  const defencemenShBlocks = defencemen.reduce((acc, p) => acc + p.shBlockedShots, 0);
  const forwardsShBlocks = forwards.reduce((acc, p) => acc + p.shBlockedShots, 0);

  const topBlockers = [...players]
    .filter((p) => p.shBlockedShots > 0)
    .sort((a, b) => b.shBlockedShots - a.shBlockedShots)
    .slice(0, 5);

  return {
    allSituationBlockedShots: teamTotalAllSituationBlockedShots,
    shorthandedBlockedShots: shBlockedTotal,
    defencemenShorthandedBlocks: defencemenShBlocks,
    forwardsShorthandedBlocks: forwardsShBlocks,
    topShorthandedBlockers: topBlockers,
    methodologyNote:
      "All-situation blocked shots include 5-on-5 and 4-on-4 play. Shorthanded blocked shots exclusively reflect events occurring while team was killing penalties.",
  };
}

export function compareSpecialTeamsMatchup(
  ppTeamStats: NhlTeamSpecialTeamsStats,
  pkTeamStats: NhlTeamSpecialTeamsStats,
  ppPlayers: NhlPlayerRecord[],
  pkPlayers: NhlPlayerRecord[]
) {
  const topPpScorers = ppPlayers
    .filter((p) => p.unit === "PP1" || p.unit === "PP2")
    .sort((a, b) => b.ppGoals - a.ppGoals)
    .slice(0, 3);

  const topPkKillers = pkPlayers
    .filter((p) => p.unit === "PK1" || p.unit === "PK2" || p.shTimeOnIcePerGame > 1.0)
    .sort((a, b) => b.shTimeOnIcePerGame - a.shTimeOnIcePerGame)
    .slice(0, 4);

  const injuredPpStars = ppPlayers.filter((p) => p.isInjured && (p.unit === "PP1" || p.unit === "PP2"));
  const injuredPkKillers = pkPlayers.filter((p) => p.isInjured && (p.unit === "PK1" || p.unit === "PK2"));

  // Meaningful analysis text (no simplistic subtraction)
  const ppAdvantage =
    ppTeamStats.ppPct > 23.0 && pkTeamStats.pkPct < 78.0
      ? "Strong Edge: High-efficiency PP unit facing a bottom-quartile PK unit."
      : ppTeamStats.ppPct < 18.0 && pkTeamStats.pkPct > 82.0
      ? "Defensive Edge: Elite PK unit matches favorably against a struggling PP."
      : "Neutral / Competitive: Closely matched special-teams rates.";

  return {
    powerPlayTeam: ppTeamStats.team,
    penaltyKillTeam: pkTeamStats.team,
    powerPlayPercentage: ppTeamStats.ppPct,
    powerPlayOpportunitiesPerGame: ppTeamStats.ppOpportunitiesPerGame,
    powerPlayGoalsPerGame: ppTeamStats.ppGoalsPerGame,
    homeOrAwayPpPct: ppTeamStats.awayPpPct, // context
    l5PpPct: ppTeamStats.l5PpPct,
    penaltyKillPercentage: pkTeamStats.pkPct,
    timesShorthandedPerGame: Number((pkTeamStats.timesShorthanded / 20).toFixed(1)),
    shGoalsAllowed: pkTeamStats.pkGoalsAllowed,
    shShotsAllowed: pkTeamStats.shShotsAllowed,
    l5PkPct: pkTeamStats.l5PkPct,
    topPpScorers,
    topPkKillers,
    injuredPpStars,
    injuredPkKillers,
    tacticalSummary: ppAdvantage,
    disclaimer:
      "Important: Special teams match-ups should not be evaluated by naive rate subtraction (PP% - PK%). Goal scoring probability depends on penalty drawing rate, referee tendencies, goaltender save percentage on high-danger unblocked attempts, and key player absences.",
  };
}
