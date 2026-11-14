import { NextRequest, NextResponse } from "next/server";
import { requirePro } from "@/lib/auth";
import prisma from "@/lib/db";
import { compareSpecialTeamsMatchup } from "@/lib/nhl-analytics";

export async function GET(req: NextRequest) {
  try {
    await requirePro();
    const { searchParams } = new URL(req.url);
    const ppTeam = searchParams.get("ppTeam") || "EDM";
    const pkTeam = searchParams.get("pkTeam") || "TOR";

    const [ppStats, pkStats, ppPlayers, pkPlayers] = await Promise.all([
      prisma.nhlSpecialTeamsTeamStats.findFirst({ where: { team: ppTeam } }),
      prisma.nhlSpecialTeamsTeamStats.findFirst({ where: { team: pkTeam } }),
      prisma.nhlSpecialTeamsPlayer.findMany({ where: { team: ppTeam } }),
      prisma.nhlSpecialTeamsPlayer.findMany({ where: { team: pkTeam } }),
    ]);

    if (!ppStats || !pkStats) {
      return NextResponse.json(
        { error: "Special-teams statistics unavailable for one or both requested teams." },
        { status: 404 }
      );
    }

    const comparison = compareSpecialTeamsMatchup(
      ppStats as any,
      pkStats as any,
      ppPlayers as any,
      pkPlayers as any
    );

    return NextResponse.json(comparison);
  } catch (error: any) {
    if (error.message === "PRO_REQUIRED") {
      return NextResponse.json(
        { error: "SportsEdge AI Pro membership required to view Special-Teams Matchup." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to compare special-teams matchup" }, { status: 500 });
  }
}
