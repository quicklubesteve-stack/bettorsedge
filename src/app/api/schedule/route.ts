import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const league = searchParams.get("league"); // NFL, NHL, or null

    const where: any = {};
    if (league && league !== "ALL") {
      where.league = league.toUpperCase();
    }

    const games = await prisma.scheduledGame.findMany({
      where,
      orderBy: { date: "asc" },
    });

    const parsedGames = games.map((g) => ({
      ...g,
      safeProps: g.safePropsJson ? JSON.parse(g.safePropsJson) : [],
    }));

    return NextResponse.json({
      total: parsedGames.length,
      league: league || "ALL",
      games: parsedGames,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch schedule", message: error.message },
      { status: 500 }
    );
  }
}
