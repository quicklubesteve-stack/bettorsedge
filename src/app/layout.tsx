import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SportsEdge AI — Advanced Sports Analytics & Betting Intelligence",
  description: "Advanced NFL blitz intelligence, offensive tendency models, NHL special teams analysis, and Pro subscription system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 SportsEdge AI Inc. Advanced Sports Analytics Platform.</p>
            <p className="text-[11px] text-slate-500">
              Responsible Sports Research & Modeling. Unverified data flagged per regulatory standards.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
