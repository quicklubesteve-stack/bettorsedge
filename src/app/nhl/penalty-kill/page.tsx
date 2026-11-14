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
  Lock,
} from "lucide-react";

export default function NhlPenaltyKillPage() {
  const [team, setTeam] = useState("TOR");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Matchup state
  const [ppTeam, setPpTeam] = useState("EDM");
  const [matchup, setMatchup] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nhl/penalty-kill?team=${team}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchup = async () => {
    try {
      const res = await fetch(`/api/nhl/matchup?ppTeam=${ppTeam}&pkTeam=${team}`);
      if (res.ok) {
        const json = await res.json();
        setMatchup(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMatchup();
  }, [team, ppTeam]);

  const isPro = Boolean(data?.isPro);
  const stats = data?.teamStats;
  const pk = data?.pkUnits;
  const blocks = data?.blockedShots;
  const freeBlocks = data?.freeTier;

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white">NHL Penalty Kill Analysis</h1>
            {isPro ? (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase">
                Pro Tier Unlocked
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 text-[10px] font-bold uppercase">
                Free Tier View
              </span>
            )}
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

      {/* Free Tier Notice Banner */}
      {!isPro && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Viewing Free Tier Penalty Kill Metrics</p>
              <p className="text-[11px] text-slate-400">
                You have free access to team penalty-kill conversion and all-situation blocked shots. Upgrade to Pro to unlock primary PK pairs, verified shorthanded blocked shots, and the matchup engine.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

      {/* SECTION B: PENALTY KILL PERFORMANCE STATS (FREE FOR EVERYONE) */}
      {stats && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">B. Penalty-Kill Team Performance (Included in Free Tier)</h2>
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
              <span className="text-[10px] text-slate-500">SH counter-attack</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Home PK %</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.homePkPct}%</p>
              <span className="text-[10px] text-slate-500">Home arena efficiency</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Away PK %</span>
              <p className="text-2xl font-black font-mono text-purple-400">{stats.awayPkPct}%</p>
              <span className="text-[10px] text-slate-500">Road PK efficiency</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Last 10 Games (L10)</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{stats.l10PkPct}%</p>
              <span className="text-[10px] text-slate-500">Recent form momentum</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION A: PENALTY KILLING UNITS (PRO ONLY) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">A. Primary Penalty-Killing Units & Pairs</h2>
          <p className="text-xs text-slate-400">
            Most-used defensive pairings and forward pairs in 4-on-5 scenarios with shorthanded ice time.
          </p>
        </div>

        {isPro && pk ? (
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
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Penalty-Killing Units Locked</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Upgrade to SportsEdge AI Pro to view primary forward pairs, defensive pairings, and average shorthanded time on ice.
            </p>
            <div className="pt-2">
              <Link
                href="/pricing"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs uppercase"
              >
                Upgrade to Pro Plan
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: BLOCKED SHOTS (FREE & PRO) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">C. Blocked Shots Analysis</h2>
          <p className="text-xs text-slate-400">
            Rigorous separation of all-situation blocked shots from verified penalty-kill blocked shots.
          </p>
        </div>

        {isPro && blocks ? (
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
        ) : (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400">All-Situation Blocked Shots (Free Tier):</span>
              <p className="text-2xl font-mono font-bold text-white mt-1">140 Blocked Shots</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Verified shorthanded blocked shot isolation is available on the Pro Tier.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase shrink-0"
            >
              Unlock Shorthanded Blocks
            </Link>
          </div>
        )}
      </div>

      {/* SECTION D: PP VS PK MATCHUP */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">D. Power Play Versus Penalty Kill Matchup</h2>
              {!isPro && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
                  Pro Feature
                </span>
              )}
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

        {isPro && matchup ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold">{matchup.powerPlayTeam} Power Play Profile</span>
                <p className="text-2xl font-mono font-black text-emerald-400">{matchup.powerPlayPercentage}%</p>
                <p className="text-slate-400">
                  {matchup.powerPlayOpportunitiesPerGame} PP opportunities/g • {matchup.powerPlayGoalsPerGame} PP goals/g
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold">{matchup.penaltyKillTeam} Penalty Kill Profile</span>
                <p className="text-2xl font-mono font-black text-blue-400">{matchup.penaltyKillPercentage}%</p>
                <p className="text-slate-400">
                  {matchup.timesShorthandedPerGame} times shorthanded/g • {matchup.shGoalsAllowed} total PP goals allowed
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 space-y-1">
              <span className="font-bold text-emerald-300 text-sm">Tactical Special-Teams Assessment</span>
              <p className="text-slate-200 text-xs leading-relaxed">{matchup.tacticalSummary}</p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Special-Teams Matchup Engine Locked</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Compare Team A&apos;s power play against Team B&apos;s penalty kill with tactical AI assessments.
            </p>
            <div className="pt-2">
              <Link href="/pricing" className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase">
                Unlock with Pro
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
