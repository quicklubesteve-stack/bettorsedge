"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Flame,
  ChevronDown,
  ChevronUp,
  Calculator,
  Percent,
  Compass,
  Trophy,
  Scale,
  Users,
  Target,
} from "lucide-react";

export default function BettingExplainedPage() {
  // Calculator state
  const [betAmount, setBetAmount] = useState<number>(25);
  const [oddsType, setOddsType] = useState<"MINUS" | "PLUS">("MINUS");
  const [oddsValue, setOddsValue] = useState<number>(110);
  const [betCategory, setBetCategory] = useState<"SPREAD" | "MONEYLINE" | "TOTALS" | "PROP">("SPREAD");

  // Calculate potential profit and implied probability
  const numericOdds = oddsType === "PLUS" ? oddsValue : -oddsValue;
  let profit = 0;
  let totalPayout = 0;
  let impliedProbability = 0;

  if (numericOdds > 0) {
    profit = (betAmount * numericOdds) / 100;
    impliedProbability = (100 / (numericOdds + 100)) * 100;
  } else {
    profit = (betAmount * 100) / Math.abs(numericOdds);
    impliedProbability = (Math.abs(numericOdds) / (Math.abs(numericOdds) + 100)) * 100;
  }
  totalPayout = betAmount + profit;

  // Active accordion section state
  const [openSection, setOpenSection] = useState<string>("plusminus");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          The Beginner-to-Pro Playbook
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Sports Betting Explained in Plain English
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          No confusing gambling jargon. Here is how sports betting works, how to read lines, and the exact reasons <strong>why</strong> smart decisions make you money while reckless hunches lose it.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#calculator"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            Try Profit Calculator
          </a>
          <Link
            href="/safe-bets"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20"
          >
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            View Today's Safe Bets
          </Link>
        </div>
      </div>

      {/* 4-Step Quick Decision Flowchart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">The 4-Step Decision Checklist</h2>
            <p className="text-xs text-slate-400">Ask yourself these 4 questions before placing a single dollar on any game.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
              1
            </div>
            <h3 className="font-extrabold text-sm text-white">Who Is Starting?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check starting goalies in hockey and starting quarterbacks or offensive tackles in football.
            </p>
            <div className="text-[11px] font-semibold text-emerald-400 pt-1">
              <strong>Why:</strong> A backup goalie or injured tackle changes the entire game outcome.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs">
              2
            </div>
            <h3 className="font-extrabold text-sm text-white">Rest & Travel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Did the team play yesterday? Did they fly across 3 time zones overnight?
            </p>
            <div className="text-[11px] font-semibold text-blue-400 pt-1">
              <strong>Why:</strong> Tired legs lead to 4th-quarter collapse and lazy penalties in the 3rd period.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
              3
            </div>
            <h3 className="font-extrabold text-sm text-white">Matchup Weakness</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Does a top-3 rushing attack face the 31st-ranked run defense?
            </p>
            <div className="text-[11px] font-semibold text-purple-400 pt-1">
              <strong>Why:</strong> Specific stylistic mismatches beat overall win/loss records every time.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
              4
            </div>
            <h3 className="font-extrabold text-sm text-white">Stick to 1 Unit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never bet more than 1% to 2% of your bankroll on any single game.
            </p>
            <div className="text-[11px] font-semibold text-amber-400 pt-1">
              <strong>Why:</strong> Chasing losses with double-down bets is the #1 way beginners go broke.
            </div>
          </div>
        </div>
      </div>

      {/* Main Educational Concepts Accordion */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl font-black text-white">Core Betting Terms Explained Simply</h2>
        </div>

        {/* 1. PLUS (+) & MINUS (-) ODDS */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("plusminus")}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm">
                +/-
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  1. What Do The Plus (+) and Minus (-) Signs Mean?
                </h3>
                <p className="text-xs text-slate-400">The universal language of odds and payouts.</p>
              </div>
            </div>
            {openSection === "plusminus" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === "plusminus" && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-black text-emerald-400 text-sm mb-1">
                    Minus Sign (-) = THE FAVORITE
                  </div>
                  <p className="text-xs text-slate-300">
                    The team expected to win. The number tells you <strong>how much you must risk</strong> to win $100 profit.
                  </p>
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-200">
                    Example: <strong>-150</strong> means you bet <strong>$150</strong> to make <strong>$100</strong> profit (you get $250 back total).
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-black text-blue-400 text-sm mb-1">
                    Plus Sign (+) = THE UNDERDOG
                  </div>
                  <p className="text-xs text-slate-300">
                    The team with a harder challenge. The number tells you <strong>how much profit you win</strong> on a $100 bet.
                  </p>
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-slate-200">
                    Example: <strong>+150</strong> means you bet <strong>$100</strong> and win <strong>$150</strong> profit (you get $250 back total).
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
                <span className="font-bold text-amber-400">💡 Why Sportsbooks Do This:</span> If both teams paid out the same amount, everyone would just bet on the best team in the world every single time! The plus and minus signs balance the risk, rewarding you with higher payouts when you take a chance on an underdog.
              </div>
            </div>
          )}
        </div>

        {/* 2. THE MONEYLINE */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("moneyline")}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm">
                🏆
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  2. The Moneyline (Straight Up) — "Who Just Wins"
                </h3>
                <p className="text-xs text-slate-400">The simplest and most straightforward bet in sports.</p>
              </div>
            </div>
            {openSection === "moneyline" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === "moneyline" && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                A <strong>Moneyline bet</strong> simply asks: <em>"Who will win this game?"</em> You don't care about point spreads, margin of victory, or blowouts. If the team you bet on wins by 1 point or 40 points, you win your bet!
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Real Matchup Example:</div>
                <div className="flex items-center justify-between text-sm font-black text-white py-1 border-b border-slate-800">
                  <span>Detroit Lions (ML -800)</span>
                  <span className="text-emerald-400">Heavy Favorite</span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-white py-1">
                  <span>Jacksonville Jaguars (ML +550)</span>
                  <span className="text-blue-400">Big Underdog</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-200">
                <span className="font-bold text-blue-400">💡 Why and When to Bet It:</span>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li><strong>Close Rivalry Games:</strong> If you think an underdog like Vegas Golden Knights (+105) has a 55% chance to beat Toronto, a Moneyline bet gives you high return without giving up points.</li>
                  <li><strong>Heavy Favorites in Safe Parlays:</strong> Putting an 85%+ lock (like Detroit ML) into a 2-leg ticket boosts your payout without risking point-spread backdoor covers.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 3. POINT SPREAD & PUCK LINE */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("spread")}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-sm">
                🛡️
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  3. The Point Spread (NFL) & Puck Line (NHL) — "Giving a Head Start"
                </h3>
                <p className="text-xs text-slate-400">How sportsbooks level the playing field between two teams.</p>
              </div>
            </div>
            {openSection === "spread" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === "spread" && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Think of the <strong>Point Spread</strong> like giving your younger sibling a head start in a footrace. The sportsbook subtracts points from the favorite and gives points to the underdog before kickoff.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white text-sm mb-1">Buffalo Bills (-2.5)</div>
                  <p className="text-xs text-slate-300">
                    The Bills start with <strong>-2.5 points</strong>. For your bet to win, Buffalo must win by <strong>3 points or more</strong>!
                  </p>
                  <p className="text-xs text-emerald-400 mt-2 font-mono">
                    Score: Bills 27, Chiefs 24 → 27 - 2.5 = 24.5 > 24 (YOU WIN!)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white text-sm mb-1">Kansas City Chiefs (+2.5)</div>
                  <p className="text-xs text-slate-300">
                    The Chiefs start with <strong>+2.5 points</strong>. They can win the game OR lose by 1 or 2 points, and your bet still wins!
                  </p>
                  <p className="text-xs text-blue-400 mt-2 font-mono">
                    Score: Bills 27, Chiefs 26 → 26 + 2.5 = 28.5 > 27 (YOU WIN!)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-400 text-xs uppercase mb-1">
                  In Hockey: The Puck Line (-1.5 / +1.5)
                </div>
                <p className="text-xs text-slate-300">
                  Because hockey is low-scoring, the puck line is almost always <strong>1.5 goals</strong>. When we picked <strong>Vegas Golden Knights +1.5</strong> against Toronto, Vegas didn't even need to win! If Toronto won 3-2 (a 1-goal game), Vegas +1.5 still cashed!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                <span className="font-bold text-emerald-400">💡 Why and When to Bet It:</span>
                <p className="text-xs mt-1">
                  When a great team is heavily favored, betting the moneyline pays very little. But betting them on the spread (e.g. -6.5) gives you close to even-money payout (+100 or -110) because they have to win by a touchdown.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. OVER / UNDER TOTALS */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("totals")}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-sm">
                ⚡
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  4. Over / Under (Game Totals) — "Cheering for Points, Not Teams"
                </h3>
                <p className="text-xs text-slate-400">You don't care who wins, only how many points/goals are scored.</p>
              </div>
            </div>
            {openSection === "totals" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === "totals" && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                In an <strong>Over / Under bet</strong>, you are predicting whether the <strong>combined total score</strong> of both teams will be higher (OVER) or lower (UNDER) than the sportsbook's posted line.
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase">Real Example: KC Chiefs @ Buffalo Bills (Total: 46.5)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950">
                    <span className="font-bold text-purple-400">If you bet the OVER 46.5:</span>
                    <p className="mt-1 text-slate-300">You want a shootout! A 27-24 final score equals 51 total points. 51 is more than 46.5 → <strong>YOU WIN!</strong></p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950">
                    <span className="font-bold text-purple-400">If you bet the UNDER 46.5:</span>
                    <p className="mt-1 text-slate-300">You want defense and missed field goals! A 20-17 score equals 37 points. 37 is less than 46.5 → <strong>YOU WIN!</strong></p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-200">
                <span className="font-bold text-purple-400">💡 Why and When to Bet It:</span>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li><strong>Bet the OVER:</strong> When two fast-tempo, pass-heavy offenses play indoors or in perfect weather, and both defenses struggle in the red zone.</li>
                  <li><strong>Bet the UNDER:</strong> In rainy, windy, or freezing weather (wind above 15 mph crushes deep passing), or when two rival defensive powerhouses (like Baltimore vs Pittsburgh) play.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 5. PLAYER PROPS */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("props")}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-sm">
                🎯
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  5. Player Props — "Betting on the Player, Not the Team"
                </h3>
                <p className="text-xs text-slate-400">Why props are often the safest and highest-percentage bets in sports.</p>
              </div>
            </div>
            {openSection === "props" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === "props" && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                A <strong>Proposition ("Prop") Bet</strong> is a wager on an individual athlete's performance in a game, regardless of whether their team wins or loses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400">Mitch Marner: Over 0.5 Assists (-135)</div>
                  <p className="text-slate-300 mt-1">
                    Vegas could lose 5-1, but if Marner sets up that single Vegas goal, your bet cashes!
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400">Zach Hyman: Over 3.5 Shots on Goal (-120)</div>
                  <p className="text-slate-300 mt-1">
                    Playing on Connor McDavid's wing, Hyman shoots 4+ pucks on net in 78% of games. Score doesn't matter!
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400">Josh Allen: Over 0.5 Rush Touchdowns (+110)</div>
                  <p className="text-slate-300 mt-1">
                    Buffalo calls quarterback sneaks on 89% of 1-yard goal line attempts. You get plus-money payout on guaranteed volume!
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400">Montgomery / Gibbs Anytime TD (-165)</div>
                  <p className="text-slate-300 mt-1">
                    Detroit has scored a rushing touchdown in 10 consecutive games behind their elite offensive line.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
                <span className="font-bold text-amber-400">💡 Why Player Props Have a 90%+ Hit Rate in Our Models:</span>
                <p className="text-xs mt-1">
                  Game outcomes have high variance (turnovers, weather, fluke ref calls). But a head coach will <strong>never</strong> stop feeding his superstar player. Star volume is the most predictable variable in professional sports!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 6. PARLAYS */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("parlay")}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm">
                🎟️
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  6. What is a Parlay? (The "Lottery Ticket" Trap vs The "Smart 2-Leg")
                </h3>
                <p className="text-xs text-slate-400">How parlays multiply payouts and how to use them safely.</p>
              </div>
            </div>
            {openSection === "parlay" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === "parlay" && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                A <strong>Parlay</strong> is a single bet that combines two or more individual wagers. The odds multiply together for a huge payout, but <strong>every single pick must win</strong>. If you make a 5-team parlay and get 4 right, you still lose 100% of your money.
              </p>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-slate-200">
                <div className="font-bold text-red-400 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4" /> The 8-Team Parlay Trap:
                </div>
                <p className="text-xs">
                  Sportsbooks make over 30% of their annual revenue on amateur bettors building 6, 8, or 10-leg parlays trying to turn $5 into $1,000. Mathematically, the house edge compounds against you with every single leg you add!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                <span className="font-bold text-emerald-400">💡 The Smart Way to Play Parlays:</span>
                <p className="text-xs mt-1">
                  Stick to <strong>2-Leg "Safe Bet" Parlays</strong> combining two independent 90%+ probability events (e.g. <em>Detroit Lions ML + Mitch Marner Over 0.5 Assists</em>). You get a positive payout (+115 to +130) while maintaining a mathematical 85%+ win likelihood!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 7. BANKROLL & UNITS */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => toggleSection("units")}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm">
                💵
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  7. Bankroll Management & What is a "Unit"?
                </h3>
                <p className="text-xs text-slate-400">The secret habit that separates winning bettors from broke ones.</p>
              </div>
            </div>
            {openSection === "units" ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === "units" && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                A <strong>"Unit"</strong> is simply a standard measurement equal to <strong>1% to 2%</strong> of your total sports betting budget (your "bankroll").
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">If your budget is:</div>
                  <div className="text-base font-black text-white mt-1">$200</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">1 Unit = $2 - $4</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">If your budget is:</div>
                  <div className="text-base font-black text-white mt-1">$500</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">1 Unit = $5 - $10</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">If your budget is:</div>
                  <div className="text-base font-black text-white mt-1">$1,000</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">1 Unit = $10 - $20</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-200">
                <span className="font-bold text-blue-400">💡 Why We Use Units (The Mathematical Reason):</span>
                <p className="text-xs mt-1">
                  Even the best sports analytics systems in history have losing days. If you bet $100 on one game and $10 on another, a single bad call can erase 5 wins! Betting 1 to 2 units per game protects you from normal bad luck and lets mathematical compound growth take over.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Odds & Profit Calculator Widget */}
      <div id="calculator" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Interactive Odds & Profit Calculator</h2>
              <p className="text-xs text-slate-400">Test any bet amount and odds to see exact payout and sportsbook implied chance.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            Live Math Engine
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                1. How Much Do You Want to Bet? ($)
              </label>
              <div className="flex items-center gap-2">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBetAmount(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      betAmount === amt
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                2. Enter American Odds (+ or -)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setOddsType("MINUS")}
                    className={`px-3 py-1 rounded font-black transition ${
                      oddsType === "MINUS" ? "bg-slate-800 text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    - (Favorite)
                  </button>
                  <button
                    onClick={() => setOddsType("PLUS")}
                    className={`px-3 py-1 rounded font-black transition ${
                      oddsType === "PLUS" ? "bg-slate-800 text-blue-400" : "text-slate-400"
                    }`}
                  >
                    + (Underdog)
                  </button>
                </div>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min="100"
                    step="5"
                    value={oddsValue}
                    onChange={(e) => setOddsValue(Math.max(100, parseInt(e.target.value) || 100))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="110"
                  />
                </div>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[105, 110, 120, 135, 150, 200].map((v) => (
                  <button
                    key={v}
                    onClick={() => setOddsValue(v)}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    {oddsType === "PLUS" ? `+${v}` : `-${v}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                3. What Type of Bet Is It?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: "SPREAD", label: "Point Spread" },
                  { id: "MONEYLINE", label: "Moneyline" },
                  { id: "TOTALS", label: "Over/Under" },
                  { id: "PROP", label: "Player Prop" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setBetCategory(t.id as any)}
                    className={`p-2 rounded-lg font-bold border transition text-center ${
                      betCategory === t.id
                        ? "bg-slate-800 border-emerald-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Calculated Returns
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Your Bet:</span>
                  <span className="text-sm font-black text-white font-mono">${betAmount.toFixed(2)}</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Pure Profit:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">+${profit.toFixed(2)}</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs text-slate-400">Total Money Back:</span>
                  <span className="text-base font-black text-white font-mono">${totalPayout.toFixed(2)}</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Sportsbook Implied Win Rate:</span>
                  <span className="text-xs font-bold text-blue-400 font-mono">{impliedProbability.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Model Advice for {oddsType === "PLUS" ? `+${oddsValue}` : `-${oddsValue}`}:
              </div>
              <p className="text-slate-400">
                To make long-term profit on these odds, your pick must win more than <strong>{impliedProbability.toFixed(1)}%</strong> of the time. Our Safe Bets tab only recommends plays where algorithmic probability exceeds this number!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Dictionary of Common Slang */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span>📖</span> Quick Glossary of Common Bettor Slang
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400">Push (Tie):</span>
            <p className="text-slate-400 mt-1">When the final score lands exactly on the spread or total (e.g. Bills -3 and they win by 3). You don't win or lose; your bet is 100% refunded.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400">The "Vig" or Juice:</span>
            <p className="text-slate-400 mt-1">The sportsbook's fee. On a standard -110 bet, the $10 difference between risking $110 to win $100 is the casino's commission.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400">Lock:</span>
            <p className="text-slate-400 mt-1">Slang for a high-conviction bet that has an overwhelmingly high probability of hitting based on advanced data.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400">Fade:</span>
            <p className="text-slate-400 mt-1">Betting <em>against</em> a team or public trend. E.g. "Fading the public" means betting the opposite side of what the casual crowd is picking.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400">Backdoor Cover:</span>
            <p className="text-slate-400 mt-1">When a team is losing by 14 points, scores a meaningless touchdown with 10 seconds left, and covers the +7.5 spread!</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400">+EV (Expected Value):</span>
            <p className="text-slate-400 mt-1">A bet where the math is on your side long-term, reversing the casino's house edge in your favor.</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA to explore Safe Bets */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
        <h3 className="text-2xl font-black text-white">Ready to Put This Into Practice?</h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
          Explore our top high-conviction predictions for upcoming games with verified 90%+ hit rate models.
        </p>
        <Link
          href="/safe-bets"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wide uppercase transition shadow-lg shadow-emerald-600/30"
        >
          <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
          Go to Safe Bets Tab
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
