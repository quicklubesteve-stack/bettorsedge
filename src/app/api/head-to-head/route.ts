import { NextResponse } from "next/server";
import { getHeadToHeadHistory } from "@/lib/head-to-head";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const league = (searchParams.get("league") || "NFL").toUpperCase() as "NFL" | "NHL";
    const teamA = (searchParams.get("teamA") || (league === "NFL" ? "BUF" : "TOR")).toUpperCase();
    const teamB = (searchParams.get("teamB") || (league === "NFL" ? "KC" : "VGK")).toUpperCase();

    const data = getHeadToHeadHistory(league, teamA, teamB);

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load head-to-head history", message: error.message },
      { status: 500 }
    );
  }
}
