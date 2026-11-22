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
} from "lucide-react";
import { EnrichedTodayGame, TodayGamesResponse } from "@/lib/today-games-service";

export default function TodaysGamesDashboard() {
  const [activeTab, setActiveTab] = useState<"ALL" | "NFL" | "NHL">("ALL");
  const [data, setData] = useState<TodayGamesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>("");

  const fetchGames = async (league: "ALL" | "NFL" | "NHL") => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/today-games?league=${league}`);
      if (!res.ok) throw new Error("Failed to load today's games");
      const json: TodayGamesResponse = await res.json();
      setData(json);
      setLastRefreshedTime(new Date().toLocaleTimeString("en-US", { timeZone: "America/Toronto" }) + " ET");
    } catch (err: any) {
      setError(err.message || "Unable to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(activeTab);
  }, [activeTab]);

  const toggleExpand = (gameId: string) => {
    setExpandedGameId((prev) => (prev === gameId ? null : gameId));
  };

  return (
    <section id="todays-games" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TODAY'S GAMES &amp; AI PREDICTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Official Game Day Slate &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Win Probabilities
              </span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time multi-factor Bayesian win projections for every scheduled matchup. Evaluated against verified starter depth charts, starting quarterbacks &amp; goaltenders, injury reports, and line movements.
            </p>
          </div>

          {/* Time Zone & Refresh Badge */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>America/Toronto (Eastern Time)</span>
            </div>
            {lastRefreshedTime && (
              <span className="text-[11px] text-slate-400">
                Last synced: <span className="text-emerald-400 font-medium">{lastRefreshedTime}</span>
              </span>
            )}
            <button
              onClick={() => fetchGames(activeTab)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              <span>Refresh Predictions</span>
            </button>
          </div>
        </div>

        {/* League Tabs */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-950/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "ALL"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>All Games</span>
            </button>
            <button
              onClick={() => setActiveTab("NFL")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "NFL"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🏈 NFL Games</span>
            </button>
            <button
              onClick={() => setActiveTab("NHL")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "NHL"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🏒 NHL Games</span>
            </button>
          </div>

          {data && (
            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-bold">{data.total}</span> games in chronological order
            </div>
          )}
        </div>
      </div>

      {/* Fallback Banner when displaying upcoming games */}
      {data?.isUpcomingOnly && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              Upcoming Schedule Notice
            </div>
            <p className="text-xs text-slate-300">
              {data.statusMessage}
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse p-6" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
          <p className="text-sm font-bold text-red-300">{error}</p>
          <button
            onClick={() => fetchGames(activeTab)}
            className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/30 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Game Cards Grid */}
      {data && data.games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.games.map((game) => {
            const isExpanded = expandedGameId === game.gameId;
            const homeIsFavored = game.homeWinProbability >= game.awayWinProbability;

            return (
              <div
                key={game.gameId}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Game Card Header */}
                <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md font-extrabold uppercase text-[10px] tracking-wider ${
                        game.league === "NFL"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {game.league}
                    </span>
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {game.formattedTimeToronto}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                        game.gameStatus === "LIVE"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                          : game.gameStatus === "FINAL"
                          ? "bg-slate-700 text-slate-300"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {game.gameStatus}
                    </span>

                    <span className="text-[10px] text-slate-400 hidden sm:inline-block">
                      {game.broadcast}
                    </span>
                  </div>
                </div>

                {/* Matchup Teams Banner */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    {/* Away Team */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {/* Team Badge Logo */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-lg border border-white/10 shrink-0"
                          style={{
                            backgroundColor: game.awayBrand.primaryColor,
                            color: game.awayBrand.textColor,
                          }}
                        >
                          {game.awayTeam}
                        </div>
                        <div className="min-w-0">
                          <div className="text-base font-extrabold text-white truncate">
                            {game.awayTeamName}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Rec: <span className="text-slate-200">{game.awayRecordString}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span>Moneyline</span>
                        <span className="font-mono font-bold text-slate-200">
                          {game.awayMoneyline
                            ? (game.awayMoneyline > 0 ? `+${game.awayMoneyline}` : game.awayMoneyline)
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Home Team */}
                    <div className="space-y-2 border-l border-slate-800/80 pl-4">
                      <div className="flex items-center gap-3">
                        {/* Team Badge Logo */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-lg border border-white/10 shrink-0"
                          style={{
                            backgroundColor: game.homeBrand.primaryColor,
                            color: game.homeBrand.textColor,
                          }}
                        >
                          {game.homeTeam}
                        </div>
                        <div className="min-w-0">
                          <div className="text-base font-extrabold text-white truncate">
                            {game.homeTeamName}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Rec: <span className="text-slate-200">{game.homeRecordString}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span>Moneyline</span>
                        <span className="font-mono font-bold text-slate-200">
                          {game.homeMoneyline
                            ? (game.homeMoneyline > 0 ? `+${game.homeMoneyline}` : game.homeMoneyline)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Predicted Winner & Projected Score Hero Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                          Official AI Predicted Winner
                        </div>
                        <div className="text-sm font-black text-white">
                          {game.predictedWinnerName}{" "}
                          <span className="text-emerald-400 text-xs">
                            ({Math.max(game.homeWinProbability, game.awayWinProbability)}% Win Prob)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Projected Score
                        </div>
                        <div className="text-sm font-black text-white font-mono">
                          {game.predictedScore}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase border ${
                          game.confidence === "HIGH"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : game.confidence === "MODERATE"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {game.confidence} Conf
                      </span>
                    </div>
                  </div>

                  {/* Dual Win Probability Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={!homeIsFavored ? "text-emerald-400 font-bold" : "text-slate-400"}>
                        {game.awayTeam}: {game.awayWinProbability}%
                      </span>
                      <span className="text-[11px] text-slate-400">AI Win Probability</span>
                      <span className={homeIsFavored ? "text-emerald-400 font-bold" : "text-slate-400"}>
                        {game.homeTeam}: {game.homeWinProbability}%
                      </span>
                    </div>

                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${game.awayWinProbability}%` }}
                        className={`transition-all duration-500 ${
                          !homeIsFavored ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-slate-600"
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

                  {/* Injury Impact Callout */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                        Injury Impact Monitor
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          game.injuryImpact.homeImpactSeverity === "CRITICAL" ||
                          game.injuryImpact.awayImpactSeverity === "CRITICAL"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {game.injuryImpact.keyInjuries.length > 0
                          ? `${game.injuryImpact.keyInjuries.length} Key Injury Alert`
                          : "Lineups Clean"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {game.injuryImpact.summary}
                    </p>
                  </div>
                </div>

                {/* Expandable Decision Factors Drawer */}
                <div className="border-t border-slate-800 bg-slate-950/40">
                  <button
                    onClick={() => toggleExpand(game.gameId)}
                    className="w-full p-3 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition flex items-center justify-center gap-1.5"
                  >
                    <span>{isExpanded ? "Hide Matchup Details" : "Inspect Key Factors & Matchup Intel"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/80 text-xs">
                      {/* Quarterback matchup for NFL */}
                      {game.qbMatchup && (
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>Quarterback Matchup</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                            <div>
                              <span className="text-slate-400">{game.awayTeam}:</span> {game.qbMatchup.awayQb.name} ({game.qbMatchup.awayQb.status})
                            </div>
                            <div>
                              <span className="text-slate-400">{game.homeTeam}:</span> {game.qbMatchup.homeQb.name} ({game.qbMatchup.homeQb.status})
                            </div>
                          </div>
                          <div className="text-[10px] text-emerald-400 pt-1">
                            Edge: {game.qbMatchup.edge}
                          </div>
                        </div>
                      )}

                      {/* Goaltender matchup for NHL */}
                      {game.goaltenderMatchup && (
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-blue-400" />
                            <span>Goaltender Matchup</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                            <div>
                              <span className="text-slate-400">{game.awayTeam}:</span> {game.goaltenderMatchup.awayGoalie.name} (.{Math.round(game.goaltenderMatchup.awayGoalie.svPct * 1000)} SV%)
                            </div>
                            <div>
                              <span className="text-slate-400">{game.homeTeam}:</span> {game.goaltenderMatchup.homeGoalie.name} (.{Math.round(game.goaltenderMatchup.homeGoalie.svPct * 1000)} SV%)
                            </div>
                          </div>
                          <div className="text-[10px] text-emerald-400 pt-1">
                            Edge: {game.goaltenderMatchup.edge}
                          </div>
                        </div>
                      )}

                      {/* Model Decision Factors */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Key Bayesian Decision Drivers
                        </div>
                        <div className="space-y-1">
                          {game.factors.map((factor, idx) => (
                            <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-start gap-2 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <div className="font-semibold text-slate-200">
                                  {factor.name} — <span className="text-emerald-400">{factor.advantage} (+{factor.impactPct}%)</span>
                                </div>
                                <p className="text-slate-400 text-[10px]">{factor.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                        <span>Data Quality: <span className="text-emerald-400 font-bold">{game.dataQuality}</span></span>
                        <span>Venue: {game.venue}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
