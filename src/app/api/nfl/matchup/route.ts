import { NextRequest, NextResponse } from "next/server";
import { requirePro } from "@/lib/auth";
import prisma from "@/lib/db";
import { compareOffenseVsDefenseMatchup } from "@/lib/nfl-analytics";

export async function GET(req: NextRequest) {
  try {
    await requirePro();
    const { searchParams } = new URL(req.url);
    const offenseTeam = searchParams.get("offense") || "Example Team A";
    const defenseTeam = searchParams.get("defense") || "Example Team B";

    const [offPlays, defPlays] = await Promise.all([
      prisma.nflPlay.findMany({ where: { possessionTeam: offenseTeam } }) as any,
      prisma.nflPlay.findMany({ where: { defensiveTeam: defenseTeam } }) as any,
    ]);

    const matchup = compareOffenseVsDefenseMatchup(
      offPlays,
      defPlays,
      offenseTeam,
      defenseTeam
    );

    return NextResponse.json(matchup);
  } catch (error: any) {
    if (error.message === "PRO_REQUIRED") {
      return NextResponse.json(
        { error: "SportsEdge AI Pro membership required to view Matchup Comparison." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to compare matchup" }, { status: 500 });
  }
}
