import Link from "next/link";
import {
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Award,
  Lock,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <span>⚡ SportsEdge AI Pro 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Advanced NFL & NHL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Situational Intelligence</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Eliminate guesswork with verified defensive blitz tendencies, situational run/pass analytics, NHL power-play scoring distributions, and shorthanded defensive tracking.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/redeem"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-slate-950 text-sm shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Redeem Pro Gift Code
            </Link>
            <Link
              href="/nfl/defense"
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 transition flex items-center gap-2"
            >
              Explore NFL Defense <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 1: NFL Defensive Intelligence */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">NFL Defensive Intelligence</h2>
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO FEATURE
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Granular blitz rates across all downs, short/medium/long yardage, red zone, goal line, 2-minute drills, and opening drives. Includes blitz effectiveness comparison and situational blitz estimator.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified blitz classifications vs pressure/sacks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Situational blitz predictor with sample validation</span>
              </div>
            </div>
          </div>
          <Link
            href="/nfl/defense"
            className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group"
          >
            Launch Defensive Intelligence <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Feature 2: NFL Offensive Tendencies */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">NFL Offensive Tendencies</h2>
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO FEATURE
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Run versus pass percentages mapped to down-and-distance, field position, leading/trailing game state, and after turnovers. Features opponent tendency matchup comparison.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Designed runs vs scrambles and sacks separated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Opponent 3rd-and-long & red-zone matchup tool</span>
              </div>
            </div>
          </div>
          <Link
            href="/nfl/offense"
            className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group"
          >
            Analyze Offensive Tendencies <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Feature 3: NHL Power-Play Intelligence */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">NHL Power-Play Intelligence</h2>
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO FEATURE
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              PP1 & PP2 unit assignment tracking (Confirmed, Reported, Projected, Inferred), player ice time, individual goal/point shares, and power-play conversion metrics.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Player share of team power-play goals & points</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Home/Away, L5, L10, and season conversion splits</span>
              </div>
            </div>
          </div>
          <Link
            href="/nhl/power-play"
            className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group"
          >
            Explore Power-Play Units <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Feature 4: NHL Penalty-Kill Intelligence */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">NHL Penalty Kill Analysis</h2>
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO FEATURE
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Primary PK forwards, defencemen pairs, shorthanded ice time, and true penalty-kill blocked shots distinguished from all-situation blocks. Includes PP vs PK matchup analyzer.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified shorthanded blocked shot tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tactical Power Play vs Penalty Kill matchup engine</span>
              </div>
            </div>
          </div>
          <Link
            href="/nhl/penalty-kill"
            className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group"
          >
            Inspect Penalty Killers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

      {/* Promotional Code Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Have a Promotional Pro Gift Code?</h3>
            <p className="text-xs text-slate-400">
              Redeem 1-Month, 1-Year, or VIP gift access instantly without entering credit card details.
            </p>
          </div>
        </div>
        <Link
          href="/redeem"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
        >
          Redeem Code Now
        </Link>
      </div>
    </div>
  );
}
