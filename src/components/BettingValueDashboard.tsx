"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  ArrowUpDown, 
  DollarSign, 
  Info, 
  Percent, 
  Sparkles, 
  Calculator,
  AlertCircle
} from "lucide-react";
import { BettingValueCalculation } from "@/lib/betting-value-engine";

export default function BettingValueDashboard() {
  const [opportunities, setOpportunities] = useState<BettingValueCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [leagueFilter, setLeagueFilter] = useState<"ALL" | "NFL" | "NHL">("ALL");
  const [sortField, setSortField] = useState<"ev" | "winProb" | "edge" | "time">("ev");
  const [onlyPositiveEV, setOnlyPositiveEV] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchBettingValue = async () => {
    setLoading(true);
    try {
      const leagueParam = leagueFilter !== "ALL" ? `&league=${leagueFilter}` : "";
      const res = await fetch(`/api/betting-value?sort=${sortField}${leagueParam}`);
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.opportunities || []);
      }
    } catch (e) {
      console.error("Failed to load betting value opportunities:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBettingValue();
  }, [leagueFilter, sortField]);

  const filteredOpportunities = opportunities.filter((item) => {
    if (onlyPositiveEV && item.valueRating === "NO BET / INSUFFICIENT EDGE") {
      return false;
    }
    return true;
  });

  const highValueCount = opportunities.filter((o) => o.valueRating === "HIGH VALUE").length;
  const modValueCount = opportunities.filter((o) => o.valueRating === "MODERATE VALUE").length;
  const noBetCount = opportunities.filter((o) => o.valueRating === "NO BET / INSUFFICIENT EDGE").length;

  return (
    <section id="betting-value-finder" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> AI +EV Value Finder & Analysis
            </span>
            <span className="text-xs text-slate-400">Vig-Removed Market Calibrated</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            AI Betting Value Finder & Situational Edge Analysis
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Expected Value EV = (P(win) × Profit) - (P(loss) × Stake) with quarter-Kelly bankroll sizing. 
            Under-valued lines flagged automatically.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>High +EV: {highValueCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span>Moderate +EV: {modValueCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-medium flex items-center gap-1.5 shadow-sm">
            <span>No Edge / Pass: {noBetCount}</span>
          </div>
        </div>
      </div>

      {/* Control bar: League tabs, sorting, filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(["ALL", "NFL", "NHL"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setLeagueFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                leagueFilter === tab
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab === "ALL" ? "All Games" : `${tab} Only`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="ev">Expected Value (+EV $ / $100)</option>
              <option value="winProb">AI Win Probability (%)</option>
              <option value="edge">Edge vs Vig-Free Market (%)</option>
              <option value="time">Game Time</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={onlyPositiveEV}
              onChange={(e) => setOnlyPositiveEV(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Filter Out "NO BET"</span>
          </label>
        </div>
      </div>

      {/* Grid of Betting Opportunities */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-emerald-500 mb-3"></div>
          <p className="text-sm font-medium">Calculating multi-book consensus vig-free probabilities & EV...</p>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="py-16 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 my-4">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
          <p className="text-slate-300 font-bold text-base">No Matching Betting Opportunities Found</p>
          <p className="text-slate-500 text-xs mt-1">Try toggling off "Filter Out NO BET" to inspect full market calculations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {filteredOpportunities.map((item, idx) => {
            const isNoBet = item.valueRating === "NO BET / INSUFFICIENT EDGE";
            const isHighVal = item.valueRating === "HIGH VALUE";
            const isModVal = item.valueRating === "MODERATE VALUE";
            const isExpanded = expandedId === `${item.gameId}-${item.team}`;

            return (
              <div
                key={`${item.gameId}-${item.team}-${idx}`}
                className={`rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isNoBet
                    ? "bg-slate-950/60 border-slate-800/70 hover:border-slate-700"
                    : isHighVal
                    ? "bg-gradient-to-b from-emerald-950/40 to-slate-950 border-emerald-600/60 hover:border-emerald-500 shadow-lg shadow-emerald-950/20"
                    : "bg-gradient-to-b from-teal-950/30 to-slate-950 border-teal-700/50 hover:border-teal-500"
                }`}
              >
                <div className="p-4">
                  {/* Top Bar: League badge & Value Rating */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.league} • {item.gameTime}
                    </span>

                    {isNoBet ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/80 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-slate-400" /> NO BET / INSUFFICIENT EDGE
                      </span>
                    ) : isHighVal ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-sans tracking-wide flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 fill-slate-950" /> HIGH +EV EDGE
                      </span>
                    ) : isModVal ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> MODERATE +EV
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-900/40">
                        LEAN VALUE
                      </span>
                    )}
                  </div>

                  {/* Team & Opponent */}
                  <div className="mb-3">
                    <div className="text-lg font-black text-white flex items-center justify-between">
                      <span>{item.team}</span>
                      <span className="text-emerald-400 font-mono text-base">
                        {item.americanOdds > 0 ? `+${item.americanOdds}` : item.americanOdds}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>vs {item.opponent}</span>
                      <span className="font-mono text-slate-400 text-[11px]">Dec: {item.decimalOdds.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Probability Comparison Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80 text-center mb-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">AI Win %</div>
                      <div className="text-sm font-black text-white font-mono">{item.aiWinProb}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Vig-Free Fair</div>
                      <div className="text-sm font-bold text-slate-300 font-mono">{item.vigFreeImpliedProb}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Edge</div>
                      <div
                        className={`text-sm font-black font-mono ${
                          item.edge > 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {item.edge > 0 ? `+${item.edge}%` : `${item.edge}%`}
                      </div>
                    </div>
                  </div>

                  {/* EV & Kelly Metrics */}
                  <div className="flex items-center justify-between py-1.5 px-2 bg-slate-950/80 rounded-lg border border-slate-800/50 text-xs mb-3">
                    <div className="flex items-center gap-1 text-slate-300">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Expected Value:</span>
                    </div>
                    <div
                      className={`font-mono font-black ${
                        item.evPer100 > 0 ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      {item.evPer100 > 0 ? `+$${item.evPer100.toFixed(2)}` : `$${item.evPer100.toFixed(2)}`} / $100
                    </div>
                  </div>

                  {/* Quarter Kelly Bankroll sizing */}
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-2">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calculator className="w-3 h-3 text-slate-400" /> Kelly Bankroll Stake:
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {item.kellyRecommendedStakePct > 0 ? `${item.kellyRecommendedStakePct}%` : "0.0% (Pass)"}
                    </span>
                  </div>

                  {/* Accordion Toggle for Explanation */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : `${item.gameId}-${item.team}`)}
                    className="w-full text-left text-[11px] text-slate-400 hover:text-emerald-400 flex items-center justify-between pt-1 border-t border-slate-800/60 transition"
                  >
                    <span>{isExpanded ? "Hide tactical rationale" : "View tactical rationale & best line"}</span>
                    <Info className="w-3 h-3" />
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1.5 animate-fadeIn">
                      <p>{item.recommendationExplanation}</p>
                      <div className="pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Best Line: {item.marketConsensus.bestBook}</span>
                        <span>Line Trend: {item.marketConsensus.closingLineTrend}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer methodology note */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Strict Invariant: Zero synthetic probability inflation. Games lacking minimum sample size (n ≥ 10) are marked with explicit uncertainty.
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Formula: EV = (P(win) × Net Profit) - (P(loss) × Stake)
        </div>
      </div>
    </section>
  );
}
