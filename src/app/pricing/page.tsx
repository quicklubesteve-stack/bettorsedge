"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

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

  const handleTogglePlan = async (targetPlan: "FREE" | "PRO") => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setUpgrading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPlan }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        await fetchUser();
        router.refresh();
      } else {
        setActionMessage(data.error || "Failed to update plan");
      }
    } catch (e: any) {
      setActionMessage(e.message);
    } finally {
      setUpgrading(false);
    }
  };

  const isCurrentPro = Boolean(user && (user.isProActive || user.role === "ADMIN"));

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Membership Tiers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Choose Your SportsEdge Tier</h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Start free with core situational overviews or unlock Pro for verified blitz tracking, predictive situational models, and special-teams distributions.
        </p>

        {actionMessage && (
          <div className="max-w-md mx-auto p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            {actionMessage}
          </div>
        )}
      </div>

      {/* Two Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* TIER 1: FREE PLAN */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Free Bettor</h3>
                <p className="text-xs text-slate-400">Essential situational metrics & overview research</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold uppercase border border-slate-700">
                Tier 1
              </span>
            </div>

            <div className="py-2">
              <span className="text-4xl font-black text-white font-mono">$0</span>
              <span className="text-xs text-slate-400 font-medium ml-2">/ month, forever free</span>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Overall NFL run vs pass rates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1st down offensive tendencies</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Overall defensive play counts & 1st down blitz snapshot</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full 32-Team NFL & NHL league leaderboards (/rankings)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free Head-to-Head team matchup compare tool</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NHL team season power-play & penalty-kill %</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All-situation blocked shots total</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <X className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="line-through">2nd, 3rd & 4th down blitz situational breakdowns</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <X className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="line-through">Situational Blitz Predictor with confidence validation</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <X className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="line-through">PP1/PP2 unit assignment statuses & goal share table</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <X className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="line-through">Verified shorthanded blocked shots</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            {user && !isCurrentPro ? (
              <div className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider text-center border border-slate-700">
                ✓ Current Active Plan
              </div>
            ) : user && isCurrentPro ? (
              <button
                onClick={() => handleTogglePlan("FREE")}
                disabled={upgrading}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition border border-slate-700"
              >
                {upgrading ? "Switching..." : "Switch to Free Tier (Test Mode)"}
              </button>
            ) : (
              <Link
                href="/auth/register"
                className="block w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center transition"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>

        {/* TIER 2: PAID PRO PLAN */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border-2 border-emerald-500/50 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow">
            RECOMMENDED FOR SERIOUS BETTORS
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>SportsEdge AI Pro</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-emerald-400 font-semibold">
                  Complete situational intelligence & predictive models
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold uppercase border border-amber-500/30">
                Tier 2
              </span>
            </div>

            <div className="py-2">
              <span className="text-4xl font-black text-white font-mono">$29</span>
              <span className="text-xs text-slate-400 font-medium ml-2">/ month or $249 / year</span>
              <div className="mt-1">
                <span className="inline-block text-[11px] text-emerald-300 font-bold">
                  🎁 Or free via Administrator Promotional Gift Code
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Full NFL Blitz Intelligence (1st–4th down, distance brackets)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Danger Zones: Red Zone, inside-10, goal-line, 2-minute drills</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Situational Blitz Predictor with statistical sample validation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Blitz Effectiveness: Sacks, pressures, explosive plays allowed</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Advanced Offensive Tendencies + Opponent Clash Matchups</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">NHL PP1 & PP2 Units (Confirmed, Reported, Projected statuses)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Individual Player Share of Team PP Goals & Points</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Primary PK Pairs + Verified Shorthanded Blocked Shots</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">PP vs PK Tactical AI Matchup Engine</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Pro Head-to-Head Game Simulator (Win %, Yards Ran/Thrown, TD & Goal Scorers)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            {isCurrentPro ? (
              <div className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider text-center shadow">
                ★ Pro Access Active on Your Account
              </div>
            ) : user ? (
              <button
                onClick={() => handleTogglePlan("PRO")}
                disabled={upgrading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
              >
                {upgrading ? "Upgrading to Pro..." : "Upgrade to Pro (Test Mode Instant)"}
              </button>
            ) : (
              <Link
                href="/auth/register"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider text-center transition shadow-lg shadow-emerald-500/20"
              >
                Sign Up for Pro Access
              </Link>
            )}

            <div className="text-center">
              <Link
                href="/redeem"
                className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" /> Have a Gift Code? Redeem 1-Month or 1-Year Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white text-center">Side-by-Side Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Capability</th>
                <th className="pb-3 font-semibold text-center w-36">Free Bettor Tier</th>
                <th className="pb-3 font-semibold text-center w-36 text-emerald-400 font-bold">Pro Member Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 text-slate-300 font-medium">NFL Overall Run vs Pass Rates</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">NFL 1st Down Tendencies</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">NFL 2nd, 3rd, 4th Down Blitz Rates</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Full Breakdown</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">NFL Red Zone & Goal-Line Danger Zones</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">Situational Blitz Predictor Model</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Validated ($n \ge 10$)</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">Blitz Effectiveness vs Standard 4-Man Rush</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">Opponent Tendency Clash Matchup Engine</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">NHL PP1 & PP2 Unit Lineup Cards</td>
                <td className="py-3 text-center text-slate-500">Preview Only</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Full Units</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">Individual Goal & Point Share Attributions</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">Primary Penalty-Killing Pairs & SH TOI</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">Verified Shorthanded Blocked Shots Isolation</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Strictly Isolated</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300 font-medium">PP vs PK Tactical AI Matchup Comparison</td>
                <td className="py-3 text-center text-slate-500">—</td>
                <td className="py-3 text-center text-emerald-400 font-bold">Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
