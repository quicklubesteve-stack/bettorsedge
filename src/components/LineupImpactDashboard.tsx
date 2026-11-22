"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowRight, ShieldAlert, Sparkles, ExternalLink, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { LineupImpactEvent } from "@/lib/lineup-change-monitor";

export default function LineupImpactDashboard() {
  const [events, setEvents] = useState<LineupImpactEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [leagueFilter, setLeagueFilter] = useState<"ALL" | "NFL" | "NHL">("ALL");

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const url = leagueFilter === "ALL" ? "/api/lineup-impact" : `/api/lineup-impact?league=${leagueFilter}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Failed to load lineup impact events", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [leagueFilter]);

  return (
    <section id="lineup-impact" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 border border-cyan-500/20">
              <Activity className="w-3 h-3" /> Real-Time Lineup & Injury Impact Engine
            </span>
            <span className="text-xs text-slate-400">Before & After Probability Recalculation</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Before / After Injury & Starting Lineup Shifts
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            When key news breaks (starting QB, goaltender in net, IR designations), the baseline prediction is archived and recalculations are triggered instantly.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          {(["ALL", "NFL", "NHL"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setLeagueFilter(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                leagueFilter === tab
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab === "ALL" ? "All Updates" : `${tab} Only`}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-cyan-500 mb-3"></div>
          <p className="text-sm">Auditing latest injury updates from official NFL.com and NHL.com feeds...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="text-sm">No recent lineup adjustments recorded for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-6">
          {events.map((event) => {
            const isPositive = event.probDelta > 0;
            return (
              <div
                key={event.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {event.league}
                      </span>
                      <span className="text-xs font-bold text-slate-300">{event.matchup}</span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(event.timestamp).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          timeZone: "America/Toronto",
                        })}{" "}
                        EST
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {event.headline}
                    </h3>
                  </div>

                  {/* Before / After Probability Shift */}
                  <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 self-start lg:self-auto">
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Before</div>
                      <div className="text-sm font-bold text-slate-400 font-mono">{event.beforeWinProb}%</div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">After</div>
                      <div className="text-sm font-black text-white font-mono">{event.afterWinProb}%</div>
                    </div>

                    <div className="pl-2 border-l border-slate-800 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Impact</div>
                      <div
                        className={`text-sm font-black font-mono flex items-center justify-center gap-0.5 ${
                          isPositive ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {isPositive ? `+${event.probDelta}%` : `${event.probDelta}%`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tactical Explanation & Verified Source */}
                <div className="pt-3 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="leading-relaxed text-slate-400">
                    <span className="font-semibold text-slate-300">Tactical Adjustment:</span> {event.tacticalRationale}
                  </p>
                  <a
                    href={event.verifiedSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 font-medium"
                  >
                    <span>Verified Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
