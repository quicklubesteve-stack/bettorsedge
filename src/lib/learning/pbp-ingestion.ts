import { prisma } from "../db";
import { NHL_ALL_TEAMS, NFL_ALL_TEAMS } from "../teams";

export interface NormalizedNhlShot {
  xNorm: number;
  yNorm: number;
  distance: number;
  angle: number;
  isHighDanger: boolean;
  isRebound: boolean;
  isRush: boolean;
  xG: number;
  situationCode: string;
}

/**
 * Normalizes NHL rink coordinates so the attacking target net is always at (x=89, y=0).
 * Rink bounds: [-100, 100] on X, [-42.5, 42.5] on Y.
 */
export function normalizeNhlCoordinates(
  xCoord: number,
  yCoord: number,
  homeTeamDefendingSide?: string,
  isHomeTeamEvent: boolean = true
): { xNorm: number; yNorm: number } {
  // If home team defends 'right' (x > 0), they attack left (x < 0).
  // If home team defends 'left' (x < 0), they attack right (x > 0).
  const homeAttacksRight = homeTeamDefendingSide === "left";
  const teamAttacksRight = isHomeTeamEvent ? homeAttacksRight : !homeAttacksRight;

  if (teamAttacksRight) {
    // Already shooting towards x=89
    return {
      xNorm: Math.max(-100, Math.min(100, xCoord)),
      yNorm: Math.max(-42.5, Math.min(42.5, yCoord)),
    };
  } else {
    // Shooting towards x=-89, mirror to +X
    return {
      xNorm: -Math.max(-100, Math.min(100, xCoord)),
      yNorm: -Math.max(-42.5, Math.min(42.5, yCoord)),
    };
  }
}

/**
 * Calculates Expected Goals (xG) based on spatial coordinates, shot angle,
 * shot type, rebound flag, and manpower situation.
 */
export function calculateExpectedGoals(
  xNorm: number,
  yNorm: number,
  shotType: string = "wrist",
  isRebound: boolean = false,
  isRush: boolean = false,
  situationCode: string = "1551"
): NormalizedNhlShot {
  const targetNetX = 89;
  const targetNetY = 0;

  const dx = targetNetX - xNorm;
  const dy = targetNetY - yNorm;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angleRad = Math.atan2(Math.abs(dy), Math.max(1, dx));
  const angleDeg = Number(((angleRad * 180) / Math.PI).toFixed(1));

  // High danger zone: within 25 feet and slot width <= 16 feet
  const isHighDanger = distance <= 25 && Math.abs(yNorm) <= 16;

  // Logistic regression log-odds model
  let logit = -1.25 - 0.045 * distance - 0.015 * angleDeg;

  if (isHighDanger) logit += 0.45;
  if (isRebound) logit += 0.65;
  if (isRush) logit += 0.35;

  // Shot type adjustments
  const lowerType = shotType.toLowerCase();
  if (lowerType.includes("tip") || lowerType.includes("deflect")) logit += 0.40;
  else if (lowerType.includes("slap")) logit -= 0.15;
  else if (lowerType.includes("backhand")) logit += 0.10;

  // Manpower adjustments (1551 is 5v5; 1541 is 5v4 power play)
  if (situationCode && situationCode !== "1551") {
    logit += 0.35;
  }

  // Sigmoid activation
  const xG = Number((1 / (1 + Math.exp(-logit))).toFixed(4));
  const boundedXg = Math.max(0.01, Math.min(0.85, xG));

  return {
    xNorm: Number(xNorm.toFixed(1)),
    yNorm: Number(yNorm.toFixed(1)),
    distance: Number(distance.toFixed(1)),
    angle: angleDeg,
    isHighDanger,
    isRebound,
    isRush,
    xG: boundedXg,
    situationCode: situationCode || "1551",
  };
}

/**
 * Expected Points (EP) approximation for NFL down, distance, and field position.
 * yardline100: distance from opponent's goal line (1 to 99).
 */
export function calculateExpectedPoints(down: number, distance: number, yardline100: number): number {
  const fieldFactor = 6.0 * (1 - yardline100 / 100);
  const downPenalty = Math.max(0, down - 1) * 0.75;
  const distPenalty = Math.min(distance, 20) * 0.06;

  const ep = fieldFactor - downPenalty - distPenalty;
  return Number(ep.toFixed(2));
}

/**
 * Calculates Expected Points Added (EPA) and success rate for a single NFL play.
 */
export function calculateNflPlayEpa(
  down: number,
  distance: number,
  yardline100: number,
  yardsGained: number,
  isTurnover: boolean = false,
  isTouchdown: boolean = false
): { epa: number; isSuccess: boolean } {
  const epBefore = calculateExpectedPoints(down, distance, yardline100);

  let epAfter = 0;
  if (isTouchdown) {
    epAfter = 7.0;
  } else if (isTurnover) {
    // Turnover: opponent takes over with inverted field position
    const oppYardline = Math.max(1, 100 - (yardline100 - yardsGained));
    epAfter = -calculateExpectedPoints(1, 10, oppYardline);
  } else {
    const nextYardline = Math.max(1, yardline100 - yardsGained);
    const nextDistance = distance - yardsGained;
    if (nextDistance <= 0) {
      // First down gained
      epAfter = calculateExpectedPoints(1, 10, nextYardline);
    } else if (down >= 4) {
      // Turnover on downs
      epAfter = -calculateExpectedPoints(1, 10, 100 - nextYardline);
    } else {
      epAfter = calculateExpectedPoints(down + 1, nextDistance, nextYardline);
    }
  }

  const epa = Number((epAfter - epBefore).toFixed(3));

  // Success rate threshold
  let isSuccess = false;
  if (isTouchdown) isSuccess = true;
  else if (isTurnover) isSuccess = false;
  else if (down === 1) isSuccess = yardsGained >= distance * 0.40;
  else if (down === 2) isSuccess = yardsGained >= distance * 0.60;
  else isSuccess = yardsGained >= distance;

  return { epa, isSuccess };
}

/**
 * Ingests live play-by-play for a completed NHL game from official NHL API.
 */
export async function ingestNhlPlayByPlay(gameId: string, season: string = "2026-2027"): Promise<{ count: number; totalXg: number }> {
  try {
    const res = await fetch(`https://api-web.nhle.com/v1/gamecenter/${gameId}/play-by-play`, {
      headers: { "User-Agent": "SportsEdgeAI/2.0" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`NHL gamecenter returned status ${res.status}`);
    const data = await res.json();
    const rawPlays = data.plays || [];

    // Sort strictly by sortOrder
    rawPlays.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    const homeTeam = data.homeTeam?.abbrev || "HOME";
    const awayTeam = data.awayTeam?.abbrev || "AWAY";

    let totalXg = 0;
    const playEventsToInsert: any[] = [];
    let lastShotTime = -100;

    for (const p of rawPlays) {
      const typeKey = p.typeDescKey || "";
      const isShot = typeKey === "shot-on-goal" || typeKey === "goal" || typeKey === "missed-shot";
      if (!isShot && typeKey !== "hit" && typeKey !== "penalty" && typeKey !== "faceoff") {
        continue;
      }

      const xCoord = p.details?.xCoord ?? 0;
      const yCoord = p.details?.yCoord ?? 0;
      const isHomeEvent = p.details?.eventOwnerTeamId === data.homeTeam?.id;
      const teamId = isHomeEvent ? homeTeam : awayTeam;
      const opponentId = isHomeEvent ? awayTeam : homeTeam;

      // Coordinate normalization
      const { xNorm, yNorm } = normalizeNhlCoordinates(
        xCoord,
        yCoord,
        p.homeTeamDefendingSide,
        isHomeEvent
      );

      // Check rebound
      const currentSeconds = parsePeriodClock(p.timeInPeriod || "00:00");
      const isRebound = isShot && Math.abs(currentSeconds - lastShotTime) <= 3.5;
      if (isShot) lastShotTime = currentSeconds;

      let epaOrXg = 0;
      if (isShot) {
        const shotAnalysis = calculateExpectedGoals(
          xNorm,
          yNorm,
          p.details?.shotType || "wrist",
          isRebound,
          false,
          p.situationCode || "1551"
        );
        epaOrXg = shotAnalysis.xG;
        totalXg += epaOrXg;
      }

      playEventsToInsert.push({
        league: "NHL",
        gameId: String(gameId),
        season,
        weekOrDate: p.timeInPeriod || "1P",
        periodOrQuarter: p.periodDescriptor?.number ?? 1,
        clock: p.timeRemaining || "00:00",
        teamId,
        opponentId,
        playType: typeKey,
        xCoord: xNorm,
        yCoord: yNorm,
        situationCode: p.situationCode || "1551",
        epaOrXgValue: epaOrXg,
        primaryPlayerId: p.details?.shootingPlayerId ? String(p.details.shootingPlayerId) : p.details?.scoringPlayerId ? String(p.details.scoringPlayerId) : null,
        secondaryPlayerId: p.details?.goalieInNetId ? String(p.details.goalieInNetId) : null,
      });
    }

    if (playEventsToInsert.length > 0) {
      // Clean previous logs for this game to prevent duplicates
      await prisma.playEvent.deleteMany({
        where: { league: "NHL", gameId: String(gameId) },
      });

      await prisma.playEvent.createMany({
        data: playEventsToInsert,
      });
    }

    return { count: playEventsToInsert.length, totalXg: Number(totalXg.toFixed(3)) };
  } catch (err: any) {
    console.error(`ingestNhlPlayByPlay error for ${gameId}:`, err.message);
    return { count: 0, totalXg: 0 };
  }
}

/**
 * Ingests live play-by-play for a completed NFL game from ESPN summary API.
 */
export async function ingestNflPlayByPlay(eventId: string, season: string = "2026-2027"): Promise<{ count: number; totalEpa: number }> {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`, {
      headers: { "User-Agent": "SportsEdgeAI/2.0" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`ESPN NFL summary returned status ${res.status}`);
    const data = await res.json();
    const drives = data.drives?.previous || [];

    const homeTeam = data.header?.competitions?.[0]?.competitors?.find((c: any) => c.homeAway === "home")?.team?.abbreviation || "HOME";
    const awayTeam = data.header?.competitions?.[0]?.competitors?.find((c: any) => c.homeAway === "away")?.team?.abbreviation || "AWAY";

    let totalEpa = 0;
    const playEventsToInsert: any[] = [];

    for (const drive of drives) {
      const driveTeam = drive.team?.abbreviation || homeTeam;
      const driveOpponent = driveTeam === homeTeam ? awayTeam : homeTeam;
      const plays = drive.plays || [];

      for (const play of plays) {
        const down = play.start?.down ?? 1;
        const distance = play.start?.distance ?? 10;
        const yardLine = play.start?.yardLine ?? 50;
        const yardsGained = play.statYardage ?? 0;
        const isTouchdown = play.scoringPlay === true;
        const isTurnover = play.text?.includes("INTERCEPTED") || play.text?.includes("FUMBLES");

        // Compute EPA
        const { epa } = calculateNflPlayEpa(down, distance, yardLine, yardsGained, isTurnover, isTouchdown);
        totalEpa += epa;

        playEventsToInsert.push({
          league: "NFL",
          gameId: String(eventId),
          season,
          weekOrDate: `Q${play.period?.number ?? 1}`,
          periodOrQuarter: play.period?.number ?? 1,
          clock: play.clock?.displayValue || "00:00",
          teamId: driveTeam,
          opponentId: driveOpponent,
          playType: play.type?.text || "rush",
          xCoord: yardLine,
          yCoord: 0,
          situationCode: `${down} & ${distance}`,
          epaOrXgValue: epa,
          primaryPlayerId: driveTeam,
          secondaryPlayerId: driveOpponent,
        });
      }
    }

    if (playEventsToInsert.length > 0) {
      await prisma.playEvent.deleteMany({
        where: { league: "NFL", gameId: String(eventId) },
      });

      await prisma.playEvent.createMany({
        data: playEventsToInsert,
      });
    }

    return { count: playEventsToInsert.length, totalEpa: Number(totalEpa.toFixed(3)) };
  } catch (err: any) {
    console.error(`ingestNflPlayByPlay error for ${eventId}:`, err.message);
    return { count: 0, totalEpa: 0 };
  }
}

function parsePeriodClock(clockStr: string): number {
  const parts = clockStr.split(":").map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}
