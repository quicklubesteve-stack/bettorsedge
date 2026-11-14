# SportsEdge AI — Advanced Sports Analytics & Betting Intelligence Platform

SportsEdge AI is an enterprise-grade sports betting analytics and quantitative intelligence platform providing deep situational insights for the NFL and NHL, powered by a multi-tiered Pro subscription and promotional gift entitlement engine.

---

## 🚀 Key Modules & Feature Overview

### 1. NFL Defensive Intelligence (`/nfl/defense`)
- **Situational Blitz Analysis**: Granular frequency calculations across 1st–4th down, distance brackets (short, medium, long), danger zones (red zone $\le$ 20 yd, inside 10 yd, goal line $\le$ 5 yd), 2-minute drills, score status, quarters, opening drives, and after turnovers.
- **Blitz Effectiveness vs Non-Blitz**: Direct side-by-side comparison of completion percentage allowed, yards allowed per play, sacks, QB pressures, explosive plays allowed, and touchdowns.
- **Situational Blitz Predictor**: Statistical estimate engine based strictly on qualifying historical snaps ($n \ge 30$ High, $10 \le n < 30$ Moderate, $n < 10$ Low/Uncertain). Never fabricates exact probabilities from insufficient sample sizes.
- **Data Quality & Licensing Indicators**: Clear verification indicators. Displays `"Verified blitz data is unavailable for this game or situation."` whenever true tracking feeds are absent.

### 2. NFL Offensive Tendencies (`/nfl/offense`)
- **Run vs Pass Analysis**: Categorizes designed runs, passes, scrambles, sacks, kneels, spikes, and no-play penalties. Allows users to toggle denominator exclusions.
- **Situational Query Engine**: Multi-variable snap filter for down, distance, yard line, quarter, and score differential.
- **Opponent Clash Matchup**: Direct comparison of offensive play-calling tendencies against upcoming opponent defensive blitz rates (e.g., 3rd-and-long pass rate vs blitz rate).

### 3. NHL Power-Play Intelligence (`/nhl/power-play`)
- **PP1 & PP2 Unit Tracking**: Lineup tracking labeled as **Confirmed**, **Reported**, **Projected**, or **Inferred**.
- **Player Scoring Contribution Table**: Player PP goals, assists, points, shots, shooting %, average PP ice time, and individual share of team PP goals/points.
- **Team Power-Play Statistics**: Standard calculation $\text{PP}\% = (\text{PP Goals} / \text{PP Opportunities}) \times 100$, with Home/Away, L5, and L10 splits.

### 4. NHL Penalty-Kill Intelligence (`/nhl/penalty-kill`)
- **Penalty-Killing Pairs & Units**: Top forward and defencemen pairs, shorthanded ice time (TOI/G), and player availability/injury reports.
- **Shorthanded Blocked Shots**: **Strictly separates all-situation blocked shots from verified penalty-kill blocked shots.**
- **Tactical Matchup Engine**: Team A Power Play vs Team B Penalty Kill analysis highlighting qualitative mismatches and preventing naive rate subtraction.

### 5. Administrator Promotional Code & Entitlement System (`/admin`, `/redeem`)
- **Gift Types**: One-Month Pro (30 days), One-Year Pro (365 days), and Custom Duration Grants.
- **Security & Integrity**: Cryptographic SHA-256 code hashing, database transactional concurrency control, rate limiting against brute-force redemption, single-user lock options, and administrator audit logging.
- **Customer Friendly Rules**: No credit card required, zero automatic renewals, and stacking onto existing paid subscriptions without overwriting billing.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Lucide React
- **ORM & Database**: Prisma ORM with SQLite (PostgreSQL compatible)
- **Authentication**: JWT/HMAC-SHA256 session tokens with bcryptjs password hashing
- **Testing**: Vitest automated test suite (25 test cases passing)

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
```

### 3. Generate Database & Seed Fixtures
```bash
npx prisma generate
npx prisma db push
node scripts/seed.js
```

### 4. Run Automated Test Suite
```bash
npx vitest run
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Plan |
|---|---|---|---|
| **Administrator** | `admin@sportsedge.ai` | `AdminPass2026!` | PRO (Admin) |
| **Free User** | `user@example.com` | `UserPass2026!` | FREE |
| **Paid Pro User** | `pro@example.com` | `ProPass2026!` | PRO (Stripe) |

### Sample Gift Codes for `/redeem`
- `SPORTSEDGE-30DAY-GIFT` (30 days free Pro access)
- `SPORTSEDGE-1YEAR-VIP` (365 days free Pro access)
- `SPORTSEDGE-PROMO-2026` (60 days free Pro access)
