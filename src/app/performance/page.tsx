import Navbar from "@/components/Navbar";
import ModelPerformanceDashboard from "@/components/ModelPerformanceDashboard";
import LineupImpactDashboard from "@/components/LineupImpactDashboard";
import ScheduleSyncWidget from "@/components/ScheduleSyncWidget";

export const metadata = {
  title: "AI Model Performance & 90% Target Audit | SportsEdge.AI",
  description: "Walk-forward out-of-sample accuracy evaluation, Brier scores, calibration curves, and closing line value (CLV) benchmark.",
};

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScheduleSyncWidget />
        <ModelPerformanceDashboard />
        <LineupImpactDashboard />
      </main>
    </div>
  );
}
