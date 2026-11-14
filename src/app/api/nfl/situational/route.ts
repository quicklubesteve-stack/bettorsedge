import { NextRequest, NextResponse } from "next/server";
import { requirePro } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  predictSituationalBlitz,
  analyzeSituationalOffense,
} from "@/lib/nfl-analytics";

export async function POST(req: NextRequest) {
  try {
    await requirePro();
    const body = await req.json();
    const { mode, team, down, yardsToGo, yardline100, quarter, scoreDiff } = body;

    if (mode === "DEFENSE_BLITZ") {
      const plays = (await prisma.nflPlay.findMany({
        where: { defensiveTeam: team || "Example Team A" },
      })) as any[];

      const distanceBracket =
        yardsToGo !== undefined
          ? yardsToGo <= 3
            ? "SHORT"
            : yardsToGo <= 7
            ? "MEDIUM"
            : "LONG"
          : undefined;

      const yardlineBracket =
        yardline100 !== undefined
          ? yardline100 <= 20
            ? "RED_ZONE"
            : yardline100 >= 50
            ? "OWN_TERRITORY"
            : "OPPONENT_TERRITORY"
          : undefined;

      const scoreStatus =
        scoreDiff !== undefined
          ? scoreDiff < 0
            ? "LEADING"
            : scoreDiff > 0
            ? "TRAILING"
            : "TIED"
          : undefined;

      const prediction = predictSituationalBlitz(plays, {
        down: down ? Number(down) : undefined,
        distanceBracket,
        yardlineBracket,
        quarter: quarter ? Number(quarter) : undefined,
        scoreStatus,
      });

      return NextResponse.json(prediction);
    } else {
      // Offensive situational search
      const plays = (await prisma.nflPlay.findMany({
        where: { possessionTeam: team || "Example Team A" },
      })) as any[];

      const result = analyzeSituationalOffense(plays, {
        down: down ? Number(down) : undefined,
        yardsToGoMin: yardsToGo ? Number(yardsToGo) - 1 : undefined,
        yardsToGoMax: yardsToGo ? Number(yardsToGo) + 1 : undefined,
        yardline100Min: yardline100 ? Number(yardline100) - 5 : undefined,
        yardline100Max: yardline100 ? Number(yardline100) + 5 : undefined,
        quarter: quarter ? Number(quarter) : undefined,
        scoreDiffMin: scoreDiff ? Number(scoreDiff) - 4 : undefined,
        scoreDiffMax: scoreDiff ? Number(scoreDiff) + 4 : undefined,
      });

      return NextResponse.json(result);
    }
  } catch (error: any) {
    if (error.message === "PRO_REQUIRED") {
      return NextResponse.json(
        { error: "SportsEdge AI Pro membership required to access Situational Predictor." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to run situational query" }, { status: 500 });
  }
}
