"use client";

import { useEffect, useState } from "react";
import { Clock, RefreshCw, CheckCircle2, Cloud, AlertCircle, Calendar } from "lucide-react";
import { ScheduleStatus } from "@/lib/schedule-sync-service";

export default function ScheduleSyncWidget() {
  const [status, setStatus] = useState<ScheduleStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/schedule-sync");
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (e) {
      console.error("Failed to load schedule status:", e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/schedule-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "Dashboard One-Click Refresh" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Sync completed! Official rosters, odds & predictions are up to date.");
        setStatus(data.currentStatus);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (e) {
      console.error("Manual sync failed:", e);
    } finally {
      setSyncing(false);
    }
  };

  if (!status) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left side: Timezone and next schedules */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
              <Cloud className="w-3 h-3" /> Cloudflare Cron Trigger Active
            </span>
            <span className="text-xs text-slate-400">Server-Side Scheduled Updates</span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Automated Intelligence Schedule (America/Toronto)
          </h3>
          <p className="text-xs text-slate-400">
            Daily sync at <strong className="text-slate-200">6:00 AM</strong>, <strong className="text-slate-200">12:00 PM</strong>, <strong className="text-slate-200">6:00 PM EST</strong>, plus <strong className="text-slate-200">60-Min Pre-Game</strong> and Friday Master Weekly Sync.
          </p>
        </div>

        {/* Right side: Manual trigger button & status indicator */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
              syncing
                ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing League Feeds..." : "Refresh Intelligence Now"}</span>
          </button>

          <button
            onClick={() => setShowLogs(!showLogs)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition border border-slate-700"
          >
            {showLogs ? "Hide Logs" : "View Logs"}
          </button>
        </div>
      </div>

      {/* Success notification */}
      {successMessage && (
        <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Expandable Logs Drawer */}
      {showLogs && (
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Schedule Execution Log:
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {status.recentLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white">{log.jobName}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold">
                    {log.status}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{log.actualRunTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
