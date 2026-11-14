import { NextRequest, NextResponse } from "next/server";
import { requirePro } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateOffensiveTendencies } from "@/lib/nfl-analytics";
import { getProviderStatus } from "@/lib/data-providers";

export async function GET(req: NextRequest) {
  try {
    await requirePro();

    const { searchParams } = new URL(req.url);
    const team = searchParams.get("team") || "Example Team A";
    const season = searchParams.get("season") ? Number(searchParams.get("season")) : 2024;
    const excludeSpecial = searchParams.get("excludeKneels") !== "false";

    const plays = (await prisma.nflPlay.findMany({
      where: {
        possessionTeam: team,
        season,
      },
    })) as any[];

    const tendencies = calculateOffensiveTendencies(plays, excludeSpecial);
    const provider = getProviderStatus().nflOffense;

    return NextResponse.json({
      team,
      season,
      provider,
      totalPlays: plays.length,
      tendencies,
    });
  } catch (error: any) {
    if (error.message === "PRO_REQUIRED") {
      return NextResponse.json(
        { error: "SportsEdge AI Pro membership required to view NFL Offensive Tendencies." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch offensive tendencies" }, { status: 500 });
  }
}
