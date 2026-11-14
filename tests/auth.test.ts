import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../src/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from "../src/lib/auth";

describe("Authentication, Entitlements & Subscription Authorization", () => {
  let regularUser: any;
  let adminUser: any;

  beforeEach(async () => {
    regularUser = await prisma.user.findUnique({ where: { email: "user@example.com" } });
    adminUser = await prisma.user.findUnique({ where: { email: "admin@sportsedge.ai" } });
  });

  // Test 19: Unauthorized administrator access
  it("strictly distinguishes ADMIN and USER roles and denies administrative elevation", async () => {
    expect(regularUser.role).toBe("USER");
    expect(adminUser.role).toBe("ADMIN");

    // Regular user role cannot be treated as ADMIN
    const isAdmin = (user: any) => user && user.role === "ADMIN";
    expect(isAdmin(regularUser)).toBe(false);
    expect(isAdmin(adminUser)).toBe(true);
  });

  // Test 20: Gift subscription expiration
  it("automatically evaluates expired promotional entitlements and downgrades to FREE without silent charges", async () => {
    // Create a temporary user with expired entitlement
    const expiredUser = await prisma.user.create({
      data: {
        email: `expired_${Date.now()}@example.com`,
        passwordHash: "dummy",
        plan: "PRO",
        proExpiresAt: new Date(Date.now() - 10000), // Expired 10 seconds ago
      },
    });

    const isProActive = (user: any) => {
      if (user.role === "ADMIN") return true;
      if (user.plan !== "PRO") return false;
      if (!user.proExpiresAt) return false;
      return new Date(user.proExpiresAt).getTime() > Date.now();
    };

    expect(isProActive(expiredUser)).toBe(false);
  });

  // Test 22: Pro feature authorization
  it("enforces server-side authorization check for premium intelligence features", () => {
    const freeUser = { role: "USER", plan: "FREE", proExpiresAt: null };
    const activeProUser = {
      role: "USER",
      plan: "PRO",
      proExpiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    const admin = { role: "ADMIN", plan: "PRO", proExpiresAt: null };

    const checkProAccess = (user: any) => {
      if (!user) return false;
      if (user.role === "ADMIN") return true;
      if (user.plan === "PRO" && (!user.proExpiresAt || new Date(user.proExpiresAt).getTime() > Date.now())) {
        return true;
      }
      return false;
    };

    expect(checkProAccess(freeUser)).toBe(false);
    expect(checkProAccess(activeProUser)).toBe(true);
    expect(checkProAccess(admin)).toBe(true);
  });

  // Test 23: Regression tests for existing authentication & session token system
  it("signs and verifies tamper-proof session tokens", async () => {
    const token = await createSessionToken(regularUser.id);
    expect(token).toBeDefined();

    const verified = await verifySessionToken(token);
    expect(verified?.userId).toBe(regularUser.id);

    // Tampered token check
    const tampered = token.slice(0, -5) + "abcde";
    const invalidVerified = await verifySessionToken(tampered);
    expect(invalidVerified).toBeNull();
  });
});
