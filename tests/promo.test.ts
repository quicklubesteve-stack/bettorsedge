import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../src/lib/db";
import {
  createPromoCode,
  redeemPromoCode,
  disablePromoCode,
  hashCode,
  generateRandomCode,
} from "../src/lib/promo";

describe("Administrator Promotional Code System", () => {
  let adminUser: any;
  let testUser1: any;
  let testUser2: any;
  let payingProUser: any;

  beforeEach(async () => {
    // Get seeded users
    adminUser = await prisma.user.findUnique({ where: { email: "admin@sportsedge.ai" } });
    testUser1 = await prisma.user.findUnique({ where: { email: "user@example.com" } });

    // Clean up test redemptions & test codes
    await prisma.promoRedemption.deleteMany({
      where: {
        code: {
          code: { startsWith: "TEST-" },
        },
      },
    });
    await prisma.promoCode.deleteMany({
      where: {
        code: { startsWith: "TEST-" },
      },
    });

    // Reset test user 1
    await prisma.user.update({
      where: { id: testUser1.id },
      data: { plan: "FREE", proExpiresAt: null },
    });
  });

  // Test 11: Promotional code creation
  it("creates a valid promotional code with secure SHA-256 hash", async () => {
    const code = "TEST-CREATE-" + Date.now();
    const promo = await createPromoCode({
      code,
      type: "ONE_MONTH",
      maxRedemptions: 10,
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    expect(promo).toBeDefined();
    expect(promo.code).toBe(code);
    expect(promo.codeHash).toBe(hashCode(code));
    expect(promo.durationDays).toBe(30);
    expect(promo.isActive).toBe(true);
  });

  // Test 12: One-month gift redemption
  it("redeems a one-month gift code and grants 30 days of Pro access", async () => {
    const code = "TEST-1MO-" + Date.now();
    await createPromoCode({
      code,
      type: "ONE_MONTH",
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    const result = await redeemPromoCode({
      codeString: code,
      userId: testUser1.id,
    });

    expect(result.success).toBe(true);
    expect(result.durationDays).toBe(30);
    expect(result.message).toContain("1 month");

    const updatedUser = await prisma.user.findUnique({ where: { id: testUser1.id } });
    expect(updatedUser?.plan).toBe("PRO");
    expect(updatedUser?.proExpiresAt).not.toBeNull();
  });

  // Test 13: One-year gift redemption
  it("redeems a one-year gift code and grants 365 days of Pro access", async () => {
    const code = "TEST-1YR-" + Date.now();
    await createPromoCode({
      code,
      type: "ONE_YEAR",
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    const result = await redeemPromoCode({
      codeString: code,
      userId: testUser1.id,
    });

    expect(result.success).toBe(true);
    expect(result.durationDays).toBe(365);
    expect(result.message).toContain("1 year");
  });

  // Test 14: Expired promotional codes
  it("rejects redemption of expired promotional codes", async () => {
    const code = "TEST-EXPIRED-" + Date.now();
    await createPromoCode({
      code,
      type: "ONE_MONTH",
      expiresAt: new Date(Date.now() - 10000).toISOString(),
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    await expect(
      redeemPromoCode({
        codeString: code,
        userId: testUser1.id,
      })
    ).rejects.toThrow("CODE_EXPIRED");
  });

  // Test 15: Disabled promotional codes
  it("rejects redemption of disabled promotional codes", async () => {
    const code = "TEST-DISABLED-" + Date.now();
    const created = await createPromoCode({
      code,
      type: "ONE_MONTH",
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    await disablePromoCode(created.id, adminUser.id, adminUser.email);

    await expect(
      redeemPromoCode({
        codeString: code,
        userId: testUser1.id,
      })
    ).rejects.toThrow("CODE_INACTIVE");
  });

  // Test 16: Redemption limits
  it("enforces maxRedemptions cap and denies redemption when exhausted", async () => {
    const code = "TEST-CAP-" + Date.now();
    await createPromoCode({
      code,
      type: "ONE_MONTH",
      maxRedemptions: 1,
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    // 1st redemption succeeds
    await redeemPromoCode({
      codeString: code,
      userId: testUser1.id,
    });

    // Create a 2nd user
    const user2 = await prisma.user.create({
      data: {
        email: `testuser2_${Date.now()}@example.com`,
        passwordHash: "dummy",
        plan: "FREE",
      },
    });

    // 2nd redemption fails due to limit reached
    await expect(
      redeemPromoCode({
        codeString: code,
        userId: user2.id,
      })
    ).rejects.toThrow("REDEMPTION_LIMIT_REACHED");
  });

  // Test 17: Duplicate redemption prevention
  it("prevents the same user from redeeming the same code twice", async () => {
    const code = "TEST-NODUP-" + Date.now();
    await createPromoCode({
      code,
      type: "ONE_MONTH",
      maxRedemptions: 10,
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    await redeemPromoCode({
      codeString: code,
      userId: testUser1.id,
    });

    // Attempt second redemption
    await expect(
      redeemPromoCode({
        codeString: code,
        userId: testUser1.id,
      })
    ).rejects.toThrow("ALREADY_REDEEMED");
  });

  // Test 18: Concurrent redemption attempts
  it("handles concurrent redemption attempts safely with database transactions", async () => {
    const code = "TEST-CONCURRENT-" + Date.now();
    await createPromoCode({
      code,
      type: "ONE_MONTH",
      maxRedemptions: 1, // Only 1 spot available
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    const userA = await prisma.user.create({
      data: { email: `conA_${Date.now()}@example.com`, passwordHash: "dummy", plan: "FREE" },
    });
    const userB = await prisma.user.create({
      data: { email: `conB_${Date.now()}@example.com`, passwordHash: "dummy", plan: "FREE" },
    });

    // Fire concurrently
    const results = await Promise.allSettled([
      redeemPromoCode({ codeString: code, userId: userA.id }),
      redeemPromoCode({ codeString: code, userId: userB.id }),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    // Exactly one should succeed, one should fail
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
  });

  // Test 21: Existing paid subscription interactions
  it("preserves existing paid subscription and extends access period seamlessly without modifying billing", async () => {
    const code = "TEST-STACK-" + Date.now();
    await createPromoCode({
      code,
      type: "ONE_MONTH",
      adminId: adminUser.id,
      adminEmail: adminUser.email,
    });

    // User with 60 days of pre-existing Pro access
    const existingExpiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const existingPaidUser = await prisma.user.create({
      data: {
        email: `paid_${Date.now()}@example.com`,
        passwordHash: "dummy",
        plan: "PRO",
        proExpiresAt: existingExpiry,
        stripeSubscriptionId: "sub_existing_12345",
      },
    });

    const res = await redeemPromoCode({
      codeString: code,
      userId: existingPaidUser.id,
    });

    expect(res.success).toBe(true);

    const userAfter = await prisma.user.findUnique({ where: { id: existingPaidUser.id } });
    expect(userAfter?.stripeSubscriptionId).toBe("sub_existing_12345"); // Preserved!
    // Expiration date should be ~90 days from now (60 existing + 30 promo)
    const expectedExpiryTime = existingExpiry.getTime() + 30 * 24 * 60 * 60 * 1000;
    expect(userAfter?.proExpiresAt?.getTime()).toBeCloseTo(expectedExpiryTime, -3);
  });
});
