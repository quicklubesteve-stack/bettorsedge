"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Award,
  Shield,
  ShieldAlert,
  GitCompare,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";

export default function NhlPenaltyKillPage() {
  const [team, setTeam] = useState("TOR");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(true);

  // Matchup state
  const [ppTeam, setPpTeam] = useState("EDM");
  const [matchup, setMatchup] = useState<any>(null);
  const [loadingMatchup, setLoadingMatchup] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nhl/penalty-kill?team=${team}`);
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

  const fetchMatchup = async () => {
    setLoadingMatchup(true);
    try {
      const res = await fetch(`/api/nhl/matchup?ppTeam=${ppTeam}&pkTeam=${team}`);
      if (res.ok) {
        const json = await res.json();
        setMatchup(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMatchup(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMatchup();
  }, [team, ppTeam]);

  if (!isPro) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Pro Membership Required</h2>
        <p className="text-slate-400 text-sm">
          NHL Penalty Kill Analysis, Shorthanded Blocked Shots, and Matchup Models are reserved for SportsEdge AI Pro members.
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
  const pk = data?.pkUnits;
  const blocks = data?.blockedShots;

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white">NHL Penalty Kill Analysis</h1>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase">
              Pro Feature
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Defensive penalty-killing pair utilization, verified shorthanded blocked shots, and tactical special-teams matchups.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Defending Team:</span>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-bold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="TOR">Toronto Maple Leafs (TOR)</option>
            <option value="EDM">Edmonton Oilers (EDM)</option>
          </select>
        </div>
      </div>

      {/* SECTION B: PENALTY KILL PERFORMANCE STATS */}
      {stats && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">B. Penalty-Kill Team Performance</h2>
            <span className="text-xs text-slate-400">
              PK% = ((Times Shorthanded − PPG Allowed) / Times Shorthanded) × 100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Penalty-Kill %</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.pkPct}%</p>
              <span className="text-[10px] text-slate-500">
                {stats.timesShorthanded - stats.pkGoalsAllowed}/{stats.timesShorthanded} Killed
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Times Shorthanded</span>
              <p className="text-2xl font-black font-mono text-white">{stats.timesShorthanded}</p>
              <span className="text-[10px] text-slate-500">{stats.pkGoalsAllowed} PPG Allowed</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">SH Goals Scored</span>
              <p className="text-2xl font-black font-mono text-blue-400">+{stats.shGoalsScored}</p>
              <span className="text-[10px] text-slate-500">Shorthanded counter-attack</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Home PK %</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.homePkPct}%</p>
              <span className="text-[10px] text-slate-500">Home arena PK efficiency</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Away PK %</span>
              <p className="text-2xl font-black font-mono text-purple-400">{stats.awayPkPct}%</p>
              <span className="text-[10px] text-slate-500">Road PK efficiency</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Last 10 Games (L10)</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.l10PkPct}%</p>
              <span className="text-[10px] text-slate-500">Recent defensive form</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION A: PENALTY KILLING UNITS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">A. Primary Penalty-Killing Units & Pairs</h2>
          <p className="text-xs text-slate-400">
            Most-used defensive pairings and forward pairs in 4-on-5 scenarios with shorthanded ice time.
          </p>
        </div>

        {pk && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Primary Defencemen */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Top Penalty-Killing Defencemen</span>
                <span className="text-[10px] text-slate-500 font-mono">D Pairs 1 & 2</span>
              </h3>
              <div className="space-y-3">
                {pk.primaryDefencemen.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{p.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {p.position}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          {p.unitStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        SH Time on Ice: <span className="text-slate-200 font-mono">{p.shTimeOnIcePerGame} min/g</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-emerald-400 text-sm">
                        {p.shBlockedShots} SH Blocks
                      </p>
                      <p className="text-[10px] text-slate-500">{p.shBlockedShotsPerMinute} blocks/min</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Forwards */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Primary Penalty-Killing Forwards</span>
                <span className="text-[10px] text-slate-500 font-mono">Fwd Pairs 1 & 2</span>
              </h3>
              <div className="space-y-3">
                {pk.primaryForwards.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{p.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {p.position}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          {p.unitStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        SH Time on Ice: <span className="text-slate-200 font-mono">{p.shTimeOnIcePerGame} min/g</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-blue-400 text-sm">
                        {p.shBlockedShots} SH Blocks
                      </p>
                      <p className="text-[10px] text-slate-500">{p.shBlockedShotsPerMinute} blocks/min</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: BLOCKED SHOTS (DISTINGUISHING ALL-SITUATION VS SHORTHANDED) */}
      {blocks && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">C. Shorthanded Blocked Shots Analysis</h2>
            <p className="text-xs text-slate-400">
              Rigorous separation of all-situation blocked shots from verified penalty-kill blocked shots. Total blocked shots are never substituted for shorthanded blocked shots.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">All-Situation Blocked Shots</span>
              <p className="text-xl font-mono font-bold text-white">{blocks.allSituationBlockedShots}</p>
              <span className="text-[10px] text-slate-500">Includes 5v5, 4v4, and empty net</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 space-y-1 bg-emerald-950/20">
              <span className="text-emerald-400 font-semibold">Verified Shorthanded Blocks</span>
              <p className="text-xl font-mono font-bold text-emerald-400">{blocks.shorthandedBlockedShots}</p>
              <span className="text-[10px] text-emerald-300">While killing penalties only</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Defencemen SH Blocks</span>
              <p className="text-xl font-mono font-bold text-blue-400">{blocks.defencemenShorthandedBlocks}</p>
              <span className="text-[10px] text-slate-500">
                {((blocks.defencemenShorthandedBlocks / blocks.shorthandedBlockedShots) * 100).toFixed(0)}% of PK Blocks
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Forwards SH Blocks</span>
              <p className="text-xl font-mono font-bold text-purple-400">{blocks.forwardsShorthandedBlocks}</p>
              <span className="text-[10px] text-slate-500">
                {((blocks.forwardsShorthandedBlocks / blocks.shorthandedBlockedShots) * 100).toFixed(0)}% of PK Blocks
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{blocks.methodologyNote}</span>
          </div>
        </div>
      )}

      {/* SECTION D: POWER PLAY VS PENALTY KILL MATCHUP */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">D. Power Play Versus Penalty Kill Matchup</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Matchup intelligence between {ppTeam} Power Play and {team} Penalty Kill.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Opposing Power Play:</span>
            <select
              value={ppTeam}
              onChange={(e) => setPpTeam(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
            >
              <option value="EDM">Edmonton Oilers (EDM)</option>
              <option value="TOR">Toronto Maple Leafs (TOR)</option>
            </select>
          </div>
        </div>

        {matchup && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold">{matchup.powerPlayTeam} Power Play Profile</span>
                <p className="text-2xl font-mono font-black text-emerald-400">{matchup.powerPlayPercentage}%</p>
                <p className="text-slate-400">
                  {matchup.powerPlayOpportunitiesPerGame} PP opportunities/g • {matchup.powerPlayGoalsPerGame} PP goals/g
                </p>
                <div className="pt-1">
                  <span className="text-slate-500 text-[10px]">Primary PP Scorers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {matchup.topPpScorers?.map((s: any) => (
                      <span key={s.id} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {s.name} ({s.ppGoals}G)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold">{matchup.penaltyKillTeam} Penalty Kill Profile</span>
                <p className="text-2xl font-mono font-black text-blue-400">{matchup.penaltyKillPercentage}%</p>
                <p className="text-slate-400">
                  {matchup.timesShorthandedPerGame} times shorthanded/g • {matchup.shGoalsAllowed} total PP goals allowed
                </p>
                <div className="pt-1">
                  <span className="text-slate-500 text-[10px]">Primary PK Killers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {matchup.topPkKillers?.map((k: any) => (
                      <span key={k.id} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {k.name} ({k.shTimeOnIcePerGame}m)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical AI Summary */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 space-y-1">
              <span className="font-bold text-emerald-300 text-sm">Tactical Special-Teams Assessment</span>
              <p className="text-slate-200 text-xs leading-relaxed">{matchup.tacticalSummary}</p>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-500 leading-normal flex items-start gap-1.5 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{matchup.disclaimer}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
