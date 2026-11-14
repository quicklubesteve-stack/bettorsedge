import { NextRequest, NextResponse } from "next/server";
import { requirePro } from "@/lib/auth";
import prisma from "@/lib/db";
import { filterPlaysByCategory, calculateBlitzEffectiveness } from "@/lib/nfl-analytics";
import { getProviderStatus } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    await requirePro();

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

    return NextResponse.json({
      team,
      season,
      provider,
      totalPlays: plays.length,
      hasVerifiedBlitzData: categories.hasVerifiedData,
      unverifiedNotice: !categories.hasVerifiedData
        ? "Verified blitz data is unavailable for this game or situation."
        : null,
      categories,
      effectiveness,
    });
  } catch (error: any) {
    if (error.message === "PRO_REQUIRED") {
      return NextResponse.json(
        { error: "SportsEdge AI Pro membership required to view NFL Defensive Intelligence." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch NFL defensive data" }, { status: 500 });
  }
}
