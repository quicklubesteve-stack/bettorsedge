"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Award,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

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
        <h1 className="text-3xl font-black text-white">Your Account & Subscription</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your membership entitlements, expiration dates, and access perks.</p>
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
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                Plan: {user.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Entitlement Details */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Pro Membership Status</span>
            {user.isProActive ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Active Pro Entitlement
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400">Standard Free Access</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400">Current Plan Tier</span>
              <p className="text-base font-bold text-white">{user.plan} Membership</p>
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
                  : "No Active Pro Access"}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-start gap-2 pt-2 border-t border-slate-900">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Gift subscriptions expire automatically at the specified date without renewing or charging your account.
              You will return to the Free membership unless you explicitly purchase a paid subscription.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Link
            href="/redeem"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-slate-950 text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Redeem Another Promo Code
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
