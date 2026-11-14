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

3. **Data Verification & Provider Classification**:
   - True blitz tracking requires specialized pass-rush feeds (e.g. PFF or Sportradar Advanced).
   - Never infer a blitz simply from a sack, incomplete pass, or QB pressure.
   - If verified blitz data is null, the frontend must display:
     `"Verified blitz data is unavailable for this game or situation."`
   - Shorthanded blocked shots must be strictly isolated from all-situation blocked shots.

4. **Security & Brute Force Throttling**:
   - All promotional code lookups must be performed via SHA-256 hashed code values (`codeHash`).
   - Enforce database transaction concurrency for code redemptions to prevent race condition over-redemption.
   - Admin routes (`/api/admin/*`) require server-side verification of `role === "ADMIN"`. Never trust frontend state.

---

## 📂 Codebase Layout

```
sports betting/
├── prisma/
│   └── schema.prisma        # Database schema (User, PromoCode, Redemption, Entitlement, NflPlay, NhlStats)
├── scripts/
│   └── seed.js              # Database seeder with mock dev fixtures & test accounts
├── src/
│   ├── app/                 # Next.js App Router (Layouts, Pages, Server API routes)
│   ├── components/          # Reusable UI components (Navbar, widgets)
│   └── lib/                 # Core business logic:
│       ├── auth.ts          # Authentication, password hashing, session tokens, role checks
│       ├── db.ts            # Prisma client singleton
│       ├── promo.ts         # Promo code generator, redemption transaction, admin analytics
│       ├── nfl-analytics.ts # Blitz calculations, situational predictor, run vs pass logic
│       ├── nhl-analytics.ts # PP units, PK analysis, shorthanded blocked shots, matchups
│       └── data-providers.ts# Provider capabilities, licensing flags, status monitors
└── tests/                   # Vitest automated test suite (25 test cases)
```
