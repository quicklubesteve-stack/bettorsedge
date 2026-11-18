"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

export default function StandingsPage() {
  const [league, setLeague] = useState<"NFL" | "NHL">("NFL");
  const [viewMode, setViewMode] = useState<"DIVISION" | "CONFERENCE" | "PLAYOFF" | "LEAGUE">("DIVISION");
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchStandings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/standings?league=${league}`);
      const data = await res.json();
      setStandings(data.standings || []);
      setLastUpdated(data.lastUpdated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncStandings = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/standings", { method: "POST" });
      const data = await res.json();
      if (data.lastUpdated) {
        setLastUpdated(data.lastUpdated);
      }
      await fetchStandings();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [league]);

  const filtered = standings.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.team.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.division.toLowerCase().includes(q) ||
      t.conference.toLowerCase().includes(q)
    );
  });

  // Groupings
  const divisions = Array.from(new Set(filtered.map((t) => `${t.conference} ${t.division}`)));
  const conferences = Array.from(new Set(filtered.map((t) => t.conference)));

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-white">2025–2026 League Standings</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                  2025–2026 Season
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold uppercase">
                  TSN & Sportsnet Official Feed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Official 2025–2026 standings verified via TSN & Sportsnet: full win/loss records, point differentials, home/away splits, streaks, and playoff seedings for all 32 NFL & 32 NHL franchises.
              </p>
            </div>
          </div>
        </div>

        {/* Sync Button & League Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-slate-400 font-mono">
              Synced: {new Date(lastUpdated).toLocaleDateString()} {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          <button
            onClick={handleSyncStandings}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-emerald-400" : ""}`} />
            {syncing ? "Updating..." : "Keep Up to Date"}
          </button>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setLeague("NFL")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                league === "NFL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              NFL (32 Teams)
            </button>
            <button
              onClick={() => setLeague("NHL")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                league === "NHL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              NHL (32 Teams)
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Bar & Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode("DIVISION")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              viewMode === "DIVISION" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Divisional
          </button>
          <button
            onClick={() => setViewMode("CONFERENCE")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              viewMode === "CONFERENCE" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Conference
          </button>
          <button
            onClick={() => setViewMode("PLAYOFF")}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              viewMode === "PLAYOFF" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Playoff Picture
          </button>
          <button
            onClick={() => setViewMode("LEAGUE")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              viewMode === "LEAGUE" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            League Overall (1–32)
          </button>
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search teams or divisions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading live standings...</div>
      ) : (
        <div className="space-y-8">
          {/* VIEW MODE 1: DIVISIONAL */}
          {viewMode === "DIVISION" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {divisions.map((divName) => {
                const teamsInDiv = filtered
                  .filter((t) => `${t.conference} ${t.division}` === divName)
                  .sort((a, b) =>
                    league === "NFL" ? b.winPct - a.winPct : b.points - a.points
                  );

                return (
                  <div
                    key={divName}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 overflow-hidden shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="font-bold text-white text-sm">{divName}</h3>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {league}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-800/60 pb-1 text-[11px]">
                            <th className="pb-2 font-semibold">Team</th>
                            <th className="pb-2 font-mono text-center">{league === "NFL" ? "W-L-T" : "W-L-OT"}</th>
                            <th className="pb-2 font-mono text-center">{league === "NFL" ? "PCT" : "PTS"}</th>
                            <th className="pb-2 font-mono text-center">{league === "NFL" ? "DIFF" : "DIFF"}</th>
                            <th className="pb-2 font-mono text-center">STRK</th>
                            <th className="pb-2 text-right">Deep Dive</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {teamsInDiv.map((t, idx) => (
                            <tr key={t.team} className="hover:bg-slate-850/60 transition">
                              <td className="py-2.5 font-bold text-white flex items-center gap-2">
                                <span className="font-mono text-emerald-400 text-xs w-8">{t.team}</span>
                                <span className="truncate">{t.name}</span>
                                {idx === 0 && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[9px] font-extrabold uppercase border border-amber-500/20">
                                    1st
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 font-mono text-slate-300 text-center">
                                {league === "NFL" ? `${t.wins}-${t.losses}-${t.ties}` : `${t.wins}-${t.losses}-${t.otLosses}`}
                              </td>
                              <td className="py-2.5 font-mono font-bold text-emerald-400 text-center">
                                {league === "NFL" ? t.winPct.toFixed(3) : t.points}
                              </td>
                              <td
                                className={`py-2.5 font-mono text-center font-bold ${
                                  (league === "NFL" ? t.pointDiff : t.goalDiff) > 0
                                    ? "text-emerald-400"
                                    : (league === "NFL" ? t.pointDiff : t.goalDiff) < 0
                                    ? "text-red-400"
                                    : "text-slate-400"
                                }`}
                              >
                                {(league === "NFL" ? t.pointDiff : t.goalDiff) > 0
                                  ? `+${league === "NFL" ? t.pointDiff : t.goalDiff}`
                                  : (league === "NFL" ? t.pointDiff : t.goalDiff)}
                              </td>
                              <td className="py-2.5 font-mono text-slate-300 text-center">{t.streak}</td>
                              <td className="py-2.5 text-right">
                                <Link
                                  href={league === "NFL" ? `/nfl/defense?team=${t.team}` : `/nhl/power-play?team=${t.team}`}
                                  className="text-[11px] text-emerald-400 hover:underline font-semibold"
                                >
                                  Intel →
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: CONFERENCE */}
          {viewMode === "CONFERENCE" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {conferences.map((confName) => {
                const confTeams = filtered
                  .filter((t) => t.conference === confName)
                  .sort((a, b) =>
                    league === "NFL" ? b.winPct - a.winPct : b.points - a.points
                  );

                return (
                  <div
                    key={confName}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-white text-base">{confName} Conference</h3>
                        <p className="text-[11px] text-slate-400">
                          Top {league === "NFL" ? "7" : "8"} teams qualify for the postseason.
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                        {confTeams.length} Teams
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-800 pb-2">
                            <th className="pb-2 w-8">#</th>
                            <th className="pb-2">Team</th>
                            <th className="pb-2 font-mono text-center">{league === "NFL" ? "W-L-T" : "W-L-OT"}</th>
                            <th className="pb-2 font-mono text-center">{league === "NFL" ? "PCT" : "PTS"}</th>
                            <th className="pb-2 font-mono text-center">Home</th>
                            <th className="pb-2 font-mono text-center">Away</th>
                            <th className="pb-2 font-mono text-center">{league === "NFL" ? "DIFF" : "DIFF"}</th>
                            <th className="pb-2 font-mono text-center">STRK</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {confTeams.map((t, idx) => {
                            const isPlayoffSpot = idx < (league === "NFL" ? 7 : 8);
                            return (
                              <tr
                                key={t.team}
                                className={`hover:bg-slate-850/60 transition ${
                                  idx === (league === "NFL" ? 6 : 7) ? "border-b-2 border-emerald-500/40" : ""
                                }`}
                              >
                                <td className="py-2.5 font-mono text-slate-500 font-bold">{idx + 1}</td>
                                <td className="py-2.5 font-bold text-white flex items-center gap-2">
                                  <span className="font-mono text-emerald-400">{t.team}</span>
                                  <span className="truncate">{t.name}</span>
                                  {isPlayoffSpot && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold uppercase border border-emerald-500/20">
                                      Seed {idx + 1}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 font-mono text-slate-300 text-center">
                                  {league === "NFL" ? `${t.wins}-${t.losses}-${t.ties}` : `${t.wins}-${t.losses}-${t.otLosses}`}
                                </td>
                                <td className="py-2.5 font-mono font-bold text-emerald-400 text-center">
                                  {league === "NFL" ? t.winPct.toFixed(3) : t.points}
                                </td>
                                <td className="py-2.5 font-mono text-slate-400 text-center">{t.homeRecord}</td>
                                <td className="py-2.5 font-mono text-slate-400 text-center">{t.awayRecord}</td>
                                <td
                                  className={`py-2.5 font-mono text-center font-bold ${
                                    (league === "NFL" ? t.pointDiff : t.goalDiff) > 0
                                      ? "text-emerald-400"
                                      : (league === "NFL" ? t.pointDiff : t.goalDiff) < 0
                                      ? "text-red-400"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {(league === "NFL" ? t.pointDiff : t.goalDiff) > 0
                                    ? `+${league === "NFL" ? t.pointDiff : t.goalDiff}`
                                    : (league === "NFL" ? t.pointDiff : t.goalDiff)}
                                </td>
                                <td className="py-2.5 font-mono text-slate-300 text-center">{t.streak}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 3: PLAYOFF PICTURE */}
          {viewMode === "PLAYOFF" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white">Current Projected Postseason Bracket</span>
                    <p className="text-slate-400 text-[11px]">
                      {league === "NFL"
                        ? "Seed 1 receives first-round bye. Seeds 2-4 host Wild Card weekend (Seeds 5-7)."
                        : "Seeds 1-3 from each division qualify, plus 2 Wild Card berths per conference."}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  Playoff Seeds 1–{league === "NFL" ? "7" : "8"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conferences.map((confName) => {
                  const playoffTeams = filtered
                    .filter((t) => t.conference === confName && t.playoffSeed !== null)
                    .sort((a, b) => a.playoffSeed - b.playoffSeed);

                  return (
                    <div
                      key={confName}
                      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
                    >
                      <h3 className="font-bold text-white text-base flex items-center justify-between border-b border-slate-800 pb-3">
                        <span>{confName} Playoff Seeds</span>
                        <span className="text-xs text-emerald-400 font-mono">
                          {playoffTeams.length} Qualifiers
                        </span>
                      </h3>

                      <div className="space-y-3">
                        {playoffTeams.map((t) => (
                          <div
                            key={t.team}
                            className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                              t.playoffSeed === 1
                                ? "bg-emerald-950/30 border-emerald-500/40"
                                : "bg-slate-950/70 border-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                                  t.playoffSeed === 1
                                    ? "bg-emerald-500 text-slate-950"
                                    : "bg-slate-800 text-white"
                                }`}
                              >
                                #{t.playoffSeed}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm">{t.name}</span>
                                  <span className="font-mono text-emerald-400 text-xs">({t.team})</span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {t.division} Division • {t.playoffSeed === 1 ? "1st-Round Bye Winner" : t.playoffSeed <= 4 ? "Division Winner Host" : "Wild Card Qualifier"}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-mono font-bold text-white text-sm block">
                                {league === "NFL" ? `${t.wins}-${t.losses}` : `${t.points} PTS`}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                Streak: {t.streak}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 4: LEAGUE OVERALL */}
          {viewMode === "LEAGUE" && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">All 32 {league} Franchises Overall</h3>
                  <p className="text-[11px] text-slate-400">
                    Comprehensive full league rank order by winning percentage and differentials.
                  </p>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-xs">32 Teams</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800 pb-2">
                      <th className="pb-2 w-10">#</th>
                      <th className="pb-2">Team</th>
                      <th className="pb-2">Conf / Div</th>
                      <th className="pb-2 font-mono text-center">{league === "NFL" ? "W-L-T" : "W-L-OT"}</th>
                      <th className="pb-2 font-mono text-center">{league === "NFL" ? "WIN %" : "POINTS"}</th>
                      <th className="pb-2 font-mono text-center">Home</th>
                      <th className="pb-2 font-mono text-center">Away</th>
                      <th className="pb-2 font-mono text-center">{league === "NFL" ? "DIFF" : "DIFF"}</th>
                      <th className="pb-2 font-mono text-center">STRK</th>
                      <th className="pb-2 font-mono text-center">L10</th>
                      <th className="pb-2 text-right">Intel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filtered
                      .sort((a, b) => (league === "NFL" ? b.winPct - a.winPct : b.points - a.points))
                      .map((t, idx) => (
                        <tr key={t.team} className="hover:bg-slate-850/60 transition">
                          <td className="py-2.5 font-mono text-slate-500 font-bold">{idx + 1}</td>
                          <td className="py-2.5 font-bold text-white flex items-center gap-2">
                            <span className="font-mono text-emerald-400">{t.team}</span>
                            <span>{t.name}</span>
                          </td>
                          <td className="py-2.5 text-slate-400">
                            {t.conference} {t.division}
                          </td>
                          <td className="py-2.5 font-mono text-slate-300 text-center">
                            {league === "NFL" ? `${t.wins}-${t.losses}-${t.ties}` : `${t.wins}-${t.losses}-${t.otLosses}`}
                          </td>
                          <td className="py-2.5 font-mono font-bold text-emerald-400 text-center">
                            {league === "NFL" ? t.winPct.toFixed(3) : t.points}
                          </td>
                          <td className="py-2.5 font-mono text-slate-400 text-center">{t.homeRecord}</td>
                          <td className="py-2.5 font-mono text-slate-400 text-center">{t.awayRecord}</td>
                          <td
                            className={`py-2.5 font-mono text-center font-bold ${
                              (league === "NFL" ? t.pointDiff : t.goalDiff) > 0
                                ? "text-emerald-400"
                                : (league === "NFL" ? t.pointDiff : t.goalDiff) < 0
                                ? "text-red-400"
                                : "text-slate-400"
                            }`}
                          >
                            {(league === "NFL" ? t.pointDiff : t.goalDiff) > 0
                              ? `+${league === "NFL" ? t.pointDiff : t.goalDiff}`
                              : (league === "NFL" ? t.pointDiff : t.goalDiff)}
                          </td>
                          <td className="py-2.5 font-mono text-slate-300 text-center">{t.streak}</td>
                          <td className="py-2.5 font-mono text-slate-400 text-center">{t.lastTen}</td>
                          <td className="py-2.5 text-right">
                            <Link
                              href={league === "NFL" ? `/nfl/defense?team=${t.team}` : `/nhl/power-play?team=${t.team}`}
                              className="text-emerald-400 hover:underline font-semibold text-[11px]"
                            >
                              Inspect →
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
