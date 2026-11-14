import crypto from "crypto";
import prisma from "./db";

export function hashCode(code: string): string {
  const normalized = code.trim().toUpperCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export function generateRandomCode(prefix = "SPORTSEDGE", segments = 2): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars (0, O, 1, I)
  const parts = [prefix];
  for (let s = 0; s < segments; s++) {
    let segment = "";
    for (let i = 0; i < 4; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(segment);
  }
  return parts.join("-");
}

export interface CreatePromoInput {
  name?: string;
  code?: string;
  type: "ONE_MONTH" | "ONE_YEAR" | "CUSTOM";
  durationDays?: number;
  maxRedemptions?: number | null;
  startDate?: string;
  expiresAt?: string | null;
  isActive?: boolean;
  newUsersOnly?: boolean;
  allowedEmail?: string | null;
  notes?: string;
  adminId: string;
  adminEmail: string;
}

export async function createPromoCode(input: CreatePromoInput) {
  let finalCode = input.code ? input.code.trim().toUpperCase() : "";
  if (!finalCode) {
    const prefix = input.type === "ONE_YEAR" ? "SPORTSEDGE-1YEAR" : "SPORTSEDGE-30DAY";
    finalCode = generateRandomCode(prefix, 1);
  }

  let durationDays = 30;
  if (input.type === "ONE_YEAR") {
    durationDays = 365;
  } else if (input.type === "CUSTOM" && input.durationDays) {
    durationDays = input.durationDays;
  }

  const codeHash = hashCode(finalCode);

  const existing = await prisma.promoCode.findUnique({
    where: { codeHash },
  });

  if (existing) {
    throw new Error("PROMO_CODE_ALREADY_EXISTS");
  }

  const promo = await prisma.$transaction(async (tx) => {
    const created = await tx.promoCode.create({
      data: {
        code: finalCode,
        codeHash,
        type: input.type,
        durationDays,
        maxRedemptions: input.maxRedemptions || null,
        startDate: input.startDate ? new Date(input.startDate) : new Date(),
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        isActive: input.isActive ?? true,
        newUsersOnly: input.newUsersOnly ?? false,
        allowedEmail: input.allowedEmail ? input.allowedEmail.trim().toLowerCase() : null,
        notes: input.notes || null,
        createdBy: input.adminId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        adminId: input.adminId,
        adminEmail: input.adminEmail,
        action: "CREATE_PROMO",
        targetType: "PROMO_CODE",
        targetId: created.id,
        details: JSON.stringify({
          code: created.code,
          type: created.type,
          durationDays: created.durationDays,
          maxRedemptions: created.maxRedemptions,
          allowedEmail: created.allowedEmail,
        }),
      },
    });

    return created;
  });

  return promo;
}

// In-memory brute force throttling: Max 5 failed attempts per IP / minute
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = failedAttempts.get(key);
  if (!entry) return true;

  if (now - entry.firstAttempt > 60000) {
    failedAttempts.delete(key);
    return true;
  }

  return entry.count < 5;
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const entry = failedAttempts.get(key);
  if (!entry || now - entry.firstAttempt > 60000) {
    failedAttempts.set(key, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

export function clearFailedAttempts(key: string) {
  failedAttempts.delete(key);
}

export interface RedeemPromoInput {
  codeString: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function redeemPromoCode(input: RedeemPromoInput) {
  const rateLimitKey = `${input.ipAddress || "global"}:${input.userId}`;
  if (!checkRateLimit(rateLimitKey)) {
    throw new Error("TOO_MANY_ATTEMPTS");
  }

  const rawCode = input.codeString.trim().toUpperCase();
  const codeHash = hashCode(rawCode);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch code
    const promo = await tx.promoCode.findUnique({
      where: { codeHash },
      include: { redemptions: true },
    });

    if (!promo) {
      recordFailedAttempt(rateLimitKey);
      throw new Error("INVALID_CODE");
    }

    if (!promo.isActive) {
      throw new Error("CODE_INACTIVE");
    }

    const now = new Date();
    if (promo.startDate > now) {
      throw new Error("CODE_NOT_STARTED");
    }

    if (promo.expiresAt && promo.expiresAt < now) {
      throw new Error("CODE_EXPIRED");
    }

    if (promo.maxRedemptions !== null && promo.timesRedeemed >= promo.maxRedemptions) {
      throw new Error("REDEMPTION_LIMIT_REACHED");
    }

    // 2. Fetch User
    const user = await tx.user.findUnique({
      where: { id: input.userId },
      include: {
        redemptions: { where: { codeId: promo.id } },
        entitlements: { where: { isActive: true } },
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Check duplicate redemption by same user
    if (user.redemptions.length > 0) {
      throw new Error("ALREADY_REDEEMED");
    }

    // Check allowed email
    if (promo.allowedEmail && promo.allowedEmail.toLowerCase() !== user.email.toLowerCase()) {
      throw new Error("EMAIL_NOT_AUTHORIZED");
    }

    // Check new users only
    if (promo.newUsersOnly) {
      const priorRedemptions = await tx.promoRedemption.count({
        where: { userId: user.id },
      });
      if (priorRedemptions > 0 || user.stripeSubscriptionId) {
        throw new Error("NEW_USERS_ONLY");
      }
    }

    // Calculate entitlement access period
    // If user currently has active pro (promotional or paid), extend beyond current expiry
    let accessStart = now;
    let accessExpires = new Date(now.getTime() + promo.durationDays * 24 * 60 * 60 * 1000);

    if (user.proExpiresAt && user.proExpiresAt > now) {
      // Stack duration on top of existing remaining time!
      accessStart = now;
      accessExpires = new Date(user.proExpiresAt.getTime() + promo.durationDays * 24 * 60 * 60 * 1000);
    }

    // Increment redemption count
    await tx.promoCode.update({
      where: { id: promo.id },
      data: { timesRedeemed: { increment: 1 } },
    });

    // Create redemption record
    const redemption = await tx.promoRedemption.create({
      data: {
        codeId: promo.id,
        userId: user.id,
        accessStart,
        accessExpires,
        status: "SUCCESS",
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
      },
    });

    // Create entitlement
    await tx.userEntitlement.create({
      data: {
        userId: user.id,
        source: "PROMO_CODE",
        sourceId: promo.id,
        startsAt: accessStart,
        expiresAt: accessExpires,
        isActive: true,
      },
    });

    // Update user Pro status
    await tx.user.update({
      where: { id: user.id },
      data: {
        plan: "PRO",
        proExpiresAt: accessExpires,
      },
    });

    clearFailedAttempts(rateLimitKey);

    return {
      success: true,
      code: promo.code,
      type: promo.type,
      durationDays: promo.durationDays,
      accessExpires,
      message:
        promo.durationDays === 365
          ? "Congratulations! You have received 1 year of SportsEdge AI Pro at no charge."
          : `Congratulations! You have received ${
              promo.durationDays === 30 ? "1 month" : `${promo.durationDays} days`
            } of SportsEdge AI Pro at no charge.`,
    };
  });

  return result;
}

export async function disablePromoCode(codeId: string, adminId: string, adminEmail: string) {
  const updated = await prisma.$transaction(async (tx) => {
    const promo = await tx.promoCode.update({
      where: { id: codeId },
      data: { isActive: false },
    });

    await tx.adminAuditLog.create({
      data: {
        adminId,
        adminEmail,
        action: "DISABLE_PROMO",
        targetType: "PROMO_CODE",
        targetId: promo.id,
        details: JSON.stringify({ code: promo.code, isActive: false }),
      },
    });

    return promo;
  });

  return updated;
}

export async function getAdminPromoAnalytics() {
  const now = new Date();
  const [
    totalCodes,
    activeCodes,
    expiredCodes,
    disabledCodes,
    totalRedemptions,
    oneMonthGiftsRedeemed,
    oneYearGiftsRedeemed,
    activeProEntitlements,
  ] = await Promise.all([
    prisma.promoCode.count(),
    prisma.promoCode.count({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    }),
    prisma.promoCode.count({
      where: {
        expiresAt: { lte: now },
      },
    }),
    prisma.promoCode.count({
      where: { isActive: false },
    }),
    prisma.promoRedemption.count({
      where: { status: "SUCCESS" },
    }),
    prisma.promoRedemption.count({
      where: {
        code: { durationDays: 30 },
        status: "SUCCESS",
      },
    }),
    prisma.promoRedemption.count({
      where: {
        code: { durationDays: 365 },
        status: "SUCCESS",
      },
    }),
    prisma.user.count({
      where: {
        plan: "PRO",
        proExpiresAt: { gt: now },
      },
    }),
  ]);

  return {
    totalCodes,
    activeCodes,
    expiredCodes,
    disabledCodes,
    totalRedemptions,
    oneMonthGiftsRedeemed,
    oneYearGiftsRedeemed,
    currentPromotionalProUsers: activeProEntitlements,
  };
}
