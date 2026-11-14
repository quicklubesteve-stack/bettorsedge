import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { analyzePkUnits, analyzeBlockedShots } from "@/lib/nhl-analytics";
import { getProviderStatus } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isPro = Boolean(user && (user.isProActive || user.role === "ADMIN"));

    const { searchParams } = new URL(req.url);
    const team = searchParams.get("team") || "TOR";

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

    const provider = getProviderStatus().nhlPenaltyKill;

    if (!isPro) {
      // FREE TIER
      return NextResponse.json({
        team,
        provider,
        userPlan: user?.plan || "FREE",
        isPro: false,
        teamStats: stats,
        freeTier: {
          allSituationBlockedShots: 140,
        },
        proTeasers: {
          pkPairsLocked: true,
          shorthandedTOILocked: true,
          verifiedShorthandedBlockedShotsLocked: true,
          matchupEngineLocked: true,
        },
      });
    }

    // PRO TIER
    const pkUnits = analyzePkUnits(rawPlayers as any);
    const blockedShots = analyzeBlockedShots(rawPlayers as any, 140);

    return NextResponse.json({
      team,
      provider,
      userPlan: "PRO",
      isPro: true,
      teamStats: stats,
      pkUnits,
      blockedShots,
    });
  } catch (error: any) {
    console.error("NHL penalty-kill fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch NHL penalty-kill data" }, { status: 500 });
  }
}
