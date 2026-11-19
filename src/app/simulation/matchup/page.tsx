"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Flame,
  Award,
  Zap,
  TrendingUp,
  RefreshCw,
  GitCompare,
  BarChart3,
  Shield,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Swords,
  History,
} from "lucide-react";
import { NFL_ALL_TEAMS, NHL_ALL_TEAMS } from "@/lib/teams";

export default function MatchupSimulatorPage() {
  const [league, setLeague] = useState<"NFL" | "NHL">("NFL");
  const [teamA, setTeamA] = useState("BUF");
  const [teamB, setTeamB] = useState("KC");
  const [iterations, setIterations] = useState(2000);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Sync default teams when switching leagues
  const handleLeagueChange = (newLeague: "NFL" | "NHL") => {
    setLeague(newLeague);
    if (newLeague === "NFL") {
      setTeamA("BUF");
      setTeamB("KC");
    } else {
      setTeamA("TOR");
      setTeamB("EDM");
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulation/matchup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ league, teamA, teamB, iterations }),
      });
      const data = await res.json();
      setResult(data);
      setIsPro(Boolean(data.isPro));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [league, teamA, teamB]);

  const teamsList = league === "NFL" ? NFL_ALL_TEAMS : NHL_ALL_TEAMS;

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-white">Pro Head-to-Head Game Simulator</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase">
                  Pro Tier Simulation
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Simulate up to 2,000 match games between any two teams to determine who wins the % of the time, the projected final score, and yardage / goal scorers.
              </p>
            </div>
          </div>
        </div>

        {/* League Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => handleLeagueChange("NFL")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              league === "NFL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            NFL Football
          </button>
          <button
            onClick={() => handleLeagueChange("NHL")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              league === "NHL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            NHL Hockey
          </button>
        </div>
      </div>

      {/* Free Tier Notice Banner if user not Pro */}
      {!isPro && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Previewing Pro Head-to-Head Simulator</p>
              <p className="text-[11px] text-slate-400">
                You are viewing sample simulation results. Upgrade to Pro or redeem a gift code to run unlimited custom simulations between any 2 teams with custom iteration sizes.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shrink-0"
          >
            Unlock Pro Simulator
          </Link>
        </div>
      )}

      {/* MATCHUP CONTROLS CARD */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Team A */}
          <div className="flex-1 w-full space-y-1.5 text-xs">
            <span className="text-slate-400 font-bold">Team 1 (Home / Designated A):</span>
            <select
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
            >
              {teamsList.map((t) => (
                <option key={t.abbr} value={t.abbr}>
                  {t.name} ({t.abbr})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-black text-xs text-slate-400">
              VS
            </div>
          </div>

          {/* Team B */}
          <div className="flex-1 w-full space-y-1.5 text-xs">
            <span className="text-slate-400 font-bold">Team 2 (Away / Designated B):</span>
            <select
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-blue-400 font-bold text-sm focus:outline-none focus:border-blue-500"
            >
              {teamsList.map((t) => (
                <option key={t.abbr} value={t.abbr}>
                  {t.name} ({t.abbr})
                </option>
              ))}
            </select>
          </div>

          {/* Iterations selector */}
          <div className="w-full md:w-56 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Simulations (Up to 2,000):</span>
              <span className="text-emerald-400 font-mono font-bold">{iterations.toLocaleString()} Games</span>
            </div>
            <select
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm"
            >
              <option value={100}>100 Match Games</option>
              <option value={250}>250 Match Games</option>
              <option value={500}>500 Match Games</option>
              <option value={1000}>1,000 Match Games</option>
              <option value={1500}>1,500 Match Games</option>
              <option value={2000}>2,000 Match Games (Standard)</option>
              <option value={5000}>5,000 Match Games (Max Precision)</option>
            </select>
            {/* Quick Presets */}
            <div className="flex items-center gap-1 pt-1">
              {[100, 500, 1000, 2000].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setIterations(num)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                    iterations === num
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {num === 2000 ? "2,000" : num}
                </button>
              ))}
            </div>
          </div>

          {/* Run button */}
          <div className="w-full md:w-auto pt-4 md:pt-0">
            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-black text-slate-950 text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Simulating Match Games..." : `Run ${iterations.toLocaleString()} Match Games`}
            </button>
          </div>
        </div>
      </div>

      {/* SIMULATION RESULTS */}
      {result && (
        <div className="space-y-8">
          {/* WIN PERCENTAGE & PROJECTED SCORE BANNER */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-emerald-900/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">
                  {result.iterations.toLocaleString()} Monte Carlo Match Games Completed
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Projected Winner:{" "}
                  <span className="text-emerald-400">
                    {result.favoredTeam === result.teamA ? result.teamAName : result.teamBName} Wins{" "}
                    {result.favoredTeam === result.teamA ? result.teamAWinPct : result.teamBWinPct}% of the Time!
                  </span>
                </h2>
                <div className="text-xs text-slate-300 font-mono mt-1">
                  Across {result.iterations.toLocaleString()} match games:{" "}
                  <strong className="text-emerald-400">
                    {result.teamAName} won {result.teamAWins ?? Math.round((result.iterations * result.teamAWinPct) / 100)} games ({result.teamAWinPct}%)
                  </strong>
                  {" vs "}
                  <strong className="text-blue-400">
                    {result.teamBName} won {result.teamBWins ?? Math.round((result.iterations * result.teamBWinPct) / 100)} games ({result.teamBWinPct}%)
                  </strong>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Average Margin of Victory</span>
                <span className="text-2xl font-black font-mono text-white">
                  {league === "NFL" ? `+${Math.abs(result.avgScoreMargin)} Points` : `+${result.avgGoalMargin} Goals`}
                </span>
              </div>
            </div>

            {/* Win Probability Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-base font-mono font-black">
                <span className="text-emerald-400">
                  {result.teamAName}: {result.teamAWinPct}%
                </span>
                <span className="text-slate-400 text-xs font-sans font-medium">
                  {league === "NFL" ? `Ties: ${result.tiePct}%` : `Overtime: ${result.overtimePct}%`}
                </span>
                <span className="text-blue-400">
                  {result.teamBName}: {result.teamBWinPct}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${result.teamAWinPct}%` }} />
                <div className="bg-blue-500 h-full" style={{ width: `${result.teamBWinPct}%` }} />
              </div>
            </div>

            {/* Scorecard Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 font-medium">Projected Score</span>
                <p className="text-2xl font-mono font-black text-white mt-1">
                  {league === "NFL"
                    ? `${result.projectedScoreA} - ${result.projectedScoreB}`
                    : `${result.projectedGoalsA} - ${result.projectedGoalsB}`}
                </p>
                <span className="text-[10px] text-slate-500">
                  {result.teamA} vs {result.teamB}
                </span>
              </div>

              {league === "NFL" ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 font-medium">Total Yards A vs B</span>
                    <p className="text-2xl font-mono font-black text-emerald-400 mt-1">
                      {result.teamATotalYards} vs {result.teamBTotalYards}
                    </p>
                    <span className="text-[10px] text-slate-500">Scrimmage yards/game</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 font-medium">Rushing Yards A vs B</span>
                    <p className="text-2xl font-mono font-black text-blue-400 mt-1">
                      {result.teamAYardsRan} vs {result.teamBYardsRan}
                    </p>
                    <span className="text-[10px] text-slate-500">Yards Ran</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 font-medium">Passing Yards A vs B</span>
                    <p className="text-2xl font-mono font-black text-purple-400 mt-1">
                      {result.teamAYardsThrown} vs {result.teamBYardsThrown}
                    </p>
                    <span className="text-[10px] text-slate-500">Yards Thrown</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 font-medium">Average Goal Margin</span>
                    <p className="text-2xl font-mono font-black text-emerald-400 mt-1">
                      +{result.avgGoalMargin}
                    </p>
                    <span className="text-[10px] text-slate-500">Goals in victory</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 font-medium">Overtime Probability</span>
                    <p className="text-2xl font-mono font-black text-blue-400 mt-1">
                      {result.overtimePct}%
                    </p>
                    <span className="text-[10px] text-slate-500">3v3 or Shootout</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 font-medium">Puck Line (-1.5) Cover</span>
                    <p className="text-2xl font-mono font-black text-purple-400 mt-1">
                      {result.puckLineCoverPct}%
                    </p>
                    <span className="text-[10px] text-slate-500">Favorite multi-goal win</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* HEAD-TO-HEAD MATCHUPS & HISTORICAL SERIES BREAKDOWN */}
          {result.headToHead && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      Head-to-Head History & Series Records
                    </h3>
                    <p className="text-xs text-slate-400">
                      Points scored, game winners, last win history, and betting trends between {result.teamAName} and {result.teamBName}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold">
                    {result.headToHead.seriesLeaderText}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                    {result.headToHead.currentStreak}
                  </span>
                </div>
              </div>

              {/* H2H Stat Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 font-medium">Head-to-Head Record</span>
                  <p className="text-xl font-mono font-black text-white mt-1">
                    {result.headToHead.recordTeamA.wins} - {result.headToHead.recordTeamA.losses}
                  </p>
                  <span className="text-[10px] text-slate-500">{result.teamA} vs {result.teamB}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 font-medium">Avg Points Scored</span>
                  <p className="text-xl font-mono font-black text-emerald-400 mt-1">
                    {result.headToHead.avgPointsTeamA} vs {result.headToHead.avgPointsTeamB}
                  </p>
                  <span className="text-[10px] text-slate-500">{result.teamA} PPG vs {result.teamB} PPG</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 font-medium">Over / Under Trend</span>
                  <p className="text-sm font-mono font-black text-purple-400 mt-2">
                    {result.headToHead.overUnderTrend}
                  </p>
                  <span className="text-[10px] text-slate-500">Avg Total: {result.headToHead.avgTotalPoints}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 font-medium">Spread (ATS) Trend</span>
                  <p className="text-sm font-mono font-black text-blue-400 mt-2">
                    {result.headToHead.atsTrend}
                  </p>
                  <span className="text-[10px] text-slate-500">Cover Performance</span>
                </div>
              </div>

              {/* LAST WIN FOR EACH TEAM HIGHLIGHT BOXES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team A Last Win */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                    <span className="font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Last Win for {result.teamAName}
                    </span>
                    <span className="font-mono text-slate-400">{result.headToHead.lastWinTeamA?.date || "N/A"}</span>
                  </div>
                  {result.headToHead.lastWinTeamA ? (
                    <>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-black font-mono text-white">
                          Score: {result.headToHead.lastWinTeamA.score}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {result.headToHead.lastWinTeamA.venue}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        {result.headToHead.lastWinTeamA.summary}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No recorded victory in tracked recent meetings.</p>
                  )}
                </div>

                {/* Team B Last Win */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                    <span className="font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Last Win for {result.teamBName}
                    </span>
                    <span className="font-mono text-slate-400">{result.headToHead.lastWinTeamB?.date || "N/A"}</span>
                  </div>
                  {result.headToHead.lastWinTeamB ? (
                    <>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-2xl font-black font-mono text-white">
                          Score: {result.headToHead.lastWinTeamB.score}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {result.headToHead.lastWinTeamB.venue}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        {result.headToHead.lastWinTeamB.summary}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No recorded victory in tracked recent meetings.</p>
                  )}
                </div>
              </div>

              {/* GAME-BY-GAME HISTORICAL MEETINGS TABLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <History className="w-4 h-4 text-purple-400" />
                    Past Meetings & Points Scored Breakdown
                  </h4>
                  <span className="text-xs text-slate-500">
                    Showing last {result.headToHead.historyList.length} meetings
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Season</th>
                        <th className="py-2.5 px-3">Matchup</th>
                        <th className="py-2.5 px-3 text-center">Score</th>
                        <th className="py-2.5 px-3 text-center">Winner</th>
                        <th className="py-2.5 px-3 text-center">Margin</th>
                        <th className="py-2.5 px-3 text-center">ATS Cover</th>
                        <th className="py-2.5 px-3 text-center">O/U Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 bg-slate-900/50">
                      {result.headToHead.historyList.map((g: any, idx: number) => {
                        const isWinA = g.winner === result.teamA;
                        return (
                          <tr key={idx} className="hover:bg-slate-800/40 transition">
                            <td className="py-2 px-3 text-slate-300 whitespace-nowrap">{g.date}</td>
                            <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{g.season}</td>
                            <td className="py-2 px-3 text-white font-medium">
                              {g.awayTeam} @ {g.homeTeam}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-white">
                              <span className={isWinA ? "text-emerald-400" : "text-slate-300"}>{g.teamAScore}</span>
                              <span className="text-slate-500 mx-1">-</span>
                              <span className={!isWinA ? "text-blue-400" : "text-slate-300"}>{g.teamBScore}</span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                isWinA
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                              }`}>
                                {g.winner} WIN
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center font-mono text-slate-400">
                              +{g.margin} pts
                            </td>
                            <td className="py-2 px-3 text-center font-mono text-slate-300 text-[11px]">
                              {g.atsResult}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                g.overUnderResult === "OVER"
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                  : "bg-slate-800 text-slate-400"
                              }`}>
                                {g.overUnderResult} ({g.totalPoints})
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TOUCHDOWN SCORERS (NFL) OR GOAL SCORERS (NHL) */}
          {league === "NFL" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    Touchdown Scorer Probabilities (Who Gets the Touchdowns)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Projected touchdowns per game, anytime TD probabilities, and first TD probabilities from 1,000 simulated games.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Team A Scorers */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{result.teamA}</span>
                      <span>{result.teamAName} Touchdowns</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Yards: {result.teamAYardsRan} Run • {result.teamAYardsThrown} Pass
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800/60 pb-1">
                          <th className="pb-2">Player</th>
                          <th className="pb-2">Pos</th>
                          <th className="pb-2 font-mono text-center">Proj TDs</th>
                          <th className="pb-2 font-mono text-center">Anytime TD %</th>
                          <th className="pb-2 font-mono text-center">First TD %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {result.touchdownScorersA.map((s: any) => (
                          <tr key={s.player} className="hover:bg-slate-850/60 transition">
                            <td className="py-2.5 font-bold text-white">{s.player}</td>
                            <td className="py-2.5 text-slate-400">{s.pos}</td>
                            <td className="py-2.5 font-mono font-bold text-emerald-400 text-center">
                              {s.projectedTds}
                            </td>
                            <td className="py-2.5 font-mono text-slate-200 text-center font-bold">
                              {s.anytimeTdPct}%
                            </td>
                            <td className="py-2.5 font-mono text-amber-400 text-center">
                              {s.firstTdPct}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Team B Scorers */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="font-mono text-blue-400">{result.teamB}</span>
                      <span>{result.teamBName} Touchdowns</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Yards: {result.teamBYardsRan} Run • {result.teamBYardsThrown} Pass
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800/60 pb-1">
                          <th className="pb-2">Player</th>
                          <th className="pb-2">Pos</th>
                          <th className="pb-2 font-mono text-center">Proj TDs</th>
                          <th className="pb-2 font-mono text-center">Anytime TD %</th>
                          <th className="pb-2 font-mono text-center">First TD %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {result.touchdownScorersB.map((s: any) => (
                          <tr key={s.player} className="hover:bg-slate-850/60 transition">
                            <td className="py-2.5 font-bold text-white">{s.player}</td>
                            <td className="py-2.5 text-slate-400">{s.pos}</td>
                            <td className="py-2.5 font-mono font-bold text-blue-400 text-center">
                              {s.projectedTds}
                            </td>
                            <td className="py-2.5 font-mono text-slate-200 text-center font-bold">
                              {s.anytimeTdPct}%
                            </td>
                            <td className="py-2.5 font-mono text-amber-400 text-center">
                              {s.firstTdPct}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    Goal Scorer Probabilities (Who Scores the Goals)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Projected goals per game, anytime goal probabilities, and first goal probabilities from 1,000 simulated games.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Team A Goal Scorers */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{result.teamA}</span>
                      <span>{result.teamAName} Goal Scorers</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Proj Goals: {result.projectedGoalsA}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800/60 pb-1">
                          <th className="pb-2">Player</th>
                          <th className="pb-2">Pos</th>
                          <th className="pb-2 font-mono text-center">Proj Goals</th>
                          <th className="pb-2 font-mono text-center">Anytime Goal %</th>
                          <th className="pb-2 font-mono text-center">First Goal %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {result.goalScorersA.map((s: any) => (
                          <tr key={s.player} className="hover:bg-slate-850/60 transition">
                            <td className="py-2.5 font-bold text-white">{s.player}</td>
                            <td className="py-2.5 text-slate-400">{s.pos}</td>
                            <td className="py-2.5 font-mono font-bold text-emerald-400 text-center">
                              {s.projectedGoals}
                            </td>
                            <td className="py-2.5 font-mono text-slate-200 text-center font-bold">
                              {s.anytimeGoalPct}%
                            </td>
                            <td className="py-2.5 font-mono text-amber-400 text-center">
                              {s.firstGoalPct}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Team B Goal Scorers */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="font-mono text-blue-400">{result.teamB}</span>
                      <span>{result.teamBName} Goal Scorers</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Proj Goals: {result.projectedGoalsB}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800/60 pb-1">
                          <th className="pb-2">Player</th>
                          <th className="pb-2">Pos</th>
                          <th className="pb-2 font-mono text-center">Proj Goals</th>
                          <th className="pb-2 font-mono text-center">Anytime Goal %</th>
                          <th className="pb-2 font-mono text-center">First Goal %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {result.goalScorersB.map((s: any) => (
                          <tr key={s.player} className="hover:bg-slate-850/60 transition">
                            <td className="py-2.5 font-bold text-white">{s.player}</td>
                            <td className="py-2.5 text-slate-400">{s.pos}</td>
                            <td className="py-2.5 font-mono font-bold text-blue-400 text-center">
                              {s.projectedGoals}
                            </td>
                            <td className="py-2.5 font-mono text-slate-200 text-center font-bold">
                              {s.anytimeGoalPct}%
                            </td>
                            <td className="py-2.5 font-mono text-amber-400 text-center">
                              {s.firstGoalPct}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
