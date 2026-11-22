"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  Award,
  ArrowUpDown,
  X,
  ExternalLink,
  Target,
  Sparkles,
  DollarSign,
  MapPin,
  Tv,
} from "lucide-react";
import { EnrichedTodayGame, TodayGamesResponse } from "@/lib/today-games-service";

export default function TodaysGamesDashboard() {
  const [timeHorizon, setTimeHorizon] = useState<
    "TODAY_NFL" | "TODAY_NHL" | "ALL" | "TOMORROW" | "THIS_WEEK"
  >("ALL");
  const [sortBy, setSortBy] = useState<"time" | "prob" | "closest" | "value">("time");
  const [data, setData] = useState<TodayGamesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameForModal, setSelectedGameForModal] = useState<EnrichedTodayGame | null>(null);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>("");

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/today-games?timeHorizon=${timeHorizon}&sortBy=${sortBy}`);
      if (!res.ok) throw new Error("Failed to load game matchups");
      const json: TodayGamesResponse = await res.json();
      setData(json);
      setLastRefreshedTime(
        new Date().toLocaleTimeString("en-US", { timeZone: "America/Toronto" }) + " ET"
      );
    } catch (err: any) {
      setError(err.message || "Unable to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [timeHorizon, sortBy]);

  return (
    <section id="todays-games" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>GAME-DAY SIDE-BY-SIDE MATCHUP PREDICTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Official Game Day Slate &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                AI Win Probabilities
              </span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Side-by-side comparative analysis of every scheduled NFL &amp; NHL matchup. Away team on the left, Home team on the right. Probabilities mathematically sum to 100% with full overtime/shootout modeling for hockey.
            </p>
          </div>

          {/* Time Zone & Manual Refresh Button */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>America/Toronto (Eastern Time)</span>
            </div>
            {lastRefreshedTime && (
              <span className="text-[11px] text-slate-400">
                Last verified sync: <span className="text-emerald-400 font-medium">{lastRefreshedTime}</span>
              </span>
            )}
            <button
              onClick={fetchGames}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white transition font-bold shadow-md shadow-emerald-950/40 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Syncing..." : "Refresh Live Matchups"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setTimeHorizon("TODAY_NFL")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                timeHorizon === "TODAY_NFL"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🏈 Today's NFL Games</span>
            </button>

            <button
              onClick={() => setTimeHorizon("TODAY_NHL")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                timeHorizon === "TODAY_NHL"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🏒 Today's NHL Games</span>
            </button>

            <button
              onClick={() => setTimeHorizon("ALL")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                timeHorizon === "ALL"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>All Games</span>
            </button>

            <button
              onClick={() => setTimeHorizon("TOMORROW")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                timeHorizon === "TOMORROW"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Tomorrow</span>
            </button>

            <button
              onClick={() => setTimeHorizon("THIS_WEEK")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                timeHorizon === "THIS_WEEK"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>This Week</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" /> Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="time">Game Starting Time</option>
              <option value="prob">Highest Win Probability</option>
              <option value="closest">Closest Matchup</option>
              <option value="value">Highest Estimated Betting Value (+EV)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fallback Banner when displaying upcoming games */}
      {data?.isUpcomingOnly && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
              Schedule Horizon Notice
            </div>
            <p className="text-xs text-slate-300">{data.statusMessage}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse p-6" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
          <p className="text-sm font-bold text-red-300">{error}</p>
          <button
            onClick={fetchGames}
            className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/30 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Side-by-Side Matchups Grid */}
      {data && data.games.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {data.games.map((game) => {
            const homeIsFavored = game.homeWinProbability >= game.awayWinProbability;
            const awayIsFavored = game.awayWinProbability > game.homeWinProbability;

            return (
              <div
                key={game.gameId}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Matchup Header: League, Time, Location & Status */}
                <div className="p-3.5 sm:p-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded font-black uppercase text-[10px] tracking-wider ${
                        game.league === "NFL"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {game.league}
                    </span>
                    <span className="font-semibold text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {game.formattedTimeToronto}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      {game.venue}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
                        game.gameStatus === "LIVE"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                          : game.gameStatus === "FINAL"
                          ? "bg-slate-700 text-slate-300"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {game.gameStatus}
                    </span>
                  </div>
                </div>

                {/* SIDE-BY-SIDE MATCHUP DISPLAY (Mobile & Desktop 2-Column Grid) */}
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 items-stretch">
                    {/* LEFT SIDE: AWAY TEAM */}
                    <div
                      className={`p-3 sm:p-4 rounded-xl border flex flex-col justify-between transition ${
                        awayIsFavored
                          ? "bg-gradient-to-b from-emerald-950/30 to-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-950/20"
                          : "bg-slate-950/60 border-slate-800/80"
                      }`}
                    >
                      <div>
                        {/* Away Badge Header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            AWAY
                          </span>
                          {awayIsFavored && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                              FAVORED
                            </span>
                          )}
                        </div>

                        {/* Team Logo & Name */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2.5">
                          {game.awayBrand.logoUrl ? (
                            <img
                              src={game.awayBrand.logoUrl}
                              alt={game.awayTeamName}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0 drop-shadow"
                              onError={(e) => {
                                // Fallback to styled badge if CDN is blocked
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : null}
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shadow-md border border-white/10 shrink-0"
                            style={{
                              backgroundColor: game.awayBrand.primaryColor,
                              color: game.awayBrand.textColor,
                            }}
                          >
                            {game.awayTeam}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-base font-extrabold text-white truncate leading-tight">
                              {game.awayTeamName}
                            </h3>
                            <div className="text-[10px] sm:text-xs text-slate-400 font-mono">
                              Rec: <span className="text-slate-200 font-bold">{game.awayRecordString}</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Win Probability */}
                        <div className="mb-3 bg-slate-900/90 p-2 sm:p-2.5 rounded-lg border border-slate-800 text-center">
                          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">
                            AI Win Probability
                          </div>
                          <div
                            className={`text-lg sm:text-2xl font-black font-mono ${
                              awayIsFavored ? "text-emerald-400" : "text-slate-300"
                            }`}
                          >
                            {game.awayWinProbability}%
                          </div>
                        </div>

                        {/* Sportsbook Moneyline Odds */}
                        <div className="flex items-center justify-between text-xs py-1 border-t border-slate-800/60 mb-2">
                          <span className="text-slate-400 text-[11px]">Moneyline</span>
                          <span className="font-mono font-bold text-white text-[12px]">
                            {game.oddsDetails.awayMoneyline !== null
                              ? game.oddsDetails.awayMoneyline > 0
                                ? `+${game.oddsDetails.awayMoneyline}`
                                : game.oddsDetails.awayMoneyline
                              : "Odds Unavailable"}
                          </span>
                        </div>

                        {/* Starting QB / Goaltender */}
                        <div className="text-[10px] sm:text-[11px] text-slate-300 space-y-0.5 mb-2">
                          <div className="text-slate-400 font-semibold flex items-center gap-1">
                            {game.league === "NFL" ? <Zap className="w-3 h-3 text-amber-400" /> : <Shield className="w-3 h-3 text-blue-400" />}
                            <span>{game.awayStarter.role}:</span>
                          </div>
                          <div className="font-bold text-white truncate">{game.awayStarter.name}</div>
                          <div className="text-[9px] text-slate-400 truncate">{game.awayStarter.statLine}</div>
                        </div>

                        {/* Injury Count */}
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] pt-1.5 border-t border-slate-800/60 mb-2">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Activity className="w-3 h-3 text-amber-400" /> Injuries:
                          </span>
                          <span
                            className={`font-bold ${
                              game.awayInjuriesCount > 0 ? "text-amber-400" : "text-emerald-400"
                            }`}
                          >
                            {game.awayInjuriesCount > 0
                              ? `${game.awayInjuriesCount} Key Player${game.awayInjuriesCount > 1 ? "s" : ""}`
                              : "0 (Clean)"}
                          </span>
                        </div>

                        {/* Recent 5 Games */}
                        <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/60">
                          <span className="text-slate-400">Last 5:</span>
                          <div className="flex items-center gap-1">
                            {game.awayRecent5.map((res, idx) => (
                              <span
                                key={idx}
                                className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center font-mono ${
                                  res === "W"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                }`}
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE: HOME TEAM */}
                    <div
                      className={`p-3 sm:p-4 rounded-xl border flex flex-col justify-between transition ${
                        homeIsFavored
                          ? "bg-gradient-to-b from-emerald-950/30 to-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-950/20"
                          : "bg-slate-950/60 border-slate-800/80"
                      }`}
                    >
                      <div>
                        {/* Home Badge Header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            HOME
                          </span>
                          {homeIsFavored && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                              FAVORED
                            </span>
                          )}
                        </div>

                        {/* Team Logo & Name */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2.5">
                          {game.homeBrand.logoUrl ? (
                            <img
                              src={game.homeBrand.logoUrl}
                              alt={game.homeTeamName}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0 drop-shadow"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : null}
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shadow-md border border-white/10 shrink-0"
                            style={{
                              backgroundColor: game.homeBrand.primaryColor,
                              color: game.homeBrand.textColor,
                            }}
                          >
                            {game.homeTeam}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-base font-extrabold text-white truncate leading-tight">
                              {game.homeTeamName}
                            </h3>
                            <div className="text-[10px] sm:text-xs text-slate-400 font-mono">
                              Rec: <span className="text-slate-200 font-bold">{game.homeRecordString}</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Win Probability */}
                        <div className="mb-3 bg-slate-900/90 p-2 sm:p-2.5 rounded-lg border border-slate-800 text-center">
                          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">
                            AI Win Probability
                          </div>
                          <div
                            className={`text-lg sm:text-2xl font-black font-mono ${
                              homeIsFavored ? "text-emerald-400" : "text-slate-300"
                            }`}
                          >
                            {game.homeWinProbability}%
                          </div>
                        </div>

                        {/* Sportsbook Moneyline Odds */}
                        <div className="flex items-center justify-between text-xs py-1 border-t border-slate-800/60 mb-2">
                          <span className="text-slate-400 text-[11px]">Moneyline</span>
                          <span className="font-mono font-bold text-white text-[12px]">
                            {game.oddsDetails.homeMoneyline !== null
                              ? game.oddsDetails.homeMoneyline > 0
                                ? `+${game.oddsDetails.homeMoneyline}`
                                : game.oddsDetails.homeMoneyline
                              : "Odds Unavailable"}
                          </span>
                        </div>

                        {/* Starting QB / Goaltender */}
                        <div className="text-[10px] sm:text-[11px] text-slate-300 space-y-0.5 mb-2">
                          <div className="text-slate-400 font-semibold flex items-center gap-1">
                            {game.league === "NFL" ? <Zap className="w-3 h-3 text-amber-400" /> : <Shield className="w-3 h-3 text-blue-400" />}
                            <span>{game.homeStarter.role}:</span>
                          </div>
                          <div className="font-bold text-white truncate">{game.homeStarter.name}</div>
                          <div className="text-[9px] text-slate-400 truncate">{game.homeStarter.statLine}</div>
                        </div>

                        {/* Injury Count */}
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] pt-1.5 border-t border-slate-800/60 mb-2">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Activity className="w-3 h-3 text-amber-400" /> Injuries:
                          </span>
                          <span
                            className={`font-bold ${
                              game.homeInjuriesCount > 0 ? "text-amber-400" : "text-emerald-400"
                            }`}
                          >
                            {game.homeInjuriesCount > 0
                              ? `${game.homeInjuriesCount} Key Player${game.homeInjuriesCount > 1 ? "s" : ""}`
                              : "0 (Clean)"}
                          </span>
                        </div>

                        {/* Recent 5 Games */}
                        <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/60">
                          <span className="text-slate-400">Last 5:</span>
                          <div className="flex items-center gap-1">
                            {game.homeRecent5.map((res, idx) => (
                              <span
                                key={idx}
                                className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center font-mono ${
                                  res === "W"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                }`}
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CENTRE / BOTTOM METRICS: Visual Probability Bar & Predicted Winner */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2.5">
                    {/* Visual Probability Bar (Sums to 100%) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className={awayIsFavored ? "text-emerald-400" : "text-slate-400"}>
                          {game.awayTeam} {game.awayWinProbability}%
                        </span>
                        <span className="text-slate-500 font-sans text-[10px]">
                          Full Game Win Probability (100%)
                        </span>
                        <span className={homeIsFavored ? "text-emerald-400" : "text-slate-400"}>
                          {game.homeWinProbability}% {game.homeTeam}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 shadow-inner">
                        <div
                          style={{ width: `${game.awayWinProbability}%` }}
                          className={`transition-all duration-500 ${
                            awayIsFavored ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-slate-700"
                          }`}
                        />
                        <div
                          style={{ width: `${game.homeWinProbability}%` }}
                          className={`transition-all duration-500 ${
                            homeIsFavored ? "bg-gradient-to-r from-teal-400 to-emerald-500" : "bg-slate-700"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Predicted Winner Banner */}
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs text-slate-300">
                          AI Predicted Winner:{" "}
                          <strong className="text-white font-extrabold">{game.predictedWinnerName}</strong>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">
                          ({Math.max(game.homeWinProbability, game.awayWinProbability)}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Score: <strong className="text-white font-mono">{game.predictedScore}</strong></span>
                        <span>•</span>
                        <span>Quality: <strong className="text-emerald-400">{game.dataQuality}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matchup Details Modal Trigger Button */}
                <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Tv className="w-3 h-3 text-slate-500" />
                    {game.broadcast}
                  </span>
                  <button
                    onClick={() => setSelectedGameForModal(game)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1 text-[11px] border border-slate-700"
                  >
                    <span>Click for Detailed Comparison</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED MATCHUP COMPARISON MODAL */}
      {selectedGameForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedGameForModal.league} • Matchup Intelligence Analysis
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedGameForModal.awayTeamName} @ {selectedGameForModal.homeTeamName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedGameForModal.formattedTimeToronto} • {selectedGameForModal.venue}
                </p>
              </div>
              <button
                onClick={() => setSelectedGameForModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Model Estimated Probability & Score */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Predicted Winner</div>
                <div className="text-base font-black text-white mt-0.5">{selectedGameForModal.predictedWinnerName}</div>
                <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                  {Math.max(selectedGameForModal.homeWinProbability, selectedGameForModal.awayWinProbability)}% Win Probability
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Projected Score</div>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  {selectedGameForModal.predictedScore}
                </div>
                <div className="text-xs text-slate-400 mt-1">Confidence: {selectedGameForModal.confidence}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Betting Value</div>
                <div className="text-base font-black text-white mt-0.5">
                  {selectedGameForModal.bettingValueDetails.recommendedSide}
                </div>
                <div
                  className={`text-xs font-mono font-bold mt-1 ${
                    selectedGameForModal.bettingValueDetails.evPer100 > 0 ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {selectedGameForModal.bettingValueDetails.evPer100 > 0
                    ? `+$${selectedGameForModal.bettingValueDetails.evPer100.toFixed(2)} EV / $100`
                    : "NO BET / PASS"}
                </div>
              </div>
            </div>

            {/* Side-by-side Offensive & Defensive Comparison */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Offensive &amp; Defensive Statistical Breakdown
              </h4>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{selectedGameForModal.awayTeam}: {selectedGameForModal.comparisonStats.awayOffense}</span>
                    <span className="font-bold text-white">{selectedGameForModal.comparisonStats.offenseLabel}</span>
                    <span>{selectedGameForModal.comparisonStats.homeOffense} :{selectedGameForModal.homeTeam}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
                    <div style={{ width: "50%" }} className="bg-teal-500 border-r border-slate-900" />
                    <div style={{ width: "50%" }} className="bg-emerald-500" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>{selectedGameForModal.awayTeam}: {selectedGameForModal.comparisonStats.awayDefense}</span>
                    <span className="font-bold text-white">{selectedGameForModal.comparisonStats.defenseLabel}</span>
                    <span>{selectedGameForModal.comparisonStats.homeDefense} :{selectedGameForModal.homeTeam}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
                    <div style={{ width: "50%" }} className="bg-teal-500 border-r border-slate-900" />
                    <div style={{ width: "50%" }} className="bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Injuries & Player Availability */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Current Player Injuries &amp; Availability
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white">{selectedGameForModal.awayTeamName}</div>
                  {selectedGameForModal.awayKeyInjuries.length === 0 ? (
                    <div className="text-emerald-400 text-[11px]">No significant injuries reported.</div>
                  ) : (
                    selectedGameForModal.awayKeyInjuries.map((inj, i) => (
                      <div key={i} className="text-slate-300 text-[11px] flex justify-between">
                        <span>{inj.name} ({inj.position})</span>
                        <span className="text-amber-400 font-bold">{inj.status}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white">{selectedGameForModal.homeTeamName}</div>
                  {selectedGameForModal.homeKeyInjuries.length === 0 ? (
                    <div className="text-emerald-400 text-[11px]">No significant injuries reported.</div>
                  ) : (
                    selectedGameForModal.homeKeyInjuries.map((inj, i) => (
                      <div key={i} className="text-slate-300 text-[11px] flex justify-between">
                        <span>{inj.name} ({inj.position})</span>
                        <span className="text-amber-400 font-bold">{inj.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Betting Odds History & Line Movement */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Sportsbook Odds History &amp; Movement
              </h4>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Opening Line:</span>{" "}
                  {selectedGameForModal.oddsDetails.openingAway
                    ? `${selectedGameForModal.awayTeam} (${selectedGameForModal.oddsDetails.openingAway > 0 ? `+${selectedGameForModal.oddsDetails.openingAway}` : selectedGameForModal.oddsDetails.openingAway}) / ${selectedGameForModal.homeTeam} (${selectedGameForModal.oddsDetails.openingHome ? (selectedGameForModal.oddsDetails.openingHome > 0 ? `+${selectedGameForModal.oddsDetails.openingHome}` : selectedGameForModal.oddsDetails.openingHome) : "N/A"})`
                    : "Market Open at consensus"}
                </div>
                <div className="text-emerald-400 font-bold">
                  {selectedGameForModal.oddsDetails.lineMovement}
                </div>
              </div>
            </div>

            {/* Decision Factors Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                AI Prediction Explanation
              </h4>
              <div className="space-y-1.5">
                {selectedGameForModal.factors.map((factor, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-0.5">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{factor.name}</span>
                      <span className="text-emerald-400">+{factor.impactPct}% ({factor.advantage})</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{factor.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Data Quality: {selectedGameForModal.dataQuality}</span>
              <span>Last Recalculated: {selectedGameForModal.formattedTimeToronto}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
