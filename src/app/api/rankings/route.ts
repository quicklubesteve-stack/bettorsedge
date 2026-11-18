import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { NFL_ALL_TEAMS, NHL_ALL_TEAMS } from "@/lib/teams";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const league = searchParams.get("league") || "NFL"; // "NFL" or "NHL"

    if (league === "NFL") {
      // Aggregate blitz rates and run/pass percentages for all 32 teams for 2025-2026 season
      let allPlays = await prisma.nflPlay.findMany({
        where: { season: 2025 },
        select: {
          defensiveTeam: true,
          possessionTeam: true,
          isBlitz: true,
          isPressure: true,
          isSack: true,
          playType: true,
          down: true,
        },
      });

      if (allPlays.length === 0) {
        allPlays = await prisma.nflPlay.findMany({
          select: {
            defensiveTeam: true,
            possessionTeam: true,
            isBlitz: true,
            isPressure: true,
            isSack: true,
            playType: true,
            down: true,
          },
        });
      }

      const nflRankings = NFL_ALL_TEAMS.map((team) => {
        const defPlays = allPlays.filter((p) => p.defensiveTeam === team.abbr);
        const offPlays = allPlays.filter((p) => p.possessionTeam === team.abbr);

        const totalDef = defPlays.length;
        const totalBlitz = defPlays.filter((p) => p.isBlitz === true).length;
        const totalPressures = defPlays.filter((p) => p.isPressure === true).length;
        const totalSacks = defPlays.filter((p) => p.isSack === true).length;

        const blitzRate = totalDef > 0 ? Number(((totalBlitz / totalDef) * 100).toFixed(1)) : 0;
        const pressureRate = totalDef > 0 ? Number(((totalPressures / totalDef) * 100).toFixed(1)) : 0;

        const totalOff = offPlays.length;
        const passPlays = offPlays.filter((p) => p.playType === "PASS" || p.playType === "SACK").length;
        const runPlays = offPlays.filter((p) => p.playType === "RUN" || p.playType === "SCRAMBLE").length;
        const validOff = passPlays + runPlays > 0 ? passPlays + runPlays : totalOff;

        const passRate = validOff > 0 ? Number(((passPlays / validOff) * 100).toFixed(1)) : 0;
        const runRate = validOff > 0 ? Number(((runPlays / validOff) * 100).toFixed(1)) : 0;

        return {
          abbr: team.abbr,
          name: team.name,
          conference: team.conference,
          division: team.division,
          totalSnaps: totalDef,
          blitzRate,
          pressureRate,
          sacks: totalSacks,
          passRate,
          runRate,
        };
      });

      // Sort by blitz rate descending by default
      nflRankings.sort((a, b) => b.blitzRate - a.blitzRate);

      return NextResponse.json({
        league: "NFL",
        season: "2025-2026",
        rankings: nflRankings,
      });
    } else {
      // NHL Special Teams Rankings for all 32 teams for 2025-2026 season
      let stats = await prisma.nhlSpecialTeamsTeamStats.findMany({
        where: { season: "2025-2026" },
        orderBy: { ppPct: "desc" },
      });

      if (stats.length === 0) {
        stats = await prisma.nhlSpecialTeamsTeamStats.findMany({
          orderBy: { ppPct: "desc" },
        });
      }

      const nhlRankings = stats.map((s, idx) => {
        const teamInfo = NHL_ALL_TEAMS.find((t) => t.abbr === s.team);
        const specialTeamsIndex = Number((s.ppPct + s.pkPct).toFixed(1)); // >105 is elite, <95 is struggling

        return {
          rank: idx + 1,
          abbr: s.team,
          name: teamInfo?.name || s.team,
          conference: teamInfo?.conference || "NHL",
          division: teamInfo?.division || "Division",
          ppPct: s.ppPct,
          ppGoals: s.ppGoals,
          ppOpportunities: s.ppOpportunities,
          pkPct: s.pkPct,
          timesShorthanded: s.timesShorthanded,
          shBlockedShots: s.shBlockedShots,
          specialTeamsIndex,
        };
      });

      return NextResponse.json({
        league: "NHL",
        season: "2025-2026",
        rankings: nhlRankings,
      });
    }
  } catch (error: any) {
    console.error("Rankings error:", error);
    return NextResponse.json({ error: "Failed to fetch rankings" }, { status: 500 });
  }
}
