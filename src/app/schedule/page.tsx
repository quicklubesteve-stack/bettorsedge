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
} from "lucide-react";

export default function SchedulePage() {
  const [league, setLeague] = useState<"ALL" | "NFL" | "NHL">("ALL");
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"ALL" | "PROPS_ONLY">("ALL");

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/schedule?league=${league}`);
      const data = await res.json();
      setGames(data.games || []);
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
    return (
      g.homeTeam.toLowerCase().includes(q) ||
      g.awayTeam.toLowerCase().includes(q) ||
      g.homeTeamName.toLowerCase().includes(q) ||
      g.awayTeamName.toLowerCase().includes(q) ||
      g.venue.toLowerCase().includes(q)
    );
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

            return (
              <div
                key={game.gameId}
                className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8"
              >
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
