import { NextResponse } from "next/server";
import { getTodayGames } from "@/lib/today-games-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const leagueParam = (searchParams.get("league") || "ALL").toUpperCase();
    const timeHorizonParam = (searchParams.get("timeHorizon") || "ALL").toUpperCase();
    const sortByParam = (searchParams.get("sortBy") || "time").toLowerCase();
    const dateParam = searchParams.get("date"); // optional override for testing

    const league = (["ALL", "NFL", "NHL"].includes(leagueParam)
      ? leagueParam
      : "ALL") as "ALL" | "NFL" | "NHL";

    const timeHorizon = ([
      "ALL",
      "TODAY",
      "TOMORROW",
      "THIS_WEEK",
      "TODAY_NFL",
      "TODAY_NHL",
    ].includes(timeHorizonParam)
      ? timeHorizonParam
      : "ALL") as "ALL" | "TODAY" | "TOMORROW" | "THIS_WEEK" | "TODAY_NFL" | "TODAY_NHL";

    const sortBy = (["time", "prob", "closest", "value"].includes(sortByParam)
      ? sortByParam
      : "time") as "time" | "prob" | "closest" | "value";

    const referenceNow = dateParam ? new Date(dateParam) : new Date();

    const data = await getTodayGames(league, referenceNow, timeHorizon, sortBy);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch today's games", message: error.message },
      { status: 500 }
    );
  }
}
