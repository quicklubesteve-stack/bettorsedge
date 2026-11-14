"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  PlusCircle,
  Copy,
  Check,
  Ban,
  Download,
  ShieldAlert,
  Users,
  Award,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [promos, setPromos] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Generator form state
  const [type, setType] = useState<"ONE_MONTH" | "ONE_YEAR" | "CUSTOM">("ONE_MONTH");
  const [code, setCode] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [maxRedemptions, setMaxRedemptions] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [newUsersOnly, setNewUsersOnly] = useState(false);
  const [allowedEmail, setAllowedEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPromoRedemptions, setSelectedPromoRedemptions] = useState<any[] | null>(null);
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("");

  const loadData = async () => {
    try {
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();

      if (!userData.user || userData.user.role !== "ADMIN") {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);

      const [analyticsRes, promosRes, logsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/promos"),
        fetch("/api/admin/audit-logs"),
      ]);

      const [aData, pData, lData] = await Promise.all([
        analyticsRes.json(),
        promosRes.json(),
        logsRes.json(),
      ]);

      setAnalytics(aData.analytics);
      setPromos(pData.promos || []);
      setAuditLogs(lData.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let seg1 = "";
    let seg2 = "";
    for (let i = 0; i < 4; i++) {
      seg1 += chars.charAt(Math.floor(Math.random() * chars.length));
      seg2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const prefix = type === "ONE_YEAR" ? "SPORTSEDGE-1YEAR" : type === "ONE_MONTH" ? "SPORTSEDGE-30DAY" : "SPORTSEDGE-VIP";
    setCode(`${prefix}-${seg1}-${seg2}`);
  };

  const handleTypeChange = (newType: "ONE_MONTH" | "ONE_YEAR" | "CUSTOM") => {
    setType(newType);
    if (newType === "ONE_MONTH") setDurationDays(30);
    else if (newType === "ONE_YEAR") setDurationDays(365);
    else setDurationDays(60);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormMessage(null);

    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase() || undefined,
          type,
          durationDays,
          maxRedemptions: maxRedemptions ? Number(maxRedemptions) : null,
          startDate: startDate || undefined,
          expiresAt: expiresAt || null,
          isActive,
          newUsersOnly,
          allowedEmail: allowedEmail.trim() || null,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create promo");
      }

      setFormMessage({ text: `Promotional code ${data.promo.code} successfully created!`, isError: false });
      setCode("");
      setNotes("");
      setAllowedEmail("");
      setMaxRedemptions("");
      await loadData();
    } catch (err: any) {
      setFormMessage({ text: err.message, isError: true });
    } finally {
      setSaving(false);
    }
  };

  const handleDisablePromo = async (promoId: string) => {
    if (!confirm("Are you sure you want to disable this promotional code immediately?")) return;
    try {
      const res = await fetch(`/api/admin/promos/${promoId}`, { method: "DELETE" });
      if (res.ok) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400">
          Administrator privileges are required to access this dashboard.
        </p>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">SportsEdge AI Admin Dashboard</h1>
            <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700 text-[10px] font-extrabold uppercase">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage promotional gifts, configure subscription entitlements, and audit redemption activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            download
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Redemptions CSV
          </a>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Codes</span>
            <p className="text-xl font-black text-white">{analytics.totalCodes}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Active</span>
            <p className="text-xl font-black text-emerald-400">{analytics.activeCodes}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400">Expired</span>
            <p className="text-xl font-black text-amber-400">{analytics.expiredCodes}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-red-400">Disabled</span>
            <p className="text-xl font-black text-red-400">{analytics.disabledCodes}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400">Total Redeemed</span>
            <p className="text-xl font-black text-purple-300">{analytics.totalRedemptions}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-400">1-Month Gifts</span>
            <p className="text-xl font-black text-blue-300">{analytics.oneMonthGiftsRedeemed}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-yellow-400">1-Year Gifts</span>
            <p className="text-xl font-black text-yellow-300">{analytics.oneYearGiftsRedeemed}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-900/40 space-y-1 bg-emerald-950/20">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Active Pro Users</span>
            <p className="text-xl font-black text-emerald-400">{analytics.currentPromotionalProUsers}</p>
          </div>
        </div>
      )}

      {/* Main Generator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Generator Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Create Promotional Gift</h2>
          </div>

          {formMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                formMessage.isError
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              }`}
            >
              <span>{formMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSavePromo} className="space-y-4 text-xs">
            {/* Gift Type */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Promotion Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange("ONE_MONTH")}
                  className={`py-2 px-2 rounded-lg font-bold border transition text-center ${
                    type === "ONE_MONTH"
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  1-Month
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("ONE_YEAR")}
                  className={`py-2 px-2 rounded-lg font-bold border transition text-center ${
                    type === "ONE_YEAR"
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  1-Year
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("CUSTOM")}
                  className={`py-2 px-2 rounded-lg font-bold border transition text-center ${
                    type === "CUSTOM"
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Code & Random button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Promotional Code</label>
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate
                </button>
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Leave blank to auto-generate"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono uppercase tracking-wider focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Custom duration */}
            {type === "CUSTOM" && (
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="730"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Max Redemptions */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Allowed Redemptions (Limit)</label>
              <input
                type="number"
                min="1"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                placeholder="Leave empty for unlimited"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Expiration Date</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email restriction */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Recipient Email Restriction (Optional)</label>
              <input
                type="email"
                value={allowedEmail}
                onChange={(e) => setAllowedEmail(e.target.value)}
                placeholder="user@example.com (single user lock)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={newUsersOnly}
                  onChange={(e) => setNewUsersOnly(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>New users only (disallow users with prior subscriptions)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Active immediately upon creation</span>
              </label>
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Internal Admin Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason or campaign tag for this code..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-slate-950 text-xs uppercase tracking-wider transition disabled:opacity-50"
            >
              {saving ? "Saving Promotion..." : "Save Promotion"}
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Codes List & Redemption Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Codes Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Active & Historical Promotional Codes</h3>
              </div>
              <span className="text-xs text-slate-400">{promos.length} total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Code</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Redemptions</th>
                    <th className="pb-3 font-semibold">Expires</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {promos.map((p) => {
                    const isExhausted = p.maxRedemptions !== null && p.timesRedeemed >= p.maxRedemptions;
                    const isExpired = p.expiresAt && new Date(p.expiresAt) < new Date();
                    return (
                      <tr key={p.id} className="hover:bg-slate-850/50">
                        <td className="py-3 font-mono font-bold text-emerald-400 flex items-center gap-2">
                          {p.code}
                          <button
                            onClick={() => handleCopy(p.code, p.id)}
                            title="Copy Code"
                            className="text-slate-500 hover:text-white transition"
                          >
                            {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                        <td className="py-3 text-slate-300">
                          {p.durationDays === 365 ? "1 Year" : p.durationDays === 30 ? "1 Month" : `${p.durationDays}d`}
                        </td>
                        <td className="py-3 text-slate-300 font-medium">
                          {p.timesRedeemed} / {p.maxRedemptions ?? "∞"}
                        </td>
                        <td className="py-3 text-slate-400">
                          {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : "Never"}
                        </td>
                        <td className="py-3">
                          {!p.isActive ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800/60">
                              Disabled
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60">
                              Expired
                            </span>
                          ) : isExhausted ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              Full
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPromoRedemptions(p.redemptions || []);
                              setSelectedPromoCode(p.code);
                            }}
                            className="text-[11px] text-slate-300 hover:text-emerald-400 underline"
                          >
                            Redemptions ({p._count?.redemptions || 0})
                          </button>
                          {p.isActive && (
                            <button
                              onClick={() => handleDisablePromo(p.id)}
                              title="Disable Code"
                              className="text-red-400 hover:text-red-300 text-[11px] font-semibold"
                            >
                              Disable
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Redemptions Drilldown Modal / View */}
          {selectedPromoRedemptions !== null && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">
                  Redemptions for Code: <span className="text-emerald-400 font-mono">{selectedPromoCode}</span>
                </h4>
                <button
                  onClick={() => setSelectedPromoRedemptions(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              {selectedPromoRedemptions.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No redemptions recorded for this promotional code yet.</p>
              ) : (
                <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto text-xs">
                  {selectedPromoRedemptions.map((r) => (
                    <div key={r.id} className="py-2 flex items-center justify-between text-slate-300">
                      <div>
                        <span className="font-semibold text-white">{r.user.email}</span>
                        <span className="ml-2 text-[10px] text-slate-400">
                          Redeemed: {new Date(r.redeemedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-400">
                        Expires: {new Date(r.accessExpires).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Administrator Audit Log */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">Security & Administrative Audit Log</h3>
              </div>
              <span className="text-xs text-slate-400">{auditLogs.length} events</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-300 font-mono text-[11px]">{log.action}</span>
                      <span className="text-[10px] text-slate-400">{log.adminEmail}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
