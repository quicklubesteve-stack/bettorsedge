# AGENTS.md — AI Agent & Developer Architecture Guidelines

This document provides architectural standards and invariants for AI agents and developers working on the SportsEdge AI codebase.

---

## 🔒 Invariant System Rules

1. **Do Not Overwrite or Break Existing Subscriptions**:
   - The user entitlement engine distinguishes `PROMO_CODE` entitlements from `STRIPE_SUBSCRIPTION`.
   - Never cancel or alter a Stripe subscription when a user redeems a gift code.
   - Gift codes must stack on top of existing remaining time (`user.proExpiresAt`).
   - When gift access expires, users gracefully revert to `FREE` without auto-charging.

2. **No Fabricated / Hallucinated Probabilities**:
   - For situational predictors (NFL Blitz Predictor, Offensive Tendency Query), always enforce minimum sample size constraints ($n \ge 10$ for estimates, $n \ge 30$ for high confidence).
   - If sample size $n < 10$, return `statisticalEstimate: null` and explicit uncertainty warnings.
   - Never present a player's past scoring share as their upcoming game goal probability.
   - Never perform naive percentage subtraction (`PP% - PK%`) to produce a match outcome probability.
   - Both teams' full-game win probabilities must mathematically sum to 100.0%. For NHL, full-game win probability includes overtime and shootouts.
   - 90% accuracy is an explicit long-term R&D benchmark target; real measured performance is audited honestly with walk-forward validation and Brier scores without artificial inflation.

3. **Data Verification & Provider Classification**:
   - True blitz tracking requires specialized pass-rush feeds (e.g. PFF or Sportradar Advanced).
   - Never infer a blitz simply from a sack, incomplete pass, or QB pressure.
   - If verified blitz data is null, the frontend must display:
     `"Verified blitz data is unavailable for this game or situation."`
   - Shorthanded blocked shots must be strictly isolated from all-situation blocked shots.
   - Sportsbook odds must be displayed separately from AI win probabilities. Never describe sportsbook odds as the AI's prediction. If disconnected, display `"Odds Unavailable"`.

4. **Side-by-Side Matchup Architecture**:
   - Left side: Away team.
   - Right side: Home team.
   - On mobile devices, preserve the side-by-side comparison using compact 2-column cards rather than stacking teams vertically.
   - Displays starting quarterback for NFL, starting goaltender for NHL, significant injuries count, and recent 5-game performance.
   - Supports navigation time horizons: "Today's NFL Games", "Today's NHL Games", "All Games", "Tomorrow", "This Week".
   - Sortable by: Game starting time, Highest win probability, Closest matchup, Highest estimated betting value (+EV).

5. **Security & Brute Force Throttling**:
   - All promotional code lookups must be performed via SHA-256 hashed code values (`codeHash`).
   - Enforce database transaction concurrency for code redemptions to prevent race condition over-redemption.
   - Admin routes (`/api/admin/*`) require server-side verification of `role === "ADMIN"`. Never trust frontend state.

---

## 📂 Codebase Layout

```
sports betting/
├── prisma/
│   └── schema.prisma        # Database schema (User, PromoCode, Redemption, Entitlement, NflPlay, NhlStats, ScheduledGame)
├── scripts/
│   ├── seed.js              # Database seeder with mock dev fixtures & test accounts
│   └── seed-schedule-odds.js# Official 2026-2027 schedules, rosters, and consensus odds
├── src/
│   ├── app/                 # Next.js App Router (Layouts, Pages, Server API routes)
│   │   ├── api/today-games/ # Game-day side-by-side prediction endpoint
│   │   ├── api/betting-value/ # AI +EV Value Finder endpoint
│   │   ├── api/performance/ # Walk-forward accuracy audit endpoint
│   │   └── api/schedule-sync/ # Automated scheduler status endpoint
│   ├── components/          # Reusable UI components:
│   │   ├── TodaysGamesDashboard.tsx # Side-by-side matchup cards with 2-column mobile layout
│   │   ├── BettingValueDashboard.tsx # +EV betting analysis and quarter-Kelly staking
│   │   ├── LineupImpactDashboard.tsx # Before/after injury recalculation engine
│   │   ├── ModelPerformanceDashboard.tsx # Calibration curves & 90% target audit
│   │   └── ScheduleSyncWidget.tsx # America/Toronto sync status & one-click trigger
│   └── lib/                 # Core business logic:
│       ├── auth.ts          # Authentication, password hashing, session tokens, role checks
│       ├── db.ts            # Prisma client singleton
│       ├── today-games-service.ts # Side-by-side game enrichment & horizon filtering
│       ├── win-probability-engine.ts # Multi-factor Bayesian win probability engine
│       ├── betting-value-engine.ts # EV, vig-removed probabilities, quarter-Kelly
│       ├── model-performance.ts # Brier score, calibration buckets, out-of-sample audit
│       └── lineup-change-monitor.ts # Before/after injury impact monitoring
├── worker.ts                # Cloudflare Scheduled Worker (6 AM, 12 PM, 6 PM, 60-min pre-game)
├── wrangler.toml            # Cloudflare Cron triggers configuration
└── tests/                   # Vitest automated test suite (18 test suites, 92 test cases)
```
