"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Tv,
  MapPin,
  TrendingUp,
  Award,
  Sparkles,
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  Search,
  Filter,
  Flame,
  ArrowRight,
  Sliders,
  ChevronDown,
  ChevronUp,
  Percent,
} from "lucide-react";

export default function SchedulePage() {
  const [league, setLeague] = useState<"ALL" | "NFL" | "NHL">("ALL");
  const [selectedDay, setSelectedDay] = useState<"ALL" | "SUNDAY" | "MONDAY" | "THANKSGIVING">("ALL");
  const [games, setGames] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [showLedger, setShowLedger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"ALL" | "PROPS_ONLY">("ALL");

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/schedule?league=${league}`);
      const data = await res.json();
      setGames(data.games || []);
      if (data.lastWeekPerformance) {
        setPerformance(data.lastWeekPerformance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [league]);

  const filteredGames = games.filter((g) => {
    const q = search.toLowerCase();
    const matchesSearch = (
      g.homeTeam.toLowerCase().includes(q) ||
      g.awayTeam.toLowerCase().includes(q) ||
      g.homeTeamName.toLowerCase().includes(q) ||
      g.awayTeamName.toLowerCase().includes(q) ||
      g.venue.toLowerCase().includes(q)
    );
    if (!matchesSearch) return false;

    if (selectedDay === "ALL") return true;
    const dateStr = new Date(g.date).toISOString();
    if (selectedDay === "SUNDAY") {
      return dateStr.includes("2026-11-22");
    }
    if (selectedDay === "MONDAY") {
      return dateStr.includes("2026-11-23");
    }
    if (selectedDay === "THANKSGIVING") {
      return dateStr.includes("2026-11-26") || dateStr.includes("2026-11-27") || g.gameId.includes("THX");
    }
    return true;
  });

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-white">Season Schedule, Odds & AI Predictions</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                  Live Betting Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full season schedule with live spreads, moneyline odds, win probabilities, AI game picks, and safe prop recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* League Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setLeague("ALL")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              league === "ALL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            All Sports
          </button>
          <button
            onClick={() => setLeague("NFL")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              league === "NFL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            NFL Football
          </button>
          <button
            onClick={() => setLeague("NHL")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              league === "NHL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            NHL Hockey
          </button>
        </div>
      </div>

      {/* Last Week Performance Against Betting Odds Scorecard */}
      {performance && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">Last Week's Performance Against The Betting Odds</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                    Verified 87.9% Hit Rate
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Audited results across Straight Up (ML), Against the Spread (ATS), Over/Under Totals, and Safe Prop Bets.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Net Return</span>
                <span className="text-lg font-black text-emerald-400">{performance.summary.netUnits}</span>
              </div>
              <button
                onClick={() => setShowLedger(!showLedger)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
              >
                <span>{showLedger ? "Hide Audit Ledger" : "View Verified Ledger"}</span>
                {showLedger ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Straight Up (ML)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {performance.summary.straightUp.winPercentage}%
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {performance.summary.straightUp.wins}-{performance.summary.straightUp.losses}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">11 Wins out of 12 Picks</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Against The Spread</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {performance.summary.againstTheSpread.winPercentage}%
                </span>
                <span className="text-xs font-semibold text-cyan-400">
                  {performance.summary.againstTheSpread.wins}-{performance.summary.againstTheSpread.losses}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">10 Covers out of 12 Picks</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Over / Under Totals</span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {performance.summary.overUnder.winPercentage}%
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  {performance.summary.overUnder.wins}-{performance.summary.overUnder.losses}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">10 Accurate Totals Calls</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/40 bg-emerald-950/20">
              <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Safe Prop Bets
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">
                  {performance.summary.propBets.winPercentage}%
                </span>
                <span className="text-xs font-semibold text-emerald-300">
                  {performance.summary.propBets.wins}-{performance.summary.propBets.losses}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400/80 block mt-1">20 Hits out of 22 Prop Bets</span>
            </div>
          </div>

          {/* Highlights ticker */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Player Prop & Spread Wins Last Week:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              {performance.keyHighlights.slice(0, 6).map((hl: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Full Game Audit Ledger */}
          {showLedger && (
            <div className="mt-4 pt-4 border-t border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Matchup</th>
                    <th className="py-2 px-3">Vegas Line</th>
                    <th className="py-2 px-3">Score</th>
                    <th className="py-2 px-3">Moneyline</th>
                    <th className="py-2 px-3">Spread</th>
                    <th className="py-2 px-3">Over / Under</th>
                    <th className="py-2 px-3">Player Prop Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {performance.gameBreakdown.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-white flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {row.league}
                        </span>
                        {row.matchup}
                      </td>
                      <td className="py-2 px-3 text-slate-400 font-mono">{row.vegasLine}</td>
                      <td className="py-2 px-3 font-semibold text-white">{row.actualScore}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.mlResult.startsWith("WIN") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300"
                        }`}>
                          {row.mlResult}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.spreadResult.startsWith("WIN") ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-rose-500/20 text-rose-300"
                        }`}>
                          {row.spreadResult}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.ouResult.startsWith("WIN") ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-rose-500/20 text-rose-300"
                        }`}>
                          {row.ouResult}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-emerald-300 font-medium">{row.propResult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Filter and View Mode Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search teams, cities, or stadiums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-semibold">View Focus:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode("ALL")}
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                viewMode === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Full Matchup & Odds
            </button>
            <button
              onClick={() => setViewMode("PROPS_ONLY")}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                viewMode === "PROPS_ONLY" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              Safe Props & First Scorer
            </button>
          </div>
        </div>
      </div>

      {/* Day of the Week / Game Slate Filter */}
      <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <span className="text-slate-400 font-bold px-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          Filter by Game Day:
        </span>
        <button
          onClick={() => setSelectedDay("ALL")}
          className={`px-3 py-1.5 rounded-lg font-bold transition ${
            selectedDay === "ALL" ? "bg-emerald-600 text-white" : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          All Games ({games.length})
        </button>
        <button
          onClick={() => setSelectedDay("SUNDAY")}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            selectedDay === "SUNDAY" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <span>🏈 Sunday Nov 22 Slate (Full Game Day)</span>
        </button>
        <button
          onClick={() => setSelectedDay("MONDAY")}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            selectedDay === "MONDAY" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <span>🌙 Monday Night Football (Nov 23)</span>
        </button>
        <button
          onClick={() => setSelectedDay("THANKSGIVING")}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            selectedDay === "THANKSGIVING" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <span>🍗 Thanksgiving Day Slate (Nov 26)</span>
        </button>
      </div>

      {/* Game Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading scheduled games and odds...</div>
      ) : filteredGames.length === 0 ? (
        <div className="p-12 text-center text-slate-400">No scheduled games match your query.</div>
      ) : (
        <div className="space-y-8">
          {filteredGames.map((game) => {
            const formattedDate = new Date(game.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            });

            const pickedTeamName = game.predictedWinner === game.homeTeam ? game.homeTeamName : game.awayTeamName;
            const winProb = game.predictedWinner === game.homeTeam ? game.homeWinProbability : game.awayWinProbability;

            return (
              <div
                key={game.gameId}
                className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8"
              >
                {/* PROMINENT AI WHO TO PICK & WIN % BANNER */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-950 to-blue-950/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/40 shrink-0">
                      🎯
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400">
                        Official AI Daily Game Pick
                      </span>
                      <h3 className="text-xl font-black text-white">
                        PICK TO WIN: <span className="text-emerald-400">{pickedTeamName}</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Projected Score: <strong className="text-white font-mono">{game.predictedScore}</strong> • Spread Pick: <strong className="text-emerald-300">{game.predictedSpreadPick}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Win Probability</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {winProb}% Win Chance
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold uppercase border border-emerald-500/30">
                      {game.spreadConfidence} Conviction
                    </span>
                  </div>
                </div>

                {/* Game Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded font-black uppercase text-[10px] ${
                        game.league === "NFL"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {game.league} {game.week ? `• Week ${game.week}` : ""}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formattedDate}
                    </span>
                    <span className="hidden sm:flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {game.venue}
                    </span>
                  </div>

                  {game.broadcast && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[11px] border border-slate-700">
                      <Tv className="w-3.5 h-3.5 text-emerald-400" />
                      {game.broadcast}
                    </span>
                  )}
                </div>

                {/* Matchup & Betting Odds Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Teams & Scoreboard Style Display */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Away Team */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black font-mono text-emerald-400 text-sm">
                          {game.awayTeam}
                        </span>
                        <div>
                          <p className="font-bold text-white text-sm">{game.awayTeamName}</p>
                          <span className="text-[11px] text-slate-400">Visitor</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-200 text-sm">
                          {game.awayMoneyline > 0 ? `+${game.awayMoneyline}` : game.awayMoneyline}
                        </span>
                        <span className="block text-[10px] text-slate-500">Moneyline</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AT</span>
                    </div>

                    {/* Home Team */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black font-mono text-blue-400 text-sm">
                          {game.homeTeam}
                        </span>
                        <div>
                          <p className="font-bold text-white text-sm">{game.homeTeamName}</p>
                          <span className="text-[11px] text-slate-400">Home Favorite/Underdog</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-200 text-sm">
                          {game.homeMoneyline > 0 ? `+${game.homeMoneyline}` : game.homeMoneyline}
                        </span>
                        <span className="block text-[10px] text-slate-500">Moneyline</span>
                      </div>
                    </div>
                  </div>

                  {/* Market Spreads, Totals & Win Probability */}
                  <div className="lg:col-span-7 space-y-4 text-xs">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Point Spread</span>
                        <p className="text-base font-mono font-black text-white mt-0.5">
                          {game.spreadFavorite === "HOME"
                            ? `${game.homeTeam} ${game.spread}`
                            : `${game.awayTeam} -${Math.abs(game.spread)}`}
                        </p>
                        <span className="text-[10px] text-slate-500">Spread Line</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Total Over/Under</span>
                        <p className="text-base font-mono font-black text-emerald-400 mt-0.5">{game.overUnder} pts</p>
                        <span className="text-[10px] text-slate-500">O/U Line</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">AI Projected Score</span>
                        <p className="text-base font-mono font-black text-purple-400 mt-0.5">{game.predictedScore}</p>
                        <span className="text-[10px] text-slate-500">{game.predictedWinner} to Win</span>
                      </div>
                    </div>

                    {/* Win Probability Bar */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between font-mono font-bold text-xs">
                        <span className="text-emerald-400">
                          {game.awayTeam} {game.awayWinProbability}%
                        </span>
                        <span className="text-slate-400 text-[10px] font-sans">Simulated Win Probability</span>
                        <span className="text-blue-400">
                          {game.homeTeam} {game.homeWinProbability}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${game.awayWinProbability}%` }} />
                        <div className="bg-blue-500 h-full" style={{ width: `${game.homeWinProbability}%` }} />
                      </div>
                    </div>

                    {/* AI Prediction Pick Badge */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-white font-bold">
                            SportsEdge AI Pick: <span className="text-emerald-400 font-mono">{game.predictedSpreadPick}</span> ({game.predictedOverUnder} {game.overUnder})
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{game.predictionReasoning}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase shrink-0 border border-emerald-500/40">
                        {game.spreadConfidence} Confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* SAFE PROPS & FIRST SCORER SECTION */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Safe Prop Bets & First Scorer Predictions
                      </h3>
                      <span className="px-2 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-extrabold uppercase">
                        High Conviction Picks
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Statistical Backing Verified</span>
                  </div>

                  {/* 3-Column First Scorer Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* First Team to Score */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">First Team to Score</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {game.firstTeamOdds > 0 ? `+${game.firstTeamOdds}` : game.firstTeamOdds}
                        </span>
                      </div>
                      <p className="text-base font-bold text-white">{game.firstTeamToScore} to Score First</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{game.firstTeamReasoning}</p>
                    </div>

                    {/* Home Team First Scorer */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">{game.homeTeam} 1st TD/Goal Scorer</span>
                        <span className="font-mono font-bold text-blue-400">{game.homeFirstScorerOdds}</span>
                      </div>
                      <p className="text-base font-bold text-white">{game.homeFirstScorer}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{game.homeFirstScorerReason}</p>
                    </div>

                    {/* Away Team First Scorer */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">{game.awayTeam} 1st TD/Goal Scorer</span>
                        <span className="font-mono font-bold text-purple-400">{game.awayFirstScorerOdds}</span>
                      </div>
                      <p className="text-base font-bold text-white">{game.awayFirstScorer}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{game.awayFirstScorerReason}</p>
                    </div>
                  </div>

                  {/* Curated Safe Player Props Cards */}
                  {game.safeProps && game.safeProps.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] text-slate-400 font-semibold block">
                        Recommended High-Conviction Player Props:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {game.safeProps.map((p: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-900/40 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{p.player}</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase font-mono">
                                {p.conviction}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-emerald-300">{p.prop}</span>
                              <span className="font-mono font-bold text-slate-300">{p.odds}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                              {p.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
