import { NextResponse } from "next/server";
import { getLearningOverview, processFinishedGame } from "@/lib/game-learning";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const league = searchParams.get("league") as "NFL" | "NHL" | undefined;

    const data = await getLearningOverview(league || undefined);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/learning error:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning overview", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      gameId,
      league,
      homeTeam,
      awayTeam,
      homeTeamName,
      awayTeamName,
      actualHomeScore,
      actualAwayScore,
      actualScorers,
      actualFirstScorer,
      actualFirstTeamToScore,
    } = body;

    if (!gameId || !league || !homeTeam || !awayTeam || actualHomeScore === undefined || actualAwayScore === undefined) {
      return NextResponse.json(
        { error: "gameId, league, homeTeam, awayTeam, actualHomeScore, and actualAwayScore are required." },
        { status: 400 }
      );
    }

    const record = await processFinishedGame({
      gameId,
      league,
      homeTeam,
      awayTeam,
      homeTeamName,
      awayTeamName,
      actualHomeScore: Number(actualHomeScore),
      actualAwayScore: Number(actualAwayScore),
      actualScorers: Array.isArray(actualScorers) ? actualScorers : [],
      actualFirstScorer,
      actualFirstTeamToScore,
    });

    return NextResponse.json({
      success: true,
      message: `Game ${gameId} successfully processed into AI continuous learning engine.`,
      learningRecord: record,
    });
  } catch (error: any) {
    console.error("POST /api/learning error:", error);
    return NextResponse.json(
      { error: "Failed to process finished game", message: error.message },
      { status: 500 }
    );
  }
}
