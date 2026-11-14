"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Award,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  CreditCard,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleToggleTier = async (targetPlan: "FREE" | "PRO") => {
    setUpdating(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPlan }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(data.message);
        await fetchUser();
        router.refresh();
      } else {
        setStatusMsg(data.error || "Failed to switch plan");
      }
    } catch (e: any) {
      setStatusMsg(e.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-xs">Loading account profile...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Please Sign In</h2>
        <p className="text-xs text-slate-400">You must be logged in to view your account profile.</p>
        <Link
          href="/auth/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Your Account & Plan Tiers</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your membership tier, test free vs paid features, and view access expiration dates.
        </p>

        {statusMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            {statusMsg}
          </div>
        )}
      </div>

      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Profile Info */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-black text-emerald-400">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.name || "SportsEdge Bettor"}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                Role: {user.role}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  user.plan === "PRO"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-slate-800 text-emerald-400 border border-slate-700"
                }`}
              >
                Current Tier: {user.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Entitlement Details */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Tier Access Status</span>
            {user.isProActive ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4" /> Pro Tier Unlocked
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-400">Free Tier Active</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400">Current Membership</span>
              <p className="text-base font-bold text-white">{user.plan} Plan</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400">Pro Expiration Date</span>
              <p className="text-base font-mono font-bold text-emerald-400">
                {user.proExpiresAt
                  ? new Date(user.proExpiresAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : user.plan === "PRO"
                  ? "Indefinite / Permanent"
                  : "No Active Pro Access (Free Tier)"}
              </p>
            </div>
          </div>

          {/* Quick Tier Switcher (Test & Demo Control) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Instant Tier Switcher (Test & Demo Mode)</span>
              <span className="text-[10px] text-slate-500 font-mono">1-Click Toggle</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {user.plan === "FREE" ? (
                <button
                  onClick={() => handleToggleTier("PRO")}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs uppercase transition disabled:opacity-50"
                >
                  {updating ? "Switching..." : "Upgrade to Pro Tier (Test Mode)"}
                </button>
              ) : (
                <button
                  onClick={() => handleToggleTier("FREE")}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition disabled:opacity-50"
                >
                  {updating ? "Switching..." : "Downgrade to Free Tier (Test Mode)"}
                </button>
              )}

              <Link
                href="/pricing"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs transition border border-slate-700"
              >
                View Plans Table
              </Link>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Link
            href="/redeem"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-slate-950 text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Redeem Promotional Gift Code
          </Link>

          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 font-semibold text-xs transition"
            >
              Open Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
