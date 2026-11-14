"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoadingUser(false);
      })
      .catch(() => {
        setUser(null);
        setLoadingUser(false);
      });
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError(null);
    setSuccessResult(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to redeem code");
      }

      setSuccessResult(data);
      setCode("");
      // Refresh user details
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      setUser(userData.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Promotional Access Grant</span>
        </div>
        <h1 className="text-3xl font-black text-white">Redeem Pro Gift Code</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Enter your unique promotional code to unlock SportsEdge AI Pro features with zero credit card required.
        </p>
      </div>

      {/* Main Card */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        {!loadingUser && !user ? (
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Account Required to Redeem</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Please log in or create a free account to apply your promotional gift code to your profile.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        ) : (
          <>
            {successResult ? (
              <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Code Successfully Redeemed!</h3>
                  <p className="text-sm font-semibold text-emerald-300">{successResult.message}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/80 border border-emerald-900/60 text-xs text-left space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Applied Code:</span>
                    <span className="font-mono font-bold text-white">{successResult.code}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Pro Access Granted:</span>
                    <span className="font-bold text-emerald-400">
                      {successResult.durationDays} Days Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Access Expiration Date:</span>
                    <span className="font-bold text-slate-200">
                      {new Date(successResult.accessExpires).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/nfl/defense"
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    Open NFL Defensive Intelligence
                  </Link>
                  <Link
                    href="/account"
                    className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                  >
                    View Account Expiry
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRedeem} className="space-y-4">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="code" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Promotional Gift Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SPORTSEDGE-30DAY-GIFT"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base uppercase tracking-wider placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <p className="text-[11px] text-slate-500">
                    Codes are case-insensitive and can be entered with or without hyphens.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !code.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-slate-950 text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    "Validating & Redeeming..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Apply Promotional Code
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* Feature Guarantees */}
        <div className="border-t border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">No Credit Card Required</p>
              <p className="text-[11px] text-slate-400">Gift codes are 100% free with no billing details required.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">No Automatic Renewal Charges</p>
              <p className="text-[11px] text-slate-400">
                When your gift access period ends, your account seamlessly returns to Free. You will never be billed automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
