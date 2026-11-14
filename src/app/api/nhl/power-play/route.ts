import { NextRequest, NextResponse } from "next/server";
import { requirePro } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculatePlayerShares, filterPlayerScoringTable } from "@/lib/nhl-analytics";
import { getProviderStatus } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    await requirePro();
    const { searchParams } = new URL(req.url);
    const team = searchParams.get("team") || "EDM";
    const sortBy = (searchParams.get("sortBy") as any) || "ppPoints";

    const [teamStats, rawPlayers] = await Promise.all([
      prisma.nhlSpecialTeamsTeamStats.findFirst({
        where: { team },
      }),
      prisma.nhlSpecialTeamsPlayer.findMany({
        where: { team },
      }),
    ]);

    const stats = teamStats || {
      id: "fallback",
      team,
      season: "2024-2025",
      gameType: "REGULAR",
      ppOpportunities: 45,
      ppGoals: 13,
      ppPct: 28.9,
      ppOpportunitiesPerGame: 3.2,
      ppGoalsPerGame: 0.9,
      homePpPct: 31.2,
      awayPpPct: 26.5,
      l5PpPct: 33.3,
      l10PpPct: 29.0,
      timesShorthanded: 40,
      pkGoalsAllowed: 8,
      pkPct: 80.0,
      shGoalsScored: 2,
      shShotsAllowed: 65,
      shBlockedShots: 22,
      shTimeOnIceSeconds: 4800,
      homePkPct: 82.0,
      awayPkPct: 77.8,
      l5PkPct: 80.0,
      l10PkPct: 80.0,
      dataProvider: "MOCK_FIXTURE",
      lastUpdated: new Date().toISOString(),
    };

    const teamPpGoals = stats.ppGoals || 1;
    const teamPpPoints = (stats.ppGoals * 2) || 2; // goals + assists approximate
    const playersWithShares = calculatePlayerShares(rawPlayers as any, teamPpGoals, teamPpPoints);

    const pp1 = playersWithShares.filter((p) => p.unit === "PP1");
    const pp2 = playersWithShares.filter((p) => p.unit === "PP2");
    const scoringTable = filterPlayerScoringTable(playersWithShares, { sortBy });
    const provider = getProviderStatus().nhlPowerPlay;

    return NextResponse.json({
      team,
      provider,
      teamStats: stats,
      pp1,
      pp2,
      scoringTable,
    });
  } catch (error: any) {
    if (error.message === "PRO_REQUIRED") {
      return NextResponse.json(
        { error: "SportsEdge AI Pro membership required to view NHL Power-Play Intelligence." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch NHL power-play data" }, { status: 500 });
  }
}
