"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle2,
  GitCompare,
  Layers,
  Filter,
  Lock,
  Sparkles,
} from "lucide-react";

export default function NflOffensePage() {
  const [team, setTeam] = useState("Example Team A");
  const [excludeKneels, setExcludeKneels] = useState(true);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Situational state
  const [sitDown, setSitDown] = useState("2");
  const [sitYardsToGo, setSitYardsToGo] = useState("7");
  const [sitYardline100, setSitYardline100] = useState("35");
  const [sitQuarter, setSitQuarter] = useState("3");
  const [sitScoreDiff, setSitScoreDiff] = useState("-6");
  const [sitResult, setSitResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  // Opponent comparison state
  const [opponentTeam, setOpponentTeam] = useState("Example Team B");
  const [matchupData, setMatchupData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/nfl/offense?team=${encodeURIComponent(team)}&season=2024&excludeKneels=${excludeKneels}`
      );
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
      const res = await fetch(
        `/api/nfl/matchup?offense=${encodeURIComponent(team)}&defense=${encodeURIComponent(opponentTeam)}`
      );
      if (res.ok) {
        const json = await res.json();
        setMatchupData(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMatchup();
  }, [team, excludeKneels, opponentTeam]);

  const handleSituationalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await fetch("/api/nfl/situational", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "OFFENSE_TENDENCY",
          team,
          down: Number(sitDown),
          yardsToGo: Number(sitYardsToGo),
          yardline100: Number(sitYardline100),
          quarter: Number(sitQuarter),
          scoreDiff: Number(sitScoreDiff),
        }),
      });
      const json = await res.json();
      setSitResult(json);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const isPro = Boolean(data?.isPro);
  const t = data?.tendencies;
  const freeT = data?.freeTier;

  return (
    <div className="space-y-10">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white">NFL Offensive Tendencies</h1>
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
            Predictive run versus pass play-calling patterns under varying down-and-distance, red zone, and game scenarios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Offensive Team:</span>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Example Team A">Example Team A (Dev Fixture)</option>
              <option value="Example Team B">Example Team B (Dev Fixture)</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={excludeKneels}
              onChange={(e) => setExcludeKneels(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-emerald-500"
            />
            <span>Exclude Kneels/Spikes</span>
          </label>
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
              <p className="text-xs font-bold text-white">Viewing Free Tier Offensive Tendencies</p>
              <p className="text-[11px] text-slate-400">
                You have free access to overall and 1st down run/pass ratios. Upgrade to Pro to unlock 2nd/3rd/4th down splits, red zone heatmaps, and opponent clash comparisons.
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

      {/* SECTION A: RUN VS PASS BREAKDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">A. Run Versus Pass Analysis</h2>
            <p className="text-xs text-slate-400">
              Designed runs, scrambles, and passes classified. Kneel-downs & spikes filtered per configuration.
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            Total Analyzed Snaps:{" "}
            <span className="text-white font-bold">
              {isPro ? t?.totalEligiblePlays || 0 : freeT?.totalEligiblePlays || 0}
            </span>
          </div>
        </div>

        {/* Free Tier Cards */}
        {!isPro && freeT && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold">Overall Run vs Pass (Free Tier)</span>
              <p className="text-2xl font-black font-mono text-emerald-400">
                {freeT.overall.passPercentage}% Pass / {freeT.overall.runPercentage}% Run
              </p>
              <p className="text-slate-400 text-[11px]">
                {freeT.overall.passes} Passes and {freeT.overall.runs} Runs across {freeT.overall.totalPlays} eligible snaps
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold">1st Down Tendencies (Free Tier)</span>
              <p className="text-2xl font-black font-mono text-blue-400">
                {freeT.firstDown.passPercentage}% Pass / {freeT.firstDown.runPercentage}% Run
              </p>
              <p className="text-slate-400 text-[11px]">
                Avg {freeT.firstDown.avgYardsGained} yds gained on 1st down snaps
              </p>
            </div>
          </div>
        )}

        {/* Pro Unlocked Grid or Teaser */}
        {isPro && t ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* By Down */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">By Down</h3>
              <div className="space-y-3">
                {[t.firstDown, t.secondDown, t.thirdDown, t.fourthDown].map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{c.category} (n={c.totalPlays})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {c.passPercentage}% Pass / {c.runPercentage}% Run
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div style={{ width: `${c.passPercentage}%` }} className="bg-blue-500 h-full" />
                      <div style={{ width: `${c.runPercentage}%` }} className="bg-emerald-500 h-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Distance to Go */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">By Distance</h3>
              <div className="space-y-3">
                {[t.shortYardage, t.mediumYardage, t.longYardage].map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{c.category} (n={c.totalPlays})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {c.passPercentage}% Pass / {c.runPercentage}% Run
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div style={{ width: `${c.passPercentage}%` }} className="bg-blue-500 h-full" />
                      <div style={{ width: `${c.runPercentage}%` }} className="bg-emerald-500 h-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Zone */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Red Zone & Goal Line</h3>
              <div className="space-y-3">
                {[t.redZone, t.goalLine, t.twoMinute].map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{c.category} (n={c.totalPlays})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {c.passPercentage}% Pass / {c.runPercentage}% Run
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div style={{ width: `${c.passPercentage}%` }} className="bg-blue-500 h-full" />
                      <div style={{ width: `${c.runPercentage}%` }} className="bg-emerald-500 h-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game State */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Game State Dynamics</h3>
              <div className="space-y-3">
                {[t.leading, t.trailing, t.tied].map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{c.category} (n={c.totalPlays})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {c.passPercentage}% Pass / {c.runPercentage}% Run
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div style={{ width: `${c.passPercentage}%` }} className="bg-blue-500 h-full" />
                      <div style={{ width: `${c.runPercentage}%` }} className="bg-emerald-500 h-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarters */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Quarter-by-Quarter</h3>
              <div className="space-y-3">
                {[t.q1, t.q2, t.q3, t.q4].map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{c.category} (n={c.totalPlays})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {c.passPercentage}% Pass / {c.runPercentage}% Run
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div style={{ width: `${c.passPercentage}%` }} className="bg-blue-500 h-full" />
                      <div style={{ width: `${c.runPercentage}%` }} className="bg-emerald-500 h-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sequences */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Sequences & Scripts</h3>
              <div className="space-y-3">
                {[t.firstDrive, t.openingPlay, t.afterTurnover, t.afterPenalty].map((c) => (
                  <div key={c.category} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>{c.category} (n={c.totalPlays})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {c.passPercentage}% Pass / {c.runPercentage}% Run
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                      <div style={{ width: `${c.passPercentage}%` }} className="bg-blue-500 h-full" />
                      <div style={{ width: `${c.runPercentage}%` }} className="bg-emerald-500 h-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Full Down-and-Distance Tendencies (Pro Tier)</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              2nd, 3rd, and 4th down tendencies, red zone run/pass splits, and leading/trailing dynamics require SportsEdge AI Pro membership.
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

      {/* SECTION B: SITUATIONAL SEARCH */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">B. Situational Historical Search</h2>
            {!isPro && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
                Pro Feature
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Query specific game coordinates (e.g. 2nd-and-7, ball on opponent 35-yard line, 3rd quarter, trailing by 6).
          </p>
        </div>

        {isPro ? (
          <>
            <form onSubmit={handleSituationalSearch} className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Down</label>
                <select
                  value={sitDown}
                  onChange={(e) => setSitDown(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="1">1st Down</option>
                  <option value="2">2nd Down</option>
                  <option value="3">3rd Down</option>
                  <option value="4">4th Down</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Yards To Go</label>
                <input
                  type="number"
                  value={sitYardsToGo}
                  onChange={(e) => setSitYardsToGo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Opponent 35 (ydln 35)</label>
                <input
                  type="number"
                  value={sitYardline100}
                  onChange={(e) => setSitYardline100(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Quarter</label>
                <select
                  value={sitQuarter}
                  onChange={(e) => setSitQuarter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="1">1st Quarter</option>
                  <option value="2">2nd Quarter</option>
                  <option value="3">3rd Quarter</option>
                  <option value="4">4th Quarter</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Trailing by 6 (Score Diff)</label>
                <input
                  type="number"
                  value={sitScoreDiff}
                  onChange={(e) => setSitScoreDiff(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="col-span-2 sm:col-span-5 pt-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs uppercase tracking-wider transition"
                >
                  {searching ? "Searching..." : "Search Historical Snaps"}
                </button>
              </div>
            </form>

            {sitResult && (
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
                <span className="font-bold text-white text-sm">Matching Historical Snaps</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Qualifying Plays</span>
                    <p className="text-lg font-mono font-bold text-white mt-0.5">{sitResult.qualifyingPlays}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Pass vs Run Tendency</span>
                    <p className="text-lg font-mono font-bold text-blue-400 mt-0.5">
                      {sitResult.passPercentage}% / {sitResult.runPercentage}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Average Yards Gained</span>
                    <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                      {sitResult.averageYardsGained} yds
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">1st Down Conversion</span>
                    <p className="text-lg font-mono font-bold text-purple-400 mt-0.5">
                      {sitResult.firstDownConversionRate}%
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px]">{sitResult.historicalTrends}</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Situational Historical Search Locked</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upgrade to SportsEdge AI Pro to query custom situational coordinates and access matching historical play outcomes.
            </p>
            <div className="pt-2">
              <Link href="/pricing" className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: OPPONENT MATCHUP COMPARISON */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">C. Opponent Tendency Matchup Comparison</h2>
              {!isPro && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
                  Pro Feature
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Compare offensive play-calling tendencies against upcoming opponent defensive blitz tendencies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Upcoming Defense:</span>
            <select
              value={opponentTeam}
              onChange={(e) => setOpponentTeam(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
            >
              <option value="Example Team B">Example Team B</option>
              <option value="Example Team A">Example Team A</option>
            </select>
          </div>
        </div>

        {isPro && matchupData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 3rd and Long Comparison */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">3rd-and-Long Clash (≥ 7 yds)</span>
                <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Key Leverage</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{matchupData.offenseTeam} Pass Rate:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {matchupData.thirdAndLong.offensePassRate !== null
                      ? `${matchupData.thirdAndLong.offensePassRate}% (n=${matchupData.thirdAndLong.offenseSampleSize})`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>{matchupData.defenseTeam} Blitz Rate:</span>
                  <span className="font-mono font-bold text-red-400">
                    {matchupData.thirdAndLong.defenseBlitzRate !== null
                      ? `${matchupData.thirdAndLong.defenseBlitzRate}% (n=${matchupData.thirdAndLong.defenseSampleSize})`
                      : "N/A"}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                {matchupData.thirdAndLong.analysis}
              </p>
            </div>

            {/* Red Zone Clash */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">Red Zone Clash (≤ 20 yds)</span>
                <span className="text-[10px] text-amber-400 uppercase font-mono font-bold">Scoring Area</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{matchupData.offenseTeam} Run Rate:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {matchupData.redZone.offenseRunRate !== null
                      ? `${matchupData.redZone.offenseRunRate}% (n=${matchupData.redZone.offenseSampleSize})`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>{matchupData.defenseTeam} Blitz Rate:</span>
                  <span className="font-mono font-bold text-red-400">
                    {matchupData.redZone.defenseBlitzRate !== null
                      ? `${matchupData.redZone.defenseBlitzRate}% (n=${matchupData.redZone.defenseSampleSize})`
                      : "N/A"}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                {matchupData.redZone.analysis}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Opponent Matchup Clash Engine Locked</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Compare Team A&apos;s passing and running tendencies directly against Team B&apos;s defensive blitz patterns.
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
