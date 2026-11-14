import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { filterPlaysByCategory, calculateBlitzEffectiveness } from "@/lib/nfl-analytics";
import { getProviderStatus } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isPro = Boolean(user && (user.isProActive || user.role === "ADMIN"));

    const { searchParams } = new URL(req.url);
    const team = searchParams.get("team") || "Example Team A";
    const season = searchParams.get("season") ? Number(searchParams.get("season")) : 2024;

    const plays = (await prisma.nflPlay.findMany({
      where: {
        defensiveTeam: team,
        season,
      },
    })) as any[];

    const categories = filterPlaysByCategory(plays);
    const effectiveness = calculateBlitzEffectiveness(plays);
    const provider = getProviderStatus().nflDefense;

    if (!isPro) {
      // FREE TIER: Free users get overall & 1st down defensive metrics
      return NextResponse.json({
        team,
        season,
        provider,
        userPlan: user?.plan || "FREE",
        isPro: false,
        totalPlays: plays.length,
        hasVerifiedBlitzData: categories.hasVerifiedData,
        unverifiedNotice: !categories.hasVerifiedData
          ? "Verified blitz data is unavailable for this game or situation."
          : null,
        freeTier: {
          overall: categories.overall,
          firstDown: categories.firstDown,
          totalVerifiedPlays: categories.totalVerifiedPlays,
        },
        proTeasers: {
          downsLocked: ["2nd Down", "3rd Down", "4th Down"],
          distanceLocked: ["Short Yardage (≤ 3y)", "Medium Yardage (4-7y)", "Long Yardage (≥ 8y)"],
          dangerZonesLocked: ["Red Zone (≤ 20y)", "Inside 10-Yard Line", "Goal Line (≤ 5y)", "Two-Minute Drill"],
          blitzEffectivenessLocked: true,
          situationalPredictorLocked: true,
        },
      });
    }

    // PRO TIER: Unlocked full intelligence
    return NextResponse.json({
      team,
      season,
      provider,
      userPlan: "PRO",
      isPro: true,
      totalPlays: plays.length,
      hasVerifiedBlitzData: categories.hasVerifiedData,
      unverifiedNotice: !categories.hasVerifiedData
        ? "Verified blitz data is unavailable for this game or situation."
        : null,
      categories,
      effectiveness,
    });
  } catch (error: any) {
    console.error("Defensive intelligence fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch NFL defensive data" }, { status: 500 });
  }
}
