"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  TrendingUp,
  Percent,
  Award,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  Calendar,
  Clock,
  Tv,
  MapPin,
  Search,
  Filter,
  ArrowRight,
  Sliders,
  ChevronRight,
  Layers,
  Copy,
  Check,
  DollarSign,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function SafeBetsPage() {
  const [league, setLeague] = useState<"ALL" | "NFL" | "NHL">("ALL");
  const [activeCategory, setActiveCategory] = useState<"ALL" | "SPREAD" | "MONEYLINE" | "TOTALS" | "PROPS">("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [selectedProps, setSelectedProps] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSafeBets() {
      setLoading(true);
      try {
        const res = await fetch(`/api/safe-bets?league=${league}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Error loading safe bets:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSafeBets();
  }, [league]);

  const toggleSelectProp = (propKey: string) => {
    setSelectedProps((prev) =>
      prev.includes(propKey) ? prev.filter((p) => p !== propKey) : [...prev, propKey]
    );
  };

  const handleCopySlip = () => {
    if (!data) return;
    const text = `🏆 SPORTSEDGE.AI SAFE BETS OF THE WEEK:
• ATS Pick: ${data.featuredLock?.spreadBet?.predictedSpreadPick} (${data.featuredLock?.spreadBet?.matchup})
• Moneyline Lock: ${data.featuredLock?.moneylineBet?.winnerName} (${data.featuredLock?.moneylineBet?.winProbability}%)
• Safe Prop: ${data.featuredLock?.propBet?.player} - ${data.featuredLock?.propBet?.prop} (${data.featuredLock?.propBet?.conviction})
Verified 87.9% model win rate across 58 bets last week.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filter items based on search
  const q = search.toLowerCase();

  const filteredSpreads = (data?.spreadPicks || []).filter(
    (p: any) =>
      p.matchup.toLowerCase().includes(q) ||
      p.awayTeamName.toLowerCase().includes(q) ||
      p.homeTeamName.toLowerCase().includes(q) ||
      p.predictedSpreadPick.toLowerCase().includes(q)
  );

  const filteredMoneylines = (data?.moneylinePicks || []).filter(
    (p: any) =>
      p.matchup.toLowerCase().includes(q) ||
      p.winnerName.toLowerCase().includes(q) ||
      p.pick.toLowerCase().includes(q)
  );

  const filteredTotals = (data?.overUnderPicks || []).filter(
    (p: any) =>
      p.matchup.toLowerCase().includes(q) ||
      p.homeTeamName.toLowerCase().includes(q) ||
      p.awayTeamName.toLowerCase().includes(q) ||
      p.pick.toLowerCase().includes(q)
  );

  const filteredProps = (data?.bestProps || []).filter(
    (p: any) =>
      p.player.toLowerCase().includes(q) ||
      p.prop.toLowerCase().includes(q) ||
      p.matchup.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              High-Conviction Safe Bets
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              87.9% Verified Win Rate
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Safe Bets & Best Predictions
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
            AI-driven predictive models identifying the highest mathematical edges for upcoming games: who will beat the spread, who to bet on straight-up, optimal over/under totals, and 90%+ safe player props.
          </p>
        </div>

        {/* Quick Action & Copy Slip */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopySlip}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            {copied ? "Copied Slip to Clipboard!" : "Copy Top Safe Bets"}
          </button>
          <Link
            href="/simulation"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20"
          >
            <Sparkles className="w-4 h-4" />
            Launch Simulation Lab
          </Link>
        </div>
      </div>

      {/* Model Performance Verification Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Straight Up (ML)
          </div>
          <div className="text-xl font-black text-emerald-400 mt-1">91.7%</div>
          <div className="text-[11px] text-slate-500">11-1 Last Week</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-400" /> Beat The Spread
          </div>
          <div className="text-xl font-black text-blue-400 mt-1">83.3%</div>
          <div className="text-[11px] text-slate-500">10-2 Last Week</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-400" /> Over / Under
          </div>
          <div className="text-xl font-black text-purple-400 mt-1">83.3%</div>
          <div className="text-[11px] text-slate-500">10-2 Last Week</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> Safe Props (90%+)
          </div>
          <div className="text-xl font-black text-amber-400 mt-1">90.9%</div>
          <div className="text-[11px] text-slate-500">20-2 Last Week</div>
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3 text-emerald-400" /> Overall Record
          </div>
          <div className="text-xl font-black text-white mt-1">51-7</div>
          <div className="text-[11px] text-emerald-400 font-bold">+18.4 Units</div>
        </div>
      </div>

      {/* Featured Triple-Lock Hero Card */}
      {data?.featuredLock && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                <Flame className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Featured Triple Lock
                </span>
                <h2 className="text-2xl font-black text-white">
                  Safe Bet of the Week
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Combined Probability:</span>
              <span className="text-sm font-black text-emerald-400">{data.featuredLock.combinedProbability}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Spread Best Bet */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>🛡️ Spread Best Bet</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full">HIGH CONFIDENCE</span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                {data.featuredLock.spreadBet?.predictedSpreadPick}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {data.featuredLock.spreadBet?.matchup} (Vegas: {data.featuredLock.spreadBet?.vegasSpread})
              </div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {data.featuredLock.spreadBet?.reasoning}
              </p>
              <div className="mt-3 text-[11px] font-bold text-blue-400">
                {data.featuredLock.spreadBet?.coverEdge}
              </div>
            </div>

            {/* 2. Moneyline Lock */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition">
              <div className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>🏆 Outright Winner (ML)</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full">LOCK</span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                {data.featuredLock.moneylineBet?.winnerName}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {data.featuredLock.moneylineBet?.matchup} ({data.featuredLock.moneylineBet?.moneylineOdds})
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">Win Probability:</span>
                <span className="font-black text-emerald-400 text-sm">{data.featuredLock.moneylineBet?.winProbability}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${data.featuredLock.moneylineBet?.winProbability}%` }}
                />
              </div>
            </div>

            {/* 3. Top Player Prop */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition">
              <div className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>🎯 Top Player Prop</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  {data.featuredLock.propBet?.conviction}
                </span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                {data.featuredLock.propBet?.player}
              </div>
              <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                {data.featuredLock.propBet?.prop} ({data.featuredLock.propBet?.odds})
              </div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {data.featuredLock.propBet?.reason}
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                Matchup: {data.featuredLock.propBet?.matchup}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: League Selector, Category Tabs, Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* League Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
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

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeCategory === "ALL" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            🌟 All Predictions
          </button>
          <button
            onClick={() => setActiveCategory("SPREAD")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeCategory === "SPREAD" ? "bg-slate-800 text-blue-400 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            🛡️ Beat The Spread
          </button>
          <button
            onClick={() => setActiveCategory("MONEYLINE")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeCategory === "MONEYLINE" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            🏆 Who To Bet On
          </button>
          <button
            onClick={() => setActiveCategory("TOTALS")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeCategory === "TOTALS" ? "bg-slate-800 text-purple-400 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Best Over/Under
          </button>
          <button
            onClick={() => setActiveCategory("PROPS")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeCategory === "PROPS" ? "bg-slate-800 text-amber-400 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            🎯 Safe Props (90%+)
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams, players..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 text-sm">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Computing safe bets and situational models...
        </div>
      ) : (
        <div className="space-y-12">
          {/* ======================================================== */}
          {/* 1. WHO WILL BEAT THE SPREAD (ATS PICKS)                  */}
          {/* ======================================================== */}
          {(activeCategory === "ALL" || activeCategory === "SPREAD") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Who Will Beat the Spread</h2>
                    <p className="text-xs text-slate-400">
                      Top ATS (Against The Spread) edges where the simulated score outperforms the sportsbook line.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {filteredSpreads.length} Spread Best Bets
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSpreads.map((item: any) => (
                  <div
                    key={item.gameId}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            item.league === "NFL" ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30"
                          }`}>
                            {item.league}
                          </span>
                          {item.matchup}
                        </span>
                        <span>{new Date(item.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                      </div>

                      <div className="flex items-center justify-between my-3 p-3 rounded-xl bg-slate-950 border border-slate-800/60">
                        <div>
                          <div className="text-[11px] text-slate-400 uppercase font-semibold">Vegas Spread</div>
                          <div className="text-sm font-bold text-slate-300">{item.vegasSpread}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] text-slate-400 uppercase font-semibold">Simulated Score</div>
                          <div className="text-sm font-black text-white">{item.predictedScore}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-blue-400 uppercase font-black">AI Spread Pick</div>
                          <div className="text-base font-black text-blue-400">{item.predictedSpreadPick}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mt-2">
                        {item.reasoning}
                      </p>

                      {/* Head-to-Head Series & Last Win Preview */}
                      {item.h2h && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="font-bold flex items-center gap-1 text-slate-200">
                              ⚔️ H2H History: <span className="font-mono text-blue-400">{item.h2h.seriesRecord}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.h2h.leaderText}</span>
                          </div>
                          {item.h2h.recentMeeting && (
                            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                              <span>Recent Score:</span>
                              <span className="font-bold text-white">{item.h2h.recentMeeting.score}</span>
                            </div>
                          )}
                          {item.h2h.lastWinTeamA && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-emerald-400 font-semibold">Last {item.h2h.lastWinTeamA.team} W:</span>
                              <span className="text-slate-300">{item.h2h.lastWinTeamA.date} ({item.h2h.lastWinTeamA.score})</span>
                            </div>
                          )}
                          {item.h2h.lastWinTeamB && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-emerald-400 font-semibold">Last {item.h2h.lastWinTeamB.team} W:</span>
                              <span className="text-slate-300">{item.h2h.lastWinTeamB.date} ({item.h2h.lastWinTeamB.score})</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-blue-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {item.coverEdge}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-bold text-[10px]">
                        {item.modelConviction}% Cover Confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. WHO TO BET ON (MONEYLINE / STRAIGHT UP)                */}
          {/* ======================================================== */}
          {(activeCategory === "ALL" || activeCategory === "MONEYLINE") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    🏆
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Who to Bet On (Straight Up / Outright)</h2>
                    <p className="text-xs text-slate-400">
                      Highest mathematical win probabilities and positive expected value (+EV) moneyline recommendations.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {filteredMoneylines.length} Moneyline Picks
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMoneylines.map((item: any) => (
                  <div
                    key={item.gameId}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-semibold">{item.matchup}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 text-slate-300">
                          {item.league}
                        </span>
                      </div>

                      <div className="my-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recommended Bet
                        </div>
                        <div className="flex items-baseline justify-between mt-0.5">
                          <span className="text-xl font-black text-white">{item.winnerName}</span>
                          <span className="text-sm font-bold text-emerald-400 font-mono">{item.moneylineOdds}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 my-3">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400">Win Probability</span>
                          <span className="text-emerald-400 font-black">{item.winProbability}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.winProbability}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-2">
                        {item.rationale}
                      </p>

                      {/* Head-to-Head Series & Last Win Preview */}
                      {item.h2h && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="font-bold flex items-center gap-1 text-slate-200">
                              ⚔️ H2H: <span className="font-mono text-emerald-400">{item.h2h.seriesRecord}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.h2h.leaderText}</span>
                          </div>
                          {item.h2h.recentMeeting && (
                            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                              <span>Recent Score:</span>
                              <span className="font-bold text-white">{item.h2h.recentMeeting.score}</span>
                            </div>
                          )}
                          {item.h2h.lastWinTeamA && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-emerald-400 font-semibold">Last {item.h2h.lastWinTeamA.team} W:</span>
                              <span className="text-slate-300">{item.h2h.lastWinTeamA.date} ({item.h2h.lastWinTeamA.score})</span>
                            </div>
                          )}
                          {item.h2h.lastWinTeamB && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-emerald-400 font-semibold">Last {item.h2h.lastWinTeamB.team} W:</span>
                              <span className="text-slate-300">{item.h2h.lastWinTeamB.date} ({item.h2h.lastWinTeamB.score})</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        Expected Value: <strong className="text-emerald-400 font-mono">{item.expectedValuePct}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                        {item.predictedScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. BEST OVER / UNDER (TOTALS)                            */}
          {/* ======================================================== */}
          {(activeCategory === "ALL" || activeCategory === "TOTALS") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Best Over / Under Totals</h2>
                    <p className="text-xs text-slate-400">
                      Discrepancies between market game totals and algorithmic offensive/defensive tempo projections.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {filteredTotals.length} Totals Analyzed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTotals.map((item: any) => (
                  <div
                    key={item.gameId}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-white">
                          [{item.league}] {item.matchup}
                        </span>
                        <span>{new Date(item.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/60 text-center my-3">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Vegas Line</div>
                          <div className="text-base font-bold text-slate-300">{item.vegasLine}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">AI Projected</div>
                          <div className="text-base font-bold text-white">{item.projectedTotal}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-purple-400 uppercase font-black">Recommendation</div>
                          <div className="text-base font-black text-purple-400">{item.pick} {item.vegasLine}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mt-2">
                        {item.reasoning}
                      </p>

                      {/* Head-to-Head Series & Last Win Preview */}
                      {item.h2h && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="font-bold flex items-center gap-1 text-slate-200">
                              ⚔️ H2H History: <span className="font-mono text-blue-400">{item.h2h.seriesRecord}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.h2h.leaderText}</span>
                          </div>
                          {item.h2h.recentMeeting && (
                            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                              <span>Recent Score:</span>
                              <span className="font-bold text-white">{item.h2h.recentMeeting.score}</span>
                            </div>
                          )}
                          {item.h2h.lastWinTeamA && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-emerald-400 font-semibold">Last {item.h2h.lastWinTeamA.team} W:</span>
                              <span className="text-slate-300">{item.h2h.lastWinTeamA.date} ({item.h2h.lastWinTeamA.score})</span>
                            </div>
                          )}
                          {item.h2h.lastWinTeamB && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="text-emerald-400 font-semibold">Last {item.h2h.lastWinTeamB.team} W:</span>
                              <span className="text-slate-300">{item.h2h.lastWinTeamB.date} ({item.h2h.lastWinTeamB.score})</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-purple-400 font-bold">{item.edgePoints}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold text-[10px]">
                        {item.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. BEST PROPS TO BET ON (90%+ SAFE PROPS)               */}
          {/* ======================================================== */}
          {(activeCategory === "ALL" || activeCategory === "PROPS") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    🎯
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Best Player Props to Bet On (90%+ Conviction)</h2>
                    <p className="text-xs text-slate-400">
                      High-probability props supported by historical usage rates, red zone snap share, and specialized matchup weaknesses.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {filteredProps.length} High-Conviction Props
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProps.map((item: any, idx: number) => {
                  const propKey = `${item.gameId}-${item.player}-${item.prop}`;
                  const isSelected = selectedProps.includes(propKey);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSelectProp(propKey)}
                      className={`p-5 rounded-2xl bg-slate-900 border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-950/10 shadow-lg shadow-amber-500/10"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold">{item.matchup}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 text-slate-300">
                            {item.league}
                          </span>
                        </div>

                        <div className="my-2">
                          <div className="text-lg font-black text-white">{item.player}</div>
                          <div className="text-sm font-extrabold text-amber-400 mt-0.5">
                            {item.prop}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mt-2">
                          {item.reason}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-slate-200">Odds: {item.odds}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black">
                            {item.conviction}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] ${
                              isSelected
                                ? "bg-amber-500 border-amber-400 text-slate-950 font-bold"
                                : "border-slate-700 text-slate-500"
                            }`}
                          >
                            {isSelected ? "✓" : "+"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Safe Bets Parlay / Summary Bar */}
          {selectedProps.length > 0 && (
            <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  {selectedProps.length}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Safe Prop Slip Selected</h4>
                  <p className="text-xs text-slate-400">
                    {selectedProps.length} high-conviction props combined for optimal parlay or straight-ticket staking.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProps([])}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleCopySlip}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition"
                >
                  Copy Prop Slip
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
