import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculatePlayerShares, filterPlayerScoringTable } from "@/lib/nhl-analytics";
import { getProviderStatus } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isPro = Boolean(user && (user.isProActive || user.role === "ADMIN"));

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
    const teamPpPoints = stats.ppGoals * 2 || 2;
    const playersWithShares = calculatePlayerShares(rawPlayers as any, teamPpGoals, teamPpPoints);
    const provider = getProviderStatus().nhlPowerPlay;

    if (!isPro) {
      // FREE TIER
      return NextResponse.json({
        team,
        provider,
        userPlan: user?.plan || "FREE",
        isPro: false,
        teamStats: stats,
        freeTierPreview: {
          topScorersOverview: playersWithShares.slice(0, 3).map((p) => ({
            name: p.name,
            position: p.position,
            ppGoals: p.ppGoals,
            ppPoints: p.ppPoints,
          })),
        },
        proTeasers: {
          pp1UnitsLocked: true,
          pp2UnitsLocked: true,
          goalShareAttributionLocked: true,
          iceTimeDistributionLocked: true,
          scoringTableLocked: true,
        },
      });
    }

    // PRO TIER
    const pp1 = playersWithShares.filter((p) => p.unit === "PP1");
    const pp2 = playersWithShares.filter((p) => p.unit === "PP2");
    const scoringTable = filterPlayerScoringTable(playersWithShares, { sortBy });

    return NextResponse.json({
      team,
      provider,
      userPlan: "PRO",
      isPro: true,
      teamStats: stats,
      pp1,
      pp2,
      scoringTable,
    });
  } catch (error: any) {
    console.error("NHL power-play fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch NHL power-play data" }, { status: 500 });
  }
}
