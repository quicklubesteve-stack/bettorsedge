import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
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

    // Fetch dynamic calibrated weights learned from past games
    const weightsA = await prisma.teamAdaptiveWeights.findUnique({
      where: { league_team: { league, team: teamA } },
    });
    const weightsB = await prisma.teamAdaptiveWeights.findUnique({
      where: { league_team: { league, team: teamB } },
    });

    const learnedFactorsA = weightsA
      ? {
          offRating: weightsA.offensiveRating,
          defRating: weightsA.defensiveRating,
          paceFactor: weightsA.paceFactor,
          recentFormBonus: weightsA.recentFormBonus,
        }
      : undefined;

    const learnedFactorsB = weightsB
      ? {
          offRating: weightsB.offensiveRating,
          defRating: weightsB.defensiveRating,
          paceFactor: weightsB.paceFactor,
          recentFormBonus: weightsB.recentFormBonus,
        }
      : undefined;

    if (league === "NHL") {
      const result = simulateNhlMatchup(teamA, teamB, simIterations, learnedFactorsA, learnedFactorsB);
      return NextResponse.json({
        isPro,
        learnedCalibrationApplied: Boolean(weightsA || weightsB),
        teamACalibratedOffense: weightsA?.offensiveRating ?? 100.0,
        teamBCalibratedOffense: weightsB?.offensiveRating ?? 100.0,
        ...result,
      });
    } else {
      const result = simulateNflMatchup(teamA, teamB, simIterations, learnedFactorsA, learnedFactorsB);
      return NextResponse.json({
        isPro,
        learnedCalibrationApplied: Boolean(weightsA || weightsB),
        teamACalibratedOffense: weightsA?.offensiveRating ?? 100.0,
        teamBCalibratedOffense: weightsB?.offensiveRating ?? 100.0,
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
