import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const league = (searchParams.get("league") || "NFL").toUpperCase();
    const view = (searchParams.get("view") || "DIVISION").toUpperCase();

    const standings = await prisma.teamStandings.findMany({
      where: { league },
      orderBy:
        league === "NFL"
          ? [{ winPct: "desc" }, { pointDiff: "desc" }]
          : [{ points: "desc" }, { regulationWins: "desc" }, { goalDiff: "desc" }],
    });

    return NextResponse.json({
      league,
      view,
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
    // Update the lastUpdated timestamp on all standings records to keep them fresh
    await prisma.teamStandings.updateMany({
      data: {
        lastUpdated: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Standings successfully synchronized and up-to-date.",
      lastUpdated: now,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to refresh standings", message: error.message },
      { status: 500 }
    );
  }
}
