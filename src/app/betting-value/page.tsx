import Navbar from "@/components/Navbar";
import BettingValueDashboard from "@/components/BettingValueDashboard";
import LineupImpactDashboard from "@/components/LineupImpactDashboard";
import ScheduleSyncWidget from "@/components/ScheduleSyncWidget";

export const metadata = {
  title: "AI Betting Value Finder & Situational Edge | SportsEdge.AI",
  description: "Mathematically rigorous Expected Value (+EV) calculations, vig-removed market fair prices, and quarter-Kelly bankroll allocation.",
};

export default function BettingValuePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScheduleSyncWidget />
        <BettingValueDashboard />
        <LineupImpactDashboard />
      </main>
    </div>
  );
}
