import { NextResponse } from "next/server";
import { getTodayGames } from "@/lib/today-games-service";
import { evaluateGameBettingValue, BettingValueCalculation } from "@/lib/betting-value-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueFilter = searchParams.get("league") as "NFL" | "NHL" | null;
    const sortFilter = searchParams.get("sort") || "ev"; // "ev", "winProb", "edge", "time"

    const { games } = await getTodayGames("ALL");

    const allValueCalculations: BettingValueCalculation[] = [];

    for (const game of games) {
      if (leagueFilter && game.league !== leagueFilter) continue;

      const homeOdds = game.homeMoneyline ?? -110;
      const awayOdds = game.awayMoneyline ?? -110;

      const evalResult = evaluateGameBettingValue(
        game.gameId,
        game.league,
        game.formattedTimeToronto,
        game.homeTeamName,
        game.awayTeamName,
        homeOdds,
        awayOdds,
        game.homeWinProbability / 100,
        game.awayWinProbability / 100,
        game.confidenceScore
      );

      allValueCalculations.push(evalResult.homeValue);
      allValueCalculations.push(evalResult.awayValue);
    }

    // Sort according to request
    if (sortFilter === "ev") {
      allValueCalculations.sort((a, b) => b.evPer100 - a.evPer100);
    } else if (sortFilter === "winProb") {
      allValueCalculations.sort((a, b) => b.aiWinProb - a.aiWinProb);
    } else if (sortFilter === "edge") {
      allValueCalculations.sort((a, b) => b.edge - a.edge);
    } else if (sortFilter === "time") {
      allValueCalculations.sort((a, b) => a.gameTime.localeCompare(b.gameTime));
    }

    return NextResponse.json({
      success: true,
      totalEvaluated: allValueCalculations.length,
      opportunities: allValueCalculations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/betting-value:", error);
    return NextResponse.json({ success: false, error: "Failed to evaluate betting value" }, { status: 500 });
  }
}
