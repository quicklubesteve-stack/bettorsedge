"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShieldAlert,
  Zap,
  Activity,
  Award,
  KeyRound,
  User,
  LogOut,
  LogIn,
  Layers,
  Sparkles,
  CreditCard,
  Trophy,
  Cpu,
  Calendar,
  Users,
  Brain,
  Flame,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/auth/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/safe-bets", label: "Safe Bets 🔥", icon: Flame, pro: false },
    { href: "/betting-explained", label: "Betting Explained 💡", icon: BookOpen, pro: false },
    { href: "/rosters", label: "Team Rosters", icon: Users, pro: false },
    { href: "/standings", label: "Standings", icon: Trophy, pro: false },
    { href: "/schedule", label: "Game Odds & Props", icon: Calendar, pro: false },
    { href: "/rankings", label: "32-Team Analytics", icon: Sparkles, pro: false },
    { href: "/simulation", label: "Simulation Lab (90%+)", icon: Cpu, pro: false },
    { href: "/learning", label: "AI Learning", icon: Brain, pro: false },
    { href: "/nfl/defense", label: "NFL Defense", icon: ShieldAlert, pro: true },
    { href: "/nfl/offense", label: "NFL Offense", icon: Zap, pro: true },
    { href: "/nhl/power-play", label: "NHL Power Play", icon: Activity, pro: true },
    { href: "/nhl/penalty-kill", label: "NHL Penalty Kill", icon: Layers, pro: true },
    { href: "/pricing", label: "Plans", icon: CreditCard, pro: false },
    { href: "/redeem", label: "Redeem Gift", icon: Award, pro: false },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
                SE
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition">
                  SPORTSEDGE<span className="text-emerald-400">.AI</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  NFL & NHL Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${isActive
                    ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {item.pro && (
                    <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      PRO
                    </span>
                  )}
                </Link>
              );
            })}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${pathname.startsWith("/admin")
                  ? "bg-purple-900/40 text-purple-300 border border-purple-700"
                  : "text-purple-300 hover:text-white hover:bg-purple-900/30"
                  }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* User actions & Tier Badges */}
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-2">
                {/* Plan status pill */}
                {user.plan === "PRO" ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> PRO VIP
                  </span>
                ) : (
                  <Link
                    href="/pricing"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold uppercase tracking-wider transition"
                  >
                    <span>FREE TIER</span> • <span className="underline font-black">UPGRADE</span>
                  </Link>
                )}

                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="font-semibold text-slate-200 leading-none">{user.name || user.email.split("@")[0]}</p>
                    <span
                      className={`inline-block text-[9px] font-bold uppercase mt-0.5 ${user.plan === "PRO" ? "text-amber-400" : "text-slate-400"
                        }`}
                    >
                      {user.plan} Plan
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View Plans
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
