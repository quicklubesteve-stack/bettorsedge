import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { simulateNflMatchup, simulateNhlMatchup } from "@/lib/matchup-simulation";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const isPro = Boolean(user && (user.isProActive || user.plan === "PRO" || user.role === "ADMIN"));

    const body = await req.json();
    const { league, teamA, teamB, iterations } = body;

    if (!teamA || !teamB) {
      return NextResponse.json({ error: "teamA and teamB are required." }, { status: 400 });
    }

    const simIterations = Math.min(5000, Math.max(100, Number(iterations) || 1000));

    if (league === "NHL") {
      const result = simulateNhlMatchup(teamA, teamB, simIterations);
      return NextResponse.json({
        isPro,
        ...result,
      });
    } else {
      const result = simulateNflMatchup(teamA, teamB, simIterations);
      return NextResponse.json({
        isPro,
        ...result,
      });
    }
  } catch (error: any) {
    console.error("Matchup POST error:", error);
    return NextResponse.json(
      { error: "Matchup simulation failed", message: error.message },
      { status: 500 }
    );
  }
}
