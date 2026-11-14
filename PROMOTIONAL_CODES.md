# PROMOTIONAL_CODES.md — Administrator Promotional Code & Entitlement System

This document outlines the architecture, security mechanisms, subscription interaction rules, and administrative workflows for SportsEdge AI promotional gift codes.

---

## 🎁 Gift Types & Entitlement Architecture

| Gift Type | Duration | Description |
|---|---|---|
| **One-Month Pro Gift** | 30 Calendar Days | Grants 30 days of full Pro tier access. |
| **One-Year Pro Gift** | 365 Calendar Days | Grants 1 calendar year of VIP Pro tier access. |
| **Custom Pro Gift** | $N$ Days ($1 \le N \le 730$) | Custom duration configured by the administrator. |

---

## 🛡️ Consumer Protection & Billing Rules

1. **Zero Automatic Renewal**:
   - Gift codes never collect credit card or payment credentials.
   - When the promotional period expires, the user's plan automatically reverts to `FREE`.
   - The platform will **never** silently begin a paid subscription after a gift period concludes.

2. **Stacking on Existing Paid Subscriptions**:
   - If a paying user redeems a gift code, their Stripe subscription is **not cancelled or altered**.
   - Instead, the promotional days are added to their active entitlement (`user.proExpiresAt`), extending their covered Pro access without disrupting their payment provider profile.

3. **Multi-Redemption & Duplicate Safeguards**:
   - Each unique user can only redeem a given promotional code once (enforced by a database compound unique index `[codeId, userId]`).
   - If a code has a `maxRedemptions` limit, concurrent redemptions are gated via database transaction locks, preventing race condition over-redemption.

4. **Brute-Force & Bot Throttling**:
   - The redemption API (`/api/redeem`) enforces rate limiting (maximum 5 failed attempts per IP / minute) and locks abusers with HTTP 429.

---

## 🔐 Administrator Workflows (`/admin`)

- **Code Creation Form**:
  - Auto-generate cryptographically secure alphanumeric codes (`SPORTSEDGE-XXXX-XXXX`) or define a custom code.
  - Set optional expiration dates, redemption quotas, or single-email recipient locks.
  - Toggle `newUsersOnly` to prevent existing subscribers from claiming new-user acquisition promotions.
- **Immediate Invalidation**:
  - Admins can instantly disable any active code, terminating new redemptions while preserving existing valid entitlements.
- **Audit Logging**:
  - Every administrative action (`CREATE_PROMO`, `DISABLE_PROMO`, `UPDATE_PROMO`, `EXPORT_REPORT`) creates an immutable `AdminAuditLog` record storing the admin ID, timestamp, and JSON delta.
- **Summary Export**:
  - Administrators can export non-sensitive redemption records to CSV format with user emails masked (`@domain.com`) for privacy compliance.
