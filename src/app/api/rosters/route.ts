import { NextResponse } from "next/server";
import { getAllRosters, checkWeeklyRosterSync } from "@/lib/roster-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const league = (searchParams.get("league") || "NFL").toUpperCase() as "NFL" | "NHL";
    const team = searchParams.get("team") || undefined;
    const search = searchParams.get("search") || undefined;

    // Background verification: check if 7 days elapsed and weekly sync is due
    await checkWeeklyRosterSync();

    const data = await getAllRosters(league, team, search);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/rosters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rosters", message: error.message },
      { status: 500 }
    );
  }
}
