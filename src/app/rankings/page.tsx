"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Search,
  Filter,
  TrendingUp,
  Shield,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
  GitCompare,
} from "lucide-react";

export default function RankingsPage() {
  const [league, setLeague] = useState<"NFL" | "NHL">("NFL");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [conference, setConference] = useState("ALL");
  const [sortBy, setSortBy] = useState<string>("blitzRate");
  const [compareA, setCompareA] = useState("KC");
  const [compareB, setCompareB] = useState("SF");

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rankings?league=${league}`);
      const json = await res.json();
      setData(json.rankings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    if (league === "NFL") {
      setSortBy("blitzRate");
      setCompareA("KC");
      setCompareB("SF");
    } else {
      setSortBy("ppPct");
      setCompareA("EDM");
      setCompareB("TOR");
    }
  }, [league]);

  const filtered = data
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.abbr.toLowerCase().includes(search.toLowerCase());
      const matchesConf = conference === "ALL" || item.conference === conference;
      return matchesSearch && matchesConf;
    })
    .sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));

  const itemA = data.find((d) => d.abbr === compareA) || data[0];
  const itemB = data.find((d) => d.abbr === compareB) || data[1] || data[0];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white">League Intelligence & Team Rankings</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
              Free Tier Feature
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete 32-team situational rankings across the NFL and NHL. Search, compare, and inspect any franchise.
          </p>
        </div>

        {/* League Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setLeague("NFL")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              league === "NFL"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            NFL (32 Teams)
          </button>
          <button
            onClick={() => setLeague("NHL")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              league === "NHL"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            NHL (32 Teams)
          </button>
        </div>
      </div>

      {/* FREE FEATURE: HEAD-TO-HEAD MATCHUP ENGINE */}
      {data.length > 0 && itemA && itemB && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-emerald-900/40 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Free Head-to-Head Matchup Comparison</h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                    Free Feature
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Compare any two franchises from the 32-team database with statistical delta calculations.
                </p>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">Team 1:</span>
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-bold"
                >
                  {data.map((t) => (
                    <option key={t.abbr} value={t.abbr}>
                      {t.name} ({t.abbr})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-slate-500 font-black">VS</span>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">Team 2:</span>
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-blue-400 font-bold"
                >
                  {data.map((t) => (
                    <option key={t.abbr} value={t.abbr}>
                      {t.name} ({t.abbr})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Comparison Metrics */}
          {league === "NFL" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Blitz Rate */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-medium">Defensive Blitz Frequency</span>
                <div className="flex items-center justify-between text-base font-mono font-bold">
                  <span className="text-emerald-400">{itemA.blitzRate}%</span>
                  <span className="text-slate-500 text-xs">vs</span>
                  <span className="text-blue-400">{itemB.blitzRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${
                        (itemA.blitzRate / ((itemA.blitzRate + itemB.blitzRate) || 1)) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-blue-500 h-full"
                    style={{
                      width: `${
                        (itemB.blitzRate / ((itemA.blitzRate + itemB.blitzRate) || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {itemA.blitzRate > itemB.blitzRate
                    ? `${itemA.name} blitzes +${(itemA.blitzRate - itemB.blitzRate).toFixed(1)}% more`
                    : itemA.blitzRate < itemB.blitzRate
                    ? `${itemB.name} blitzes +${(itemB.blitzRate - itemA.blitzRate).toFixed(1)}% more`
                    : "Even blitz frequencies"}
                </p>
              </div>

              {/* Pressure Rate */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-medium">Total Pressure Rate</span>
                <div className="flex items-center justify-between text-base font-mono font-bold">
                  <span className="text-emerald-400">{itemA.pressureRate}%</span>
                  <span className="text-slate-500 text-xs">vs</span>
                  <span className="text-blue-400">{itemB.pressureRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${
                        (itemA.pressureRate / ((itemA.pressureRate + itemB.pressureRate) || 1)) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-blue-500 h-full"
                    style={{
                      width: `${
                        (itemB.pressureRate / ((itemA.pressureRate + itemB.pressureRate) || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Sacks: {itemA.sacks} ({itemA.abbr}) vs {itemB.sacks} ({itemB.abbr})
                </p>
              </div>

              {/* Pass/Run Tendency */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-medium">Offensive Pass / Run Ratio</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-400">
                      {itemA.abbr}: {itemA.passRate}% Pass
                    </span>
                    <span className="text-slate-400">{itemA.runRate}% Run</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-blue-400">
                      {itemB.abbr}: {itemB.passRate}% Pass
                    </span>
                    <span className="text-slate-400">{itemB.runRate}% Run</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  {itemA.passRate > itemB.passRate
                    ? `${itemA.abbr} is more pass-oriented (+${(itemA.passRate - itemB.passRate).toFixed(1)}%)`
                    : `${itemB.abbr} is more pass-oriented (+${(itemB.passRate - itemA.passRate).toFixed(1)}%)`}
                </p>
              </div>

              {/* Quick Launch Actions */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                <span className="text-slate-400 font-medium">Deep Dive Navigation</span>
                <div className="space-y-2">
                  <Link
                    href={`/nfl/defense?team=${itemA.abbr}`}
                    className="block text-center py-1.5 px-3 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-600/30 transition"
                  >
                    Inspect {itemA.abbr} Defense →
                  </Link>
                  <Link
                    href={`/nfl/offense?team=${itemB.abbr}`}
                    className="block text-center py-1.5 px-3 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold hover:bg-blue-600/30 transition"
                  >
                    Inspect {itemB.abbr} Offense →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* PP% */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-medium">Power-Play % (PP%)</span>
                <div className="flex items-center justify-between text-base font-mono font-bold">
                  <span className="text-emerald-400">{itemA.ppPct}%</span>
                  <span className="text-slate-500 text-xs">vs</span>
                  <span className="text-blue-400">{itemB.ppPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${
                        (itemA.ppPct / ((itemA.ppPct + itemB.ppPct) || 1)) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-blue-500 h-full"
                    style={{
                      width: `${
                        (itemB.ppPct / ((itemA.ppPct + itemB.ppPct) || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {itemA.ppPct > itemB.ppPct
                    ? `${itemA.name} PP% edge (+${(itemA.ppPct - itemB.ppPct).toFixed(1)}%)`
                    : `${itemB.name} PP% edge (+${(itemB.ppPct - itemA.ppPct).toFixed(1)}%)`}
                </p>
              </div>

              {/* PK% */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-medium">Penalty-Kill % (PK%)</span>
                <div className="flex items-center justify-between text-base font-mono font-bold">
                  <span className="text-emerald-400">{itemA.pkPct}%</span>
                  <span className="text-slate-500 text-xs">vs</span>
                  <span className="text-blue-400">{itemB.pkPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${
                        (itemA.pkPct / ((itemA.pkPct + itemB.pkPct) || 1)) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-blue-500 h-full"
                    style={{
                      width: `${
                        (itemB.pkPct / ((itemA.pkPct + itemB.pkPct) || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {itemA.pkPct > itemB.pkPct
                    ? `${itemA.name} PK% edge (+${(itemA.pkPct - itemB.pkPct).toFixed(1)}%)`
                    : `${itemB.name} PK% edge (+${(itemB.pkPct - itemA.pkPct).toFixed(1)}%)`}
                </p>
              </div>

              {/* Net Special Teams Index */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-medium">Special Teams Net Index</span>
                <div className="flex items-center justify-between text-base font-mono font-bold">
                  <span className="text-purple-400">{itemA.specialTeamsIndex}</span>
                  <span className="text-slate-500 text-xs">vs</span>
                  <span className="text-purple-300">{itemB.specialTeamsIndex}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Formula: (PP% + PK%). A score &gt; 100 represents net-positive special teams play.
                </p>
                <p className="text-[10px] text-emerald-400 font-bold">
                  SH Blocks: {itemA.shBlockedShots} ({itemA.abbr}) vs {itemB.shBlockedShots} ({itemB.abbr})
                </p>
              </div>

              {/* Quick Launch Actions */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                <span className="text-slate-400 font-medium">Deep Dive Navigation</span>
                <div className="space-y-2">
                  <Link
                    href={`/nhl/power-play?team=${itemA.abbr}`}
                    className="block text-center py-1.5 px-3 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-600/30 transition"
                  >
                    Inspect {itemA.abbr} PP →
                  </Link>
                  <Link
                    href={`/nhl/penalty-kill?team=${itemB.abbr}`}
                    className="block text-center py-1.5 px-3 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold hover:bg-blue-600/30 transition"
                  >
                    Inspect {itemB.abbr} PK →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search team or abbreviation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={conference}
              onChange={(e) => setConference(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
            >
              <option value="ALL">All Conferences</option>
              {league === "NFL" ? (
                <>
                  <option value="AFC">AFC</option>
                  <option value="NFC">NFC</option>
                </>
              ) : (
                <>
                  <option value="Eastern">Eastern</option>
                  <option value="Western">Western</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
          >
            {league === "NFL" ? (
              <>
                <option value="blitzRate">Blitz Frequency (%)</option>
                <option value="pressureRate">Pressure Rate (%)</option>
                <option value="passRate">Offensive Pass %</option>
                <option value="runRate">Offensive Run %</option>
                <option value="sacks">Total Sacks</option>
              </>
            ) : (
              <>
                <option value="ppPct">Power-Play % (PP%)</option>
                <option value="pkPct">Penalty-Kill % (PK%)</option>
                <option value="specialTeamsIndex">Special Teams Index (PP% + PK%)</option>
                <option value="shBlockedShots">Shorthanded Blocks</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          {league === "NFL" ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold w-12">#</th>
                  <th className="pb-3 font-semibold">Team</th>
                  <th className="pb-3 font-semibold">Conf / Div</th>
                  <th className="pb-3 font-semibold font-mono text-center">Blitz Rate</th>
                  <th className="pb-3 font-semibold font-mono text-center">Pressure Rate</th>
                  <th className="pb-3 font-semibold font-mono text-center">Pass %</th>
                  <th className="pb-3 font-semibold font-mono text-center">Run %</th>
                  <th className="pb-3 font-semibold text-right">Quick Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item, idx) => (
                  <tr key={item.abbr} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{item.abbr}</span>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {item.conference} {item.division}
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-400 text-center">
                      {item.blitzRate}%
                    </td>
                    <td className="py-3 font-mono font-bold text-blue-400 text-center">
                      {item.pressureRate}%
                    </td>
                    <td className="py-3 font-mono text-slate-300 text-center">{item.passRate}%</td>
                    <td className="py-3 font-mono text-slate-300 text-center">{item.runRate}%</td>
                    <td className="py-3 text-right space-x-2">
                      <Link
                        href={`/nfl/defense?team=${item.abbr}`}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
                      >
                        Defense
                      </Link>
                      <span className="text-slate-600">•</span>
                      <Link
                        href={`/nfl/offense?team=${item.abbr}`}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline"
                      >
                        Offense
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold w-12">#</th>
                  <th className="pb-3 font-semibold">Team</th>
                  <th className="pb-3 font-semibold">Conf / Div</th>
                  <th className="pb-3 font-semibold font-mono text-center">Power-Play (PP%)</th>
                  <th className="pb-3 font-semibold font-mono text-center">Penalty-Kill (PK%)</th>
                  <th className="pb-3 font-semibold font-mono text-center">Net Index (PP + PK)</th>
                  <th className="pb-3 font-semibold font-mono text-center">SH Blocks</th>
                  <th className="pb-3 font-semibold text-right">Quick Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item, idx) => (
                  <tr key={item.abbr} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{item.abbr}</span>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {item.conference} {item.division}
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-400 text-center">
                      {item.ppPct}%
                    </td>
                    <td className="py-3 font-mono font-bold text-blue-400 text-center">
                      {item.pkPct}%
                    </td>
                    <td className="py-3 font-mono font-bold text-purple-400 text-center">
                      {item.specialTeamsIndex}
                    </td>
                    <td className="py-3 font-mono text-slate-300 text-center">
                      {item.shBlockedShots}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Link
                        href={`/nhl/power-play?team=${item.abbr}`}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
                      >
                        Power Play
                      </Link>
                      <span className="text-slate-600">•</span>
                      <Link
                        href={`/nhl/penalty-kill?team=${item.abbr}`}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline"
                      >
                        Penalty Kill
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
