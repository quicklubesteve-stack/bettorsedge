import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "sportsedge_fallback_secret_key_2026";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  plan: "FREE" | "PRO";
  proExpiresAt: string | null;
  isProActive: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Simple signed token using standard Web Crypto HMAC
export async function createSessionToken(userId: string): Promise<string> {
  const payload = JSON.stringify({ userId, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const b64Payload = Buffer.from(payload).toString("base64url");
  const b64Sig = Buffer.from(signature).toString("base64url");
  return `${b64Payload}.${b64Sig}`;
}

export async function verifySessionToken(token: string): Promise<{ userId: string } | null> {
  try {
    const [b64Payload, b64Sig] = token.split(".");
    if (!b64Payload || !b64Sig) return null;

    const payload = Buffer.from(b64Payload, "base64url").toString();
    const data = JSON.parse(payload);
    if (data.exp && Date.now() > data.exp) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(b64Sig, "base64url"),
      encoder.encode(payload)
    );

    return isValid ? { userId: data.userId } : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("sportsedge_session")?.value;
  if (!token) return null;

  const verified = await verifySessionToken(token);
  if (!verified?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    include: {
      entitlements: {
        where: { isActive: true },
        orderBy: { startsAt: "desc" },
      },
    },
  });

  if (!user) return null;

  // Evaluate active entitlements
  const now = new Date();
  let hasActivePro = false;
  let latestProExpiry: Date | null = user.proExpiresAt;

  // Check user.plan
  if (user.plan === "PRO") {
    if (!user.proExpiresAt || new Date(user.proExpiresAt) > now) {
      hasActivePro = true;
    }
  }

  // Check active entitlements
  for (const ent of user.entitlements) {
    if (ent.startsAt <= now && (!ent.expiresAt || ent.expiresAt > now)) {
      hasActivePro = true;
      if (ent.expiresAt && (!latestProExpiry || ent.expiresAt > latestProExpiry)) {
        latestProExpiry = ent.expiresAt;
      }
    }
  }

  // If pro expired, ensure user is marked appropriately
  const currentPlan = hasActivePro ? "PRO" : "FREE";

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "USER" | "ADMIN",
    plan: currentPlan,
    proExpiresAt: latestProExpiry ? latestProExpiry.toISOString() : null,
    isProActive: hasActivePro,
  };
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED_ADMIN");
  }
  return user;
}

export async function requirePro(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || (!user.isProActive && user.role !== "ADMIN")) {
    throw new Error("PRO_REQUIRED");
  }
  return user;
}
