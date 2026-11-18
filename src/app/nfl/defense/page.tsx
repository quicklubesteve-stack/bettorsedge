"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  Lock,
  ArrowRight,
} from "lucide-react";
import { NFL_ALL_TEAMS } from "@/lib/teams";

export default function NflDefensePage() {
  const [team, setTeam] = useState("KC");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Situational predictor input state
  const [predDown, setPredDown] = useState("3");
  const [predYardsToGo, setPredYardsToGo] = useState("8");
  const [predYardline100, setPredYardline100] = useState("35");
  const [predQuarter, setPredQuarter] = useState("3");
  const [predScoreDiff, setPredScoreDiff] = useState("-3");
  const [predictorResult, setPredictorResult] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nfl/defense?team=${encodeURIComponent(team)}&season=2025`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("team");
      if (q) setTeam(q);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [team]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const res = await fetch("/api/nfl/situational", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "DEFENSE_BLITZ",
          team,
          down: Number(predDown),
          yardsToGo: Number(predYardsToGo),
          yardline100: Number(predYardline100),
          quarter: Number(predQuarter),
          scoreDiff: Number(predScoreDiff),
        }),
      });
      const result = await res.json();
      setPredictorResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setPredicting(false);
    }
  };

  const isPro = Boolean(data?.isPro);
  const cat = data?.categories;
  const freeCat = data?.freeTier;
  const eff = data?.effectiveness;

  return (
    <div className="space-y-10">
      {/* Page Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white">NFL Defensive Intelligence</h1>
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
            Situational blitz frequencies, pressure containment metrics, and down-and-distance tendency distributions.
          </p>
        </div>

        {/* Team switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Defensive Team:</span>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
          >
            {NFL_ALL_TEAMS.map((t) => (
              <option key={t.abbr} value={t.abbr}>
                {t.name} ({t.abbr})
              </option>
            ))}
            <option value="Example Team A">Example Team A (Dev Fixture)</option>
            <option value="Example Team B">Example Team B (Dev Fixture)</option>
          </select>
        </div>
      </div>

      {/* Free Tier Notice Banner (if Free) */}
      {!isPro && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Viewing Free Tier Metrics</p>
              <p className="text-[11px] text-slate-400">
                You have free access to overall and 1st down defensive snap counts. Upgrade to Pro or redeem a free gift code to unlock all situational splits, red-zone danger zones, and the blitz predictor!
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
            <Link
              href="/redeem"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              Redeem Code
            </Link>
          </div>
        </div>
      )}

      {/* SECTION A: BLITZ ANALYSIS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">A. Situational Blitz Analysis</h2>
            <p className="text-xs text-slate-400">
              Blitz Percentage = (Number of Blitzes / Qualifying Defensive Plays) × 100.
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            Total Qualifying Snaps:{" "}
            <span className="text-white font-bold">
              {isPro ? cat?.totalVerifiedPlays || 0 : freeCat?.totalVerifiedPlays || 0}
            </span>
          </div>
        </div>

        {/* Free Tier Cards Overview */}
        {!isPro && freeCat && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold">Overall Defensive Plays (Free Tier)</span>
              <p className="text-3xl font-black font-mono text-emerald-400">
                {freeCat.overall.blitzRate !== null ? `${freeCat.overall.blitzRate}%` : "N/A"}
              </p>
              <p className="text-slate-400 text-[11px]">
                {freeCat.overall.blitzes} blitzes on {freeCat.overall.qualifyingPlays} eligible snaps
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold">1st Down Blitz Rate (Free Tier)</span>
              <p className="text-3xl font-black font-mono text-blue-400">
                {freeCat.firstDown.blitzRate !== null ? `${freeCat.firstDown.blitzRate}%` : "N/A"}
              </p>
              <p className="text-slate-400 text-[11px]">
                {freeCat.firstDown.blitzes} blitzes on {freeCat.firstDown.qualifyingPlays} 1st down snaps
              </p>
            </div>
          </div>
        )}

        {/* Unlocked Pro Grid or Locked Teaser */}
        {isPro && cat ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* By Down */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
                <span>By Down</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Rate (Blitz/Plays)</span>
              </h3>
              <div className="space-y-2.5">
                {[cat.firstDown, cat.secondDown, cat.thirdDown, cat.fourthDown].map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="text-slate-300">{c.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {c.blitzes}/{c.qualifyingPlays}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 w-12 text-right">
                        {c.blitzRate !== null ? `${c.blitzRate}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Distance */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
                <span>By Distance to Go</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Rate (Blitz/Plays)</span>
              </h3>
              <div className="space-y-2.5">
                {[cat.shortYardage, cat.mediumYardage, cat.longYardage].map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="text-slate-300">{c.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {c.blitzes}/{c.qualifyingPlays}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 w-12 text-right">
                        {c.blitzRate !== null ? `${c.blitzRate}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zones */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Field Position & Red Zone</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Rate (Blitz/Plays)</span>
              </h3>
              <div className="space-y-2.5">
                {[cat.redZone, cat.inside10, cat.goalLine, cat.twoMinute].map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="text-slate-300">{c.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {c.blitzes}/{c.qualifyingPlays}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 w-12 text-right">
                        {c.blitzRate !== null ? `${c.blitzRate}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Differential */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Score Differential</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Rate (Blitz/Plays)</span>
              </h3>
              <div className="space-y-2.5">
                {[cat.leading, cat.trailing, cat.tied].map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="text-slate-300">{c.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {c.blitzes}/{c.qualifyingPlays}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 w-12 text-right">
                        {c.blitzRate !== null ? `${c.blitzRate}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Quarter */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
                <span>By Quarter</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Rate (Blitz/Plays)</span>
              </h3>
              <div className="space-y-2.5">
                {[cat.q1, cat.q2, cat.q3, cat.q4, cat.ot].map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="text-slate-300">{c.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {c.blitzes}/{c.qualifyingPlays}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 w-12 text-right">
                        {c.blitzRate !== null ? `${c.blitzRate}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drive Sequences */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Drive Sequences</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Rate (Blitz/Plays)</span>
              </h3>
              <div className="space-y-2.5">
                {[cat.firstDrive, cat.laterDrives, cat.afterTurnover].map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="text-slate-300">{c.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {c.blitzes}/{c.qualifyingPlays}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 w-12 text-right">
                        {c.blitzRate !== null ? `${c.blitzRate}%` : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Locked Pro Teaser Card */
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Unlock Full Situational Blitz Breakdowns</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                2nd, 3rd, and 4th down blitz rates, short/medium/long distance splits, red-zone danger zones, and score differential tendencies are exclusive to Pro Tier members.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Upgrade to Pro Plan
              </Link>
              <Link
                href="/redeem"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
              >
                Redeem Free Gift Code
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* SECTION B: BLITZ EFFECTIVENESS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">B. Blitz Effectiveness Comparison</h2>
          <p className="text-xs text-slate-400">
            Compare defensive performance when blitzing versus without blitzing. Clearly distinguishes blitz from un-blitzed QB pressures or sacks.
          </p>
        </div>

        {isPro && eff ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Defensive Metric</th>
                  <th className="pb-3 font-semibold text-emerald-400 font-mono text-center">When Blitzing ({eff.blitzPlays} Snaps)</th>
                  <th className="pb-3 font-semibold text-slate-300 font-mono text-center">Without Blitzing ({eff.nonBlitzPlays} Snaps)</th>
                  <th className="pb-3 font-semibold text-right">Differential Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-3 font-medium text-slate-200">Completion % Allowed</td>
                  <td className="py-3 font-mono font-bold text-emerald-400 text-center">
                    {eff.blitzCompletionPct !== null ? `${eff.blitzCompletionPct}%` : "N/A"}
                  </td>
                  <td className="py-3 font-mono text-slate-300 text-center">
                    {eff.nonBlitzCompletionPct !== null ? `${eff.nonBlitzCompletionPct}%` : "N/A"}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-400">
                    {eff.blitzCompletionPct !== null && eff.nonBlitzCompletionPct !== null
                      ? `${(eff.blitzCompletionPct - eff.nonBlitzCompletionPct).toFixed(1)}%`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-200">Passing Yards Allowed / Play</td>
                  <td className="py-3 font-mono font-bold text-emerald-400 text-center">
                    {eff.blitzPassYardsPerPlay !== null ? `${eff.blitzPassYardsPerPlay} yds` : "N/A"}
                  </td>
                  <td className="py-3 font-mono text-slate-300 text-center">
                    {eff.nonBlitzPassYardsPerPlay !== null ? `${eff.nonBlitzPassYardsPerPlay} yds` : "N/A"}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-400">
                    {eff.blitzPassYardsPerPlay !== null && eff.nonBlitzPassYardsPerPlay !== null
                      ? `${(eff.blitzPassYardsPerPlay - eff.nonBlitzPassYardsPerPlay).toFixed(1)} yds`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-200">Yards Allowed / Play (All Types)</td>
                  <td className="py-3 font-mono font-bold text-emerald-400 text-center">
                    {eff.blitzYardsPerPlay !== null ? `${eff.blitzYardsPerPlay} yds` : "N/A"}
                  </td>
                  <td className="py-3 font-mono text-slate-300 text-center">
                    {eff.nonBlitzYardsPerPlay !== null ? `${eff.nonBlitzYardsPerPlay} yds` : "N/A"}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-400">
                    {eff.blitzYardsPerPlay !== null && eff.nonBlitzYardsPerPlay !== null
                      ? `${(eff.blitzYardsPerPlay - eff.nonBlitzYardsPerPlay).toFixed(1)} yds`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-200">Sacks Recorded</td>
                  <td className="py-3 font-mono font-bold text-emerald-400 text-center">{eff.blitzSacks}</td>
                  <td className="py-3 font-mono text-slate-300 text-center">{eff.nonBlitzSacks}</td>
                  <td className="py-3 text-right font-mono text-slate-400">
                    {eff.blitzSacks + eff.nonBlitzSacks} Total
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-200">Quarterback Pressures Generated</td>
                  <td className="py-3 font-mono font-bold text-emerald-400 text-center">{eff.blitzPressures}</td>
                  <td className="py-3 font-mono text-slate-300 text-center">{eff.nonBlitzPressures}</td>
                  <td className="py-3 text-right font-mono text-slate-400">
                    {eff.blitzPressures + eff.nonBlitzPressures} Total
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Blitz Effectiveness Comparison (Pro Tier)</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Compare completion percentages allowed, explosive plays, and pass-rush containment between blitzing and standard rushes.
            </p>
            <div className="pt-2">
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase"
              >
                Unlock with Pro
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: SITUATIONAL BLITZ PREDICTOR */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">C. Situational Blitz Predictor</h2>
            {!isPro && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
                Pro Feature
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statistical estimation based strictly on historical snap counts. No manufactured exact probabilities from incomplete sample data.
          </p>
        </div>

        {isPro ? (
          <>
            <form onSubmit={handlePredict} className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Down</label>
                <select
                  value={predDown}
                  onChange={(e) => setPredDown(e.target.value)}
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
                  min="1"
                  max="30"
                  value={predYardsToGo}
                  onChange={(e) => setPredYardsToGo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Yards from Goal (1-99)</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={predYardline100}
                  onChange={(e) => setPredYardline100(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Quarter</label>
                <select
                  value={predQuarter}
                  onChange={(e) => setPredQuarter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                >
                  <option value="1">1st Quarter</option>
                  <option value="2">2nd Quarter</option>
                  <option value="3">3rd Quarter</option>
                  <option value="4">4th Quarter</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Score Differential</label>
                <input
                  type="number"
                  value={predScoreDiff}
                  onChange={(e) => setPredScoreDiff(e.target.value)}
                  placeholder="-3 (Defense Lead)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="col-span-2 sm:col-span-5 pt-2">
                <button
                  type="submit"
                  disabled={predicting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs uppercase tracking-wider transition flex items-center gap-2"
                >
                  {predicting ? "Querying Historical Snaps..." : "Calculate Situational Estimate"}
                </button>
              </div>
            </form>

            {predictorResult && (
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Historical Analysis Results</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      predictorResult.confidence === "HIGH"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : predictorResult.confidence === "MODERATE"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    Confidence: {predictorResult.confidence}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Comparable Plays (Sample Size)</span>
                    <p className="text-lg font-mono font-bold text-white mt-1">n = {predictorResult.sampleSize}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Historical Blitz Frequency</span>
                    <p className="text-lg font-mono font-bold text-emerald-400 mt-1">
                      {predictorResult.historicalBlitzFrequency !== null
                        ? `${predictorResult.historicalBlitzFrequency}%`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Validated Statistical Estimate</span>
                    <p className="text-lg font-mono font-bold text-purple-400 mt-1">
                      {predictorResult.statisticalEstimate !== null
                        ? `${predictorResult.statisticalEstimate}%`
                        : "Insufficient Data"}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{predictorResult.notes}</span>
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Situational Blitz Predictor Locked</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Query historical snaps based on specific downs, distances, red zone coordinates, and score differentials.
            </p>
            <div className="pt-2">
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
