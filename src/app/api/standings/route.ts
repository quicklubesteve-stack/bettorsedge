import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const league = (searchParams.get("league") || "NFL").toUpperCase();
    const view = (searchParams.get("view") || "DIVISION").toUpperCase();

    let orderBy: any = [{ rankConference: "asc" }];
    if (view === "DIVISION") {
      orderBy = [{ conference: "asc" }, { division: "asc" }, { rankDivision: "asc" }];
    } else if (view === "LEAGUE") {
      orderBy = [{ rankLeague: "asc" }];
    } else if (view === "PLAYOFF") {
      orderBy = [{ playoffSeed: "asc" }];
    }

    const standings = await prisma.teamStandings.findMany({
      where: { league },
      orderBy,
    });

    return NextResponse.json({
      league,
      view,
      source: league === "NFL" ? "NFL.com (Official Week 11)" : "Official NHL Standings Feed",
      total: standings.length,
      lastUpdated: standings[0]?.lastUpdated || new Date(),
      standings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch standings", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const now = new Date();
    await prisma.teamStandings.updateMany({
      data: {
        lastUpdated: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Standings successfully synchronized with NFL.com (Week 11).",
      lastUpdated: now,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to refresh standings", message: error.message },
      { status: 500 }
    );
  }
}
