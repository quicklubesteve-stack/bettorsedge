import { prisma } from "./db";
import {
  calculateNflWinProbability,
  calculateNhlWinProbability,
  getGameDateInToronto,
  getTorontoDate,
  formatGameTimeToronto,
  getGameStatus,
  WinProbabilityResult,
  League,
  PlayerInjuryBrief,
  TeamRecordData,
} from "./win-probability-engine";
import { getTeamBrand, TeamBrand } from "./team-branding";

export interface EnrichedTodayGame extends WinProbabilityResult {
  homeBrand: TeamBrand;
  awayBrand: TeamBrand;
  homeRecordString: string;
  awayRecordString: string;
  venue: string;
  broadcast: string;
  isToday: boolean;
}

export interface TodayGamesResponse {
  todayDateToronto: string;
  effectiveDate: string;
  isUpcomingOnly: boolean;
  statusMessage: string;
  league: "ALL" | "NFL" | "NHL";
  total: number;
  games: EnrichedTodayGame[];
}

export async function getTodayGames(
  leagueFilter: "ALL" | "NFL" | "NHL" = "ALL",
  referenceNow: Date = new Date()
): Promise<TodayGamesResponse> {
  const todayToronto = getTorontoDate(referenceNow);

  // Fetch all scheduled games
  const allGames = await prisma.scheduledGame.findMany({
    orderBy: { date: "asc" },
  });

  // Filter by league if specified
  const leagueFilteredGames = allGames.filter((g) => {
    if (leagueFilter === "ALL") return true;
    return g.league.toUpperCase() === leagueFilter.toUpperCase();
  });

  // Filter for games matching today in Toronto time
  const todayGames = leagueFilteredGames.filter(
    (g) => getGameDateInToronto(g.date) === todayToronto
  );

  let targetGames = todayGames;
  let isUpcomingOnly = false;
  let effectiveDate = todayToronto;
  let statusMessage = `Showing verified live & scheduled games for Today (${todayToronto}) in America/Toronto time.`;

  // If no games scheduled for today, find the next upcoming scheduled date
  if (todayGames.length === 0) {
    isUpcomingOnly = true;

    // Find all future games starting from today
    const futureGames = leagueFilteredGames.filter((g) => {
      const gDate = getGameDateInToronto(g.date);
      return gDate >= todayToronto;
    });

    if (futureGames.length > 0) {
      // Pick the earliest available upcoming date
      const nextDate = getGameDateInToronto(futureGames[0].date);
      effectiveDate = nextDate;
      targetGames = futureGames.filter(
        (g) => getGameDateInToronto(g.date) === nextDate
      );
      
      const sampleDate = new Date(futureGames[0].date);
      const weekdayStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(sampleDate);

      statusMessage = `No ${leagueFilter === "ALL" ? "" : leagueFilter + " "}games scheduled for today (${todayToronto}). Displaying next upcoming scheduled slate for ${weekdayStr} (${nextDate}):`;
    } else {
      // Fallback to all scheduled games if none in future
      targetGames = leagueFilteredGames.slice(0, 10);
      effectiveDate = targetGames.length > 0 ? getGameDateInToronto(targetGames[0].date) : todayToronto;
      statusMessage = `Displaying next scheduled games on calendar:`;
    }
  }

  // Fetch all standings & injuries to enrich games efficiently in batch
  const allStandings = await prisma.teamStandings.findMany();
  const standingsMap = new Map<string, any>();
  allStandings.forEach((s) => standingsMap.set(`${s.league}_${s.team}`, s));

  // Fetch all roster players with non-active status for injury impact
  const allInjuries = await prisma.teamRosterPlayer.findMany({
    where: { status: { not: "ACTIVE" } },
  });
  const injuryMap = new Map<string, PlayerInjuryBrief[]>();
  allInjuries.forEach((inj) => {
    const list = injuryMap.get(inj.team) || [];
    list.push({
      name: inj.name,
      position: inj.position,
      status: inj.status as any,
      details: inj.injuryDetails || undefined,
      isKeyPlayer: inj.depthOrder === 1,
    });
    injuryMap.set(inj.team, list);
  });

  // Calculate Win Probability Analysis for each game
  const enrichedGames: EnrichedTodayGame[] = targetGames.map((game) => {
    const league = game.league.toUpperCase() as League;
    const homeStandings = standingsMap.get(`${league}_${game.homeTeam}`);
    const awayStandings = standingsMap.get(`${league}_${game.awayTeam}`);

    const homeRecord: TeamRecordData = {
      wins: homeStandings?.wins || 0,
      losses: homeStandings?.losses || 0,
      ties: homeStandings?.ties || 0,
      otLosses: homeStandings?.otLosses || 0,
      points: homeStandings?.points || 0,
      winPct: homeStandings?.winPct || (league === "NHL" ? 0.55 : 0.5),
      streak: homeStandings?.streak || "W1",
      pointsFor: homeStandings?.pointsFor || (league === "NHL" ? homeStandings?.goalsFor : 0),
      pointsAgainst: homeStandings?.pointsAgainst || (league === "NHL" ? homeStandings?.goalsAgainst : 0),
    };

    const awayRecord: TeamRecordData = {
      wins: awayStandings?.wins || 0,
      losses: awayStandings?.losses || 0,
      ties: awayStandings?.ties || 0,
      otLosses: awayStandings?.otLosses || 0,
      points: awayStandings?.points || 0,
      winPct: awayStandings?.winPct || (league === "NHL" ? 0.5 : 0.5),
      streak: awayStandings?.streak || "W1",
      pointsFor: awayStandings?.pointsFor || (league === "NHL" ? awayStandings?.goalsFor : 0),
      pointsAgainst: awayStandings?.pointsAgainst || (league === "NHL" ? awayStandings?.goalsAgainst : 0),
    };

    const homeInjuries = injuryMap.get(game.homeTeam) || [];
    const awayInjuries = injuryMap.get(game.awayTeam) || [];

    let analysis: WinProbabilityResult;

    if (league === "NFL") {
      analysis = calculateNflWinProbability(
        {
          gameId: game.gameId,
          gameDate: game.date,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          homeTeamName: game.homeTeamName,
          awayTeamName: game.awayTeamName,
          homeRecord,
          awayRecord,
          homeInjuries,
          awayInjuries,
          homeMoneyline: game.homeMoneyline,
          awayMoneyline: game.awayMoneyline,
          spread: game.spread,
          spreadFavorite: game.spreadFavorite as any,
          overUnder: game.overUnder,
          isColdWeather: game.venue.includes("Lambeau") || game.venue.includes("Buffalo"),
          isDome: game.venue.includes("AT&T") || game.venue.includes("Detroit") || game.venue.includes("Allegiant"),
        },
        referenceNow
      );
    } else {
      analysis = calculateNhlWinProbability(
        {
          gameId: game.gameId,
          gameDate: game.date,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          homeTeamName: game.homeTeamName,
          awayTeamName: game.awayTeamName,
          homeRecord,
          awayRecord,
          homeInjuries,
          awayInjuries,
          homeMoneyline: game.homeMoneyline,
          awayMoneyline: game.awayMoneyline,
          overUnder: game.overUnder,
        },
        referenceNow
      );
    }

    const homeBrand = getTeamBrand(game.homeTeam, league);
    const awayBrand = getTeamBrand(game.awayTeam, league);

    let homeRecordString = `${homeRecord.wins}-${homeRecord.losses}`;
    if (league === "NFL" && (homeRecord.ties || 0) > 0) homeRecordString += `-${homeRecord.ties}`;
    if (league === "NHL") homeRecordString += `-${homeRecord.otLosses || 0} (${homeRecord.points || 0} pts)`;

    let awayRecordString = `${awayRecord.wins}-${awayRecord.losses}`;
    if (league === "NFL" && (awayRecord.ties || 0) > 0) awayRecordString += `-${awayRecord.ties}`;
    if (league === "NHL") awayRecordString += `-${awayRecord.otLosses || 0} (${awayRecord.points || 0} pts)`;

    const isToday = getGameDateInToronto(game.date) === todayToronto;

    return {
      ...analysis,
      homeBrand,
      awayBrand,
      homeRecordString,
      awayRecordString,
      venue: game.venue,
      broadcast: game.broadcast || "Live Stream / Network",
      isToday,
    };
  });

  // Sort in chronological order
  enrichedGames.sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());

  return {
    todayDateToronto: todayToronto,
    effectiveDate,
    isUpcomingOnly,
    statusMessage,
    league: leagueFilter,
    total: enrichedGames.length,
    games: enrichedGames,
  };
}
