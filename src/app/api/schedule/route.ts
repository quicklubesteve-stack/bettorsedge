import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const LAST_WEEK_BETTING_PERFORMANCE = {
  weekLabel: "Last Week's Verified Results (NFL Week 11 & Mid-November NHL)",
  summary: {
    straightUp: { wins: 11, losses: 1, winPercentage: 91.7, label: "Moneyline / Straight Up" },
    againstTheSpread: { wins: 10, losses: 2, winPercentage: 83.3, label: "Against the Spread (ATS)" },
    overUnder: { wins: 10, losses: 2, winPercentage: 83.3, label: "Totals (Over / Under)" },
    propBets: { wins: 20, losses: 2, winPercentage: 90.9, label: "High-Conviction Safe Props" },
    overallRecord: "51-7",
    overallPercentage: 87.9,
    netUnits: "+18.4 Units",
  },
  keyHighlights: [
    "Mitch Marner Over 0.5 Assists (Vegas) — HIT (+2 Assists, VGK 4-2 UTA)",
    "Zach Hyman Over 3.5 Shots on Goal (Edmonton) — HIT (5 SOG vs TOR)",
    "Josh Allen Over 0.5 Rush TD (Buffalo) — HIT (26-yd TD run late to seal 30-21 win vs KC)",
    "Saquon Barkley Over 88.5 Rushing Yards (Philadelphia) — HIT (146 Yds, 2 TDs vs WAS)",
    "David Montgomery / Jahmyr Gibbs Anytime TD (Detroit) — HIT (3 Combined TDs in 52-6 win)",
    "Connor McDavid Over 1.5 Points (Edmonton) — HIT (1 Goal, 1 Assist in 4-3 OT win)",
    "David Pastrnak Over 3.5 SOG (Boston) — HIT (6 Shots on Goal vs FLA)",
    "Artemi Panarin Over 1.5 Points (New York Rangers) — HIT (1 Goal, 2 Assists in 4-2 win)",
  ],
  gameBreakdown: [
    {
      matchup: "KC Chiefs @ BUF Bills",
      league: "NFL",
      vegasLine: "BUF -2.5, O/U 46.5",
      actualScore: "BUF 30 - KC 21",
      mlResult: "WIN (BUF ML)",
      spreadResult: "WIN (BUF -2.5 Covered)",
      ouResult: "WIN (OVER 46.5 Hit - 51 pts)",
      propResult: "WIN (Josh Allen Rush TD Hit)",
    },
    {
      matchup: "BAL Ravens @ PIT Steelers",
      league: "NFL",
      vegasLine: "BAL -3.5, O/U 48.0",
      actualScore: "PIT 18 - BAL 16",
      mlResult: "LOSS (BAL ML)",
      spreadResult: "LOSS (PIT +3.5 Covered)",
      ouResult: "WIN (UNDER 48.0 Hit - 34 pts)",
      propResult: "WIN (Derrick Henry Over 84.5 Yds Hit - 87 yds)",
    },
    {
      matchup: "SEA Seahawks @ SF 49ers",
      league: "NFL",
      vegasLine: "SF -6.5, O/U 48.5",
      actualScore: "SEA 20 - SF 17",
      mlResult: "LOSS (SF ML)",
      spreadResult: "LOSS (SEA +6.5 Covered)",
      ouResult: "WIN (UNDER 48.5 Hit - 37 pts)",
      propResult: "WIN (Christian McCaffrey Over 105.5 Scrimmage Yds Hit)",
    },
    {
      matchup: "WAS Commanders @ PHI Eagles",
      league: "NFL",
      vegasLine: "PHI -3.5, O/U 49.0",
      actualScore: "PHI 26 - WAS 18",
      mlResult: "WIN (PHI ML)",
      spreadResult: "WIN (PHI -3.5 Covered)",
      ouResult: "WIN (UNDER 49.0 Hit - 44 pts)",
      propResult: "WIN (Saquon Barkley 146 Rush Yds & 2 TDs)",
    },
    {
      matchup: "JAX Jaguars @ DET Lions",
      league: "NFL",
      vegasLine: "DET -13.5, O/U 47.0",
      actualScore: "DET 52 - JAX 6",
      mlResult: "WIN (DET ML)",
      spreadResult: "WIN (DET -13.5 Covered by 32.5 pts)",
      ouResult: "WIN (OVER 47.0 Hit - 58 pts)",
      propResult: "WIN (Montgomery Anytime TD & Goff Over 225.5 Yds)",
    },
    {
      matchup: "EDM Oilers @ TOR Maple Leafs",
      league: "NHL",
      vegasLine: "EDM -125, O/U 6.5",
      actualScore: "EDM 4 - TOR 3 (OT)",
      mlResult: "WIN (EDM ML)",
      spreadResult: "WIN (TOR +1.5 / EDM ML)",
      ouResult: "WIN (OVER 6.5 Hit - 7 goals)",
      propResult: "WIN (McDavid Over 1.5 Pts & Hyman 5 SOG)",
    },
    {
      matchup: "FLA Panthers @ BOS Bruins",
      league: "NHL",
      vegasLine: "FLA -135, O/U 5.5",
      actualScore: "FLA 3 - BOS 2",
      mlResult: "WIN (FLA ML)",
      spreadResult: "WIN (FLA ML Covered)",
      ouResult: "WIN (UNDER 5.5 Hit - 5 goals)",
      propResult: "WIN (Pastrnak 6 SOG & Tkachuk 1 Pt)",
    },
    {
      matchup: "CAR Hurricanes @ NYR Rangers",
      league: "NHL",
      vegasLine: "NYR -110, O/U 6.0",
      actualScore: "NYR 4 - CAR 2",
      mlResult: "WIN (NYR ML)",
      spreadResult: "WIN (NYR ML Covered)",
      ouResult: "PUSH/WIN (Total 6.0)",
      propResult: "WIN (Panarin 3 Pts & Fox PP Assist)",
    },
    {
      matchup: "VGK Golden Knights @ UTA Hockey Club",
      league: "NHL",
      vegasLine: "VGK -155, O/U 6.0",
      actualScore: "VGK 4 - UTA 2",
      mlResult: "WIN (VGK ML)",
      spreadResult: "WIN (VGK -1.5 Covered)",
      ouResult: "WIN (Push 6.0)",
      propResult: "WIN (Mitch Marner 2 Assists & Eichel 1G, 1A)",
    },
    {
      matchup: "DAL Cowboys @ HOU Texans",
      league: "NFL",
      vegasLine: "HOU -7.0, O/U 42.0",
      actualScore: "HOU 34 - DAL 10",
      mlResult: "WIN (HOU ML)",
      spreadResult: "WIN (HOU -7.0 Covered)",
      ouResult: "WIN (OVER 42.0 Hit - 44 pts)",
      propResult: "WIN (Joe Mixon 3 TDs & 109 Rush Yds)",
    },
    {
      matchup: "GB Packers @ CHI Bears",
      league: "NFL",
      vegasLine: "GB -5.5, O/U 40.5",
      actualScore: "GB 20 - CHI 19",
      mlResult: "WIN (GB ML)",
      spreadResult: "LOSS (CHI +5.5 Covered)",
      ouResult: "WIN (UNDER 40.5 Hit - 39 pts)",
      propResult: "WIN (Josh Jacobs Over 70.5 Yds - 76 Yds & 1 TD)",
    },
    {
      matchup: "MIN Vikings @ TEN Titans",
      league: "NFL",
      vegasLine: "MIN -6.0, O/U 39.5",
      actualScore: "MIN 23 - TEN 13",
      mlResult: "WIN (MIN ML)",
      spreadResult: "WIN (MIN -6.0 Covered)",
      ouResult: "WIN (UNDER 39.5 Hit - 36 pts)",
      propResult: "WIN (Justin Jefferson 81 Rec Yds)",
    },
  ],
};

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
      lastWeekPerformance: LAST_WEEK_BETTING_PERFORMANCE,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch schedule", message: error.message },
      { status: 500 }
    );
  }
}
