"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";

export default function NhlPowerPlayPage() {
  const [team, setTeam] = useState("EDM");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(true);
  const [sortBy, setSortBy] = useState<"ppGoals" | "ppPoints" | "ppShots" | "shareTeamPpGoals">("ppPoints");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nhl/power-play?team=${team}&sortBy=${sortBy}`);
      if (res.status === 403) {
        setIsPro(false);
        setLoading(false);
        return;
      }
      setIsPro(true);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [team, sortBy]);

  if (!isPro) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Pro Membership Required</h2>
        <p className="text-slate-400 text-sm">
          NHL Special Teams Intelligence, PP1/PP2 Lineup Tracking, and Scoring Share Tables are reserved for SportsEdge AI Pro members.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/redeem"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Award className="w-4 h-4" /> Redeem Free Gift Code
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
          >
            Upgrade Account
          </Link>
        </div>
      </div>
    );
  }

  const stats = data?.teamStats;

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white">NHL Special Teams Intelligence</h1>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase">
              Pro Feature
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Confirmed & projected power-play units, time on ice distribution, and individual player scoring contributions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Select Team:</span>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-bold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="EDM">Edmonton Oilers (EDM)</option>
            <option value="TOR">Toronto Maple Leafs (TOR)</option>
          </select>
        </div>
      </div>

      {/* SECTION B: POWER-PLAY TEAM STATISTICS */}
      {stats && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Power-Play Team Statistics</h2>
            <span className="text-xs text-slate-400">Season: 2024-2025 Regular Season</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Power-Play %</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.ppPct}%</p>
              <span className="text-[10px] text-slate-500">
                {stats.ppGoals} G / {stats.ppOpportunities} Opps
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">PP Opps / Game</span>
              <p className="text-2xl font-black font-mono text-white">{stats.ppOpportunitiesPerGame}</p>
              <span className="text-[10px] text-slate-500">{stats.ppGoalsPerGame} Goals/Game</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Home PP %</span>
              <p className="text-2xl font-black font-mono text-blue-400">{stats.homePpPct}%</p>
              <span className="text-[10px] text-slate-500">Home arena advantage</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Away PP %</span>
              <p className="text-2xl font-black font-mono text-purple-400">{stats.awayPpPct}%</p>
              <span className="text-[10px] text-slate-500">Road conversion rate</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Last 5 Games (L5)</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.l5PpPct}%</p>
              <span className="text-[10px] text-slate-500">Recent form momentum</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Last 10 Games (L10)</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.l10PpPct}%</p>
              <span className="text-[10px] text-slate-500">10-game sample size</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION A: POWER-PLAY UNIT 1 & 2 ANALYSIS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">A. Power-Play Units (PP1 & PP2)</h2>
          <p className="text-xs text-slate-400">
            Player units with verified status badges. Projected units are clearly labeled and not represented as confirmed game-day rosters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PP1 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="font-bold text-white text-base">Power Play Unit 1 (PP1)</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Top Scoring Unit (~70% PP TOI)</span>
            </div>

            <div className="space-y-3">
              {data?.pp1?.map((player: any) => (
                <div
                  key={player.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{player.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {player.position}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          player.unitStatus === "CONFIRMED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                            : "bg-amber-950 text-amber-400 border border-amber-800/60"
                        }`}
                      >
                        {player.unitStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                      <span>TOI/G: {player.ppTimeOnIcePerGame}m</span>
                      <span>Shots: {player.ppShots} ({player.ppShootingPct}%)</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-bold text-emerald-400 text-sm">
                      {player.ppGoals}G - {player.ppAssists}A ({player.ppPoints}P)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {player.shareTeamPpGoals}% Team PP Goals
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PP2 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <h3 className="font-bold text-white text-base">Power Play Unit 2 (PP2)</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Secondary Unit (~30% PP TOI)</span>
            </div>

            <div className="space-y-3">
              {data?.pp2?.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No secondary unit data available.</p>
              ) : (
                data?.pp2?.map((player: any) => (
                  <div
                    key={player.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{player.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {player.position}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-950 text-amber-400 border border-amber-800/60">
                          {player.unitStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span>TOI/G: {player.ppTimeOnIcePerGame}m</span>
                        <span>Shots: {player.ppShots} ({player.ppShootingPct}%)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-blue-400 text-sm">
                        {player.ppGoals}G - {player.ppAssists}A ({player.ppPoints}P)
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {player.shareTeamPpGoals}% Team PP Goals
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: SCORING CONTRIBUTION TABLE */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">C. Who Usually Scores on the Power Play?</h2>
            <p className="text-xs text-slate-400">
              Player scoring contribution metrics. Note: A player&apos;s past goal share is not their probability of scoring in the upcoming match.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
            >
              <option value="ppPoints">Power-Play Points</option>
              <option value="ppGoals">Power-Play Goals</option>
              <option value="shareTeamPpGoals">Share of Team PP Goals (%)</option>
              <option value="ppShots">PP Shots on Goal</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Player</th>
                <th className="pb-3 font-semibold">Unit</th>
                <th className="pb-3 font-semibold font-mono text-center">PP Goals</th>
                <th className="pb-3 font-semibold font-mono text-center">% of Team PP Goals</th>
                <th className="pb-3 font-semibold font-mono text-center">PP Shots (S%)</th>
                <th className="pb-3 font-semibold font-mono text-center">PP Assists</th>
                <th className="pb-3 font-semibold font-mono text-center">PP Points</th>
                <th className="pb-3 font-semibold font-mono text-right">Avg PP TOI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data?.scoringTable?.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-850/50">
                  <td className="py-3 font-medium text-white flex items-center gap-2">
                    <span>{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({p.position})</span>
                  </td>
                  <td className="py-3 text-slate-400">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        p.unit === "PP1"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-blue-950 text-blue-400 border border-blue-800"
                      }`}
                    >
                      {p.unit}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-400 text-center">{p.ppGoals}</td>
                  <td className="py-3 font-mono font-bold text-white text-center">{p.shareTeamPpGoals}%</td>
                  <td className="py-3 font-mono text-slate-300 text-center">
                    {p.ppShots} ({p.ppShootingPct}%)
                  </td>
                  <td className="py-3 font-mono text-slate-300 text-center">{p.ppAssists}</td>
                  <td className="py-3 font-mono font-bold text-purple-400 text-center">{p.ppPoints}</td>
                  <td className="py-3 font-mono text-slate-400 text-right">{p.ppTimeOnIcePerGame}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
