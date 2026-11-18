import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateOffensiveTendencies } from "@/lib/nfl-analytics";
import { getProviderStatus } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const isPro = Boolean(user && (user.isProActive || user.role === "ADMIN"));

    const { searchParams } = new URL(req.url);
    const team = searchParams.get("team") || "Example Team A";
    const seasonParam = searchParams.get("season");
    const season = seasonParam ? Number(seasonParam) : 2025;
    const excludeSpecial = searchParams.get("excludeKneels") !== "false";

    let plays = (await prisma.nflPlay.findMany({
      where: {
        possessionTeam: team,
        season,
      },
    })) as any[];

    if (plays.length === 0) {
      plays = (await prisma.nflPlay.findMany({
        where: {
          possessionTeam: team,
        },
      })) as any[];
    }

    const tendencies = calculateOffensiveTendencies(plays, excludeSpecial);
    const provider = getProviderStatus().nflOffense;

    if (!isPro) {
      // FREE TIER
      return NextResponse.json({
        team,
        season,
        provider,
        userPlan: user?.plan || "FREE",
        isPro: false,
        totalPlays: plays.length,
        freeTier: {
          totalEligiblePlays: tendencies.totalEligiblePlays,
          overall: tendencies.overall,
          firstDown: tendencies.firstDown,
        },
        proTeasers: {
          downsLocked: ["2nd Down", "3rd Down", "4th Down"],
          distanceLocked: ["Short Yardage", "Medium Yardage", "Long Yardage"],
          redZoneLocked: true,
          gameStateLocked: true,
          situationalSearchLocked: true,
          opponentMatchupLocked: true,
        },
      });
    }

    // PRO TIER
    return NextResponse.json({
      team,
      season,
      provider,
      userPlan: "PRO",
      isPro: true,
      totalPlays: plays.length,
      tendencies,
    });
  } catch (error: any) {
    console.error("Offense fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch offensive tendencies" }, { status: 500 });
  }
}
