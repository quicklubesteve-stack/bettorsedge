import { NextResponse } from "next/server";
import { getTodayGames } from "@/lib/today-games-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const leagueParam = searchParams.get("league") || "ALL";
    const dateParam = searchParams.get("date"); // optional override for testing

    const league = (["ALL", "NFL", "NHL"].includes(leagueParam.toUpperCase())
      ? leagueParam.toUpperCase()
      : "ALL") as "ALL" | "NFL" | "NHL";

    const referenceNow = dateParam ? new Date(dateParam) : new Date();

    const data = await getTodayGames(league, referenceNow);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch today's games", message: error.message },
      { status: 500 }
    );
  }
}
