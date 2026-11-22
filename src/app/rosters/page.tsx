"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  Activity,
  Flame,
  Search,
  RefreshCw,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { NFL_ALL_TEAMS, NHL_ALL_TEAMS } from "@/lib/teams";

export default function RostersPage() {
  const [league, setLeague] = useState<"NFL" | "NHL">("NFL");
  const [selectedTeam, setSelectedTeam] = useState("KC");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INJURIES">("ALL");
  const [rosterData, setRosterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const teamsList = league === "NFL" ? NFL_ALL_TEAMS : NHL_ALL_TEAMS;

  const handleLeagueChange = (newLeague: "NFL" | "NHL") => {
    setLeague(newLeague);
    setSelectedTeam(newLeague === "NFL" ? "KC" : "EDM");
  };

  const fetchRosters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rosters?league=${league}&team=${selectedTeam}`);
      const data = await res.json();
      setRosterData(data);
    } catch (e) {
      console.error("Failed to load rosters:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRosters();
  }, [league, selectedTeam]);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch("/api/rosters/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ league, force: true }),
      });
      const data = await res.json();
      setSyncFeedback(data.message || "Rosters updated successfully!");
      await fetchRosters();
    } catch (e) {
      setSyncFeedback("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  // Filter players based on search and injury status
  const allTeamPlayers = rosterData?.players || [];
  const activeCount = allTeamPlayers.filter((p: any) => p.status === "ACTIVE").length;
  const injuredCount = allTeamPlayers.filter((p: any) => p.status !== "ACTIVE").length;

  const filteredPlayers = allTeamPlayers.filter((p: any) => {
    if (statusFilter === "ACTIVE" && p.status !== "ACTIVE") return false;
    if (statusFilter === "INJURIES" && p.status === "ACTIVE") return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.position.toLowerCase().includes(term) ||
      p.roleDescription.toLowerCase().includes(term) ||
      (p.injuryDetails && p.injuryDetails.toLowerCase().includes(term))
    );
  });

  const currentTeamInfo = teamsList.find((t) => t.abbr === selectedTeam) || {
    name: selectedTeam,
    conference: "",
    division: "",
  };

  // Format dates for display
  const lastSyncDate = rosterData?.syncMeta?.lastSyncedAt
    ? new Date(rosterData.syncMeta.lastSyncedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Nov 14, 2026";

  const nextSyncDate = rosterData?.syncMeta?.nextSyncDue
    ? new Date(rosterData.syncMeta.nextSyncDue).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Nov 21, 2026";

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Users className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-white">Current Active Team Rosters</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Updated Weekly
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Active depth charts, star player impact weights, and injury statuses for all 32 NFL & 32 NHL franchises.
              </p>
            </div>
          </div>
        </div>

        {/* League Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleLeagueChange("NFL")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                league === "NFL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              NFL Rosters
            </button>
            <button
              onClick={() => handleLeagueChange("NHL")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                league === "NHL" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              NHL Rosters
            </button>
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            title="Update Rosters Weekly Sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Updating..." : "Sync Weekly"}
          </button>
        </div>
      </div>

      {/* SYNC NOTIFICATION BANNER */}
      {syncFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* WEEKLY SYNC STATUS BAR */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
            Roster Status
          </span>
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active & Current</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
            Last Weekly Sync
          </span>
          <span className="font-mono font-bold text-white flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {lastSyncDate}
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
            Next Scheduled Update
          </span>
          <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            {nextSyncDate} (Every 7 Days)
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">
            Teams & Depth Tracked
          </span>
          <span className="font-mono font-bold text-slate-200">
            32 Franchises • {rosterData?.syncMeta?.totalPlayers || 225}+ Players
          </span>
        </div>
      </div>

      {/* TEAM SELECTOR & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 shrink-0">Select Team:</span>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
          >
            {teamsList.map((t) => (
              <option key={t.abbr} value={t.abbr}>
                {t.name} ({t.abbr})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search player, position, role..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* TEAM HEADER CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-black text-xl text-emerald-400 shadow-inner">
            {selectedTeam}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{currentTeamInfo.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{currentTeamInfo.conference} Conference</span>
              <span>•</span>
              <span>{currentTeamInfo.division} Division</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Current Active Roster & Injury Statuses</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/simulation/matchup"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 shrink-0"
          >
            <Cpu className="w-3.5 h-3.5" />
            Simulate in Matchup Lab →
          </Link>
        </div>
      </div>

      {/* FILTER TABS: ALL / ACTIVE / INJURIES */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border ${
            statusFilter === "ALL"
              ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          All Players ({allTeamPlayers.length})
        </button>
        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border ${
            statusFilter === "ACTIVE"
              ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/20"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Active Players ({activeCount})
        </button>
        <button
          onClick={() => setStatusFilter("INJURIES")}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition border flex items-center gap-1.5 ${
            statusFilter === "INJURIES"
              ? "bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-600/20"
              : injuredCount > 0
              ? "bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Injury Report ({injuredCount})
        </button>
      </div>

      {/* ROSTER TABLE */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading current team roster...</span>
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
          No players found matching your search.
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Active Roster & Depth Chart ({filteredPlayers.length} Players)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Weekly Update Schedule: Automatic Every 7 Days
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800/80 pb-2">
                  <th className="pb-2.5 font-mono">#</th>
                  <th className="pb-2.5">Player Name</th>
                  <th className="pb-2.5">Pos</th>
                  <th className="pb-2.5">Unit / Role</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Season Stats Summary</th>
                  <th className="pb-2.5 text-right font-mono">
                    {league === "NFL" ? "TD Weight" : "Goal Weight"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredPlayers.map((player: any) => {
                  const isStarter = player.depthOrder === 1;
                  const isInjured = player.status === "QUESTIONABLE" || player.status === "OUT" || player.status === "IR";

                  return (
                    <tr key={player.id} className="hover:bg-slate-850/60 transition">
                      <td className="py-3 font-mono font-bold text-slate-400">
                        {player.jerseyNumber ? `#${player.jerseyNumber}` : "-"}
                      </td>
                      <td className="py-3 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{player.name}</span>
                          {isStarter && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase">
                              Starter
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                          {player.position}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">
                        <span className="font-medium">{player.roleDescription}</span>
                      </td>
                      <td className="py-3">
                        {player.status === "ACTIVE" ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            Active
                          </span>
                        ) : player.status === "QUESTIONABLE" ? (
                          <span
                            className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold"
                            title={player.injuryDetails || "Questionable"}
                          >
                            {player.injuryDetails || "Questionable"}
                          </span>
                        ) : (
                          <span
                            className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold"
                            title={player.injuryDetails || "Out"}
                          >
                            {player.injuryDetails || player.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono text-slate-300 text-[11px]">
                        {player.statsSummary}
                      </td>
                      <td className="py-3 font-mono font-bold text-emerald-400 text-right">
                        {league === "NFL"
                          ? player.touchdownWeight > 0
                            ? `${(player.touchdownWeight * 100).toFixed(0)}%`
                            : "—"
                          : player.goalWeight > 0
                          ? `${(player.goalWeight * 100).toFixed(0)}%`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
