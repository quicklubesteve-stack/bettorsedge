# TESTING.md — Automated Test Suite & Verification Matrix

SportsEdge AI features a comprehensive automated testing suite written with Vitest.

---

## 🧪 Running the Tests

To execute the test suite:
```bash
npx vitest run
```

To run in watch mode during development:
```bash
npm run test:watch
```

---

## 📋 Test Matrix & Coverage Mapping

The test suite covers the 23 items specified in the development requirements:

| # | Feature / Test Scenario | Test File | Status | Description |
|---|---|---|---|---|
| **1** | NFL blitz percentage calculations | `tests/nfl.test.ts` | ✅ Passed | Evaluates $(\text{Blitzes} / \text{Eligible Plays}) \times 100$, verifies edge cases ($n=0$, null handling). |
| **2** | NFL down-and-distance filters | `tests/nfl.test.ts` | ✅ Passed | Verifies 1st–4th down and short ($\le 3$), medium (4–7), and long ($\ge 8$) brackets. |
| **3** | NFL drive-based analysis | `tests/nfl.test.ts` | ✅ Passed | Validates opening drive, later drives, and turnover recovery drives. |
| **4** | NFL run/pass classifications | `tests/nfl.test.ts` | ✅ Passed | Classifies designed runs, passes, scrambles, sacks, and excludes kneels/spikes. |
| **5** | NFL red-zone calculations | `tests/nfl.test.ts` | ✅ Passed | Isolates red-zone ($\le 20$ yd) defensive blitz snaps and rates. |
| **6** | NHL power-play % calculations | `tests/nhl.test.ts` | ✅ Passed | Evaluates $(\text{PP Goals} / \text{PP Opportunities}) \times 100$ and zero-opportunity safety. |
| **7** | NHL player scoring shares | `tests/nhl.test.ts` | ✅ Passed | Computes individual goal share, point share, and shooting percentages on PP. |
| **8** | NHL penalty-kill % calculations | `tests/nhl.test.ts` | ✅ Passed | Computes $((\text{Times SH} - \text{PPGA}) / \text{Times SH}) \times 100$. |
| **9** | NHL shorthanded blocked shots | `tests/nhl.test.ts` | ✅ Passed | Strictly separates all-situation blocks from verified shorthanded blocks. |
| **10**| Missing / incomplete data handling | `tests/nfl.test.ts` | ✅ Passed | Detects unverified blitz feeds and outputs required standard disclaimer. |
| **11**| Promotional code creation | `tests/promo.test.ts`| ✅ Passed | Verifies SHA-256 hash generation, code uniqueness, and admin audit record. |
| **12**| 1-Month gift redemption | `tests/promo.test.ts`| ✅ Passed | Applies 30 days of Pro access and creates `UserEntitlement` record. |
| **13**| 1-Year gift redemption | `tests/promo.test.ts`| ✅ Passed | Applies 365 days of Pro access and verifies celebratory message. |
| **14**| Expired promotional codes | `tests/promo.test.ts`| ✅ Passed | Denies redemptions when `expiresAt < now`. |
| **15**| Disabled promotional codes | `tests/promo.test.ts`| ✅ Passed | Denies redemptions when `isActive === false`. |
| **16**| Redemption limits | `tests/promo.test.ts`| ✅ Passed | Enforces `maxRedemptions` limit and denies when quota is filled. |
| **17**| Duplicate redemption prevention | `tests/promo.test.ts`| ✅ Passed | Prevents the same user from redeeming the same promo code twice. |
| **18**| Concurrent redemption attempts | `tests/promo.test.ts`| ✅ Passed | Validates database transaction concurrency when multiple users redeem the final code. |
| **19**| Unauthorized admin access | `tests/auth.test.ts` | ✅ Passed | Enforces server-side rejection of non-admin users attempting administrative actions. |
| **20**| Gift subscription expiration | `tests/auth.test.ts` | ✅ Passed | Downgrades expired entitlements to `FREE` with zero silent renewal charges. |
| **21**| Paid subscription stacking | `tests/promo.test.ts`| ✅ Passed | Stacks promotional days on top of existing remaining time without modifying Stripe billing. |
| **22**| Pro feature authorization | `tests/auth.test.ts` | ✅ Passed | Guards premium intelligence endpoints behind active Pro entitlement checks. |
| **23**| Regression tests for auth | `tests/auth.test.ts` | ✅ Passed | Validates password hashing, token signatures, and tamper detection. |
