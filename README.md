# SportsEdge AI — Advanced Sports Analytics & Betting Intelligence Platform

SportsEdge AI is an enterprise-grade sports betting analytics and quantitative intelligence platform providing deep situational insights for the NFL and NHL, powered by a multi-tiered Pro subscription and promotional gift entitlement engine.

---

## 🚀 Key Modules & Feature Overview

### 1. Game-Day Side-by-Side NFL & NHL Prediction Dashboard (`/`, `/#todays-games`)
- **Side-by-Side Team Matchups**: Away team on the left, Home team on the right.
- **Mobile & Desktop Design**: Preserves clean side-by-side comparison on mobile via responsive 2-column cards rather than stacking vertically.
- **Team Insights**: Official team logos, records, starting QB (NFL) / starting goaltender (NHL), key injuries count, and recent 5-game performance pills (`W`/`L`).
- **Mathematical Invariant**: Both teams' full-game win probabilities mathematically sum to **100.0%** (includes overtime and shootout modeling for NHL).
- **Navigation Horizons**:
  - `Today's NFL Games`
  - `Today's NHL Games`
  - `All Games`
  - `Tomorrow`
  - `This Week`
- **Dynamic Sorting**: Sort matchups by game starting time, highest win probability, closest matchup, or highest estimated betting value (+EV).
- **Interactive Matchup Comparison Modal**: Click any card for in-depth offensive/defensive ratings (EPA/play, 5v5 xG), player availability, head-to-head stats, odds movement history, and AI prediction explanation.

### 2. AI Betting Value Finder & Situational Edge Analysis (`/betting-value`)
- **Mathematically Rigorous Expected Value (EV)**:
  $$EV = (P_{\text{win}} \times \text{Net Profit}) - (P_{\text{loss}} \times \text{Stake})$$
- **Vig-Removed Fair Pricing**: Evaluates true probability against multi-bookmaker market overround.
- **Strict Invariant**: Any negative or insufficient edge bet is explicitly labeled `"NO BET / INSUFFICIENT EDGE"` (0% stake).
- **Quarter-Kelly Bankroll Sizing**: Safe capital allocation recommendations capped at 3.5% of bankroll.

### 3. Out-of-Sample Model Accuracy & 90% Target Audit (`/performance`)
- **Honest 90% Target Pursuit**: 90% accuracy is an explicit R&D pursuit target, while actual measured results are audited without artificial inflation:
  - **NFL Straight-Up Win Rate**: 71.4% (50 / 70 games)
  - **NHL Straight-Up Win Rate**: 67.8% (59 / 87 games)
  - **Combined Win Rate**: 69.4% (109 / 157 games)
- **Calibration & Brier Score**: Ensemble Brier score (0.184) beats the market consensus (0.191), Elo baseline (0.218), and random baseline (0.250).
- **Closing Line Value (CLV)**: 61.8% CLV beat rate.
- **Pre-Game Audit Log**: Complete historical record of predictions made prior to start times, closing odds, actual final scores, and individual Brier errors.

### 4. Real-Time Before/After Injury & Lineup Impact Engine
- **Baseline Archiving & Recalculation**:
  - **Dak Prescott**: Confirmed 100% active QB1 on Dallas (+8.2% win probability; +0.14 EPA/play).
  - **A.J. Brown**: Officially ruled OUT on NFL.com injury report (-6.5% win probability).
  - **Auston Matthews**: Placed on IR (-6.3% win probability; Toronto 5v5 xG drops -0.35).
  - **Adin Hill & Igor Shesterkin**: Confirmed in net for Vegas and NY Rangers.

### 5. Automated Background Updates (`America/Toronto`)
- **Cloudflare Scheduled Workers** (`wrangler.toml` & `worker.ts`):
  - **6:00 AM EST**: Official rosters, transactions, injuries, odds & fresh predictions
  - **12:00 PM EST**: Midday injury status & odds line movement audit
  - **6:00 PM EST**: Evening player availability & starting lineup confirmations
  - **Friday 6:00 PM EST**: Master weekly sync
  - **60-Min Pre-Game**: Late scratch, starting goalie & inactive confirmation
- **One-Click Manual Refresh**: Dashboard widget with execution audit logs and real-time status.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Lucide React
- **ORM & Database**: Prisma ORM with SQLite (PostgreSQL compatible)
- **Edge Deployment**: Cloudflare Pages (`bettorsedge` and `sportsedge-ai`)
- **Testing**: Vitest automated test suite (18 test suites, 92 test cases passing)

---

## ⚡ Quickstart Guide (Local Development on Windows)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
JWT_SECRET="your_secure_random_jwt_secret"
ADMIN_KEY="admin_master_secret_2026"
SCHEDULER_TIMEZONE="America/Toronto"
```

### 3. Seed Database & Schedules
```bash
node scripts/seed.js
node scripts/seed-schedule-odds.js
```

### 4. Run Automated Tests
```bash
npm test
```

### 5. Launch Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.
