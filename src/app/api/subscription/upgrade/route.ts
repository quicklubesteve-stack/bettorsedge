import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "You must be signed in to change your plan." }, { status: 401 });
    }

    const { targetPlan } = await req.json(); // "FREE" or "PRO"

    if (targetPlan !== "FREE" && targetPlan !== "PRO") {
      return NextResponse.json({ error: "Invalid plan specified." }, { status: 400 });
    }

    if (targetPlan === "PRO") {
      // Simulate Stripe Pro Subscription activation (30 days from now)
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: "PRO",
          proExpiresAt: expiresAt,
          stripeSubscriptionId: "sub_test_simulated_" + Date.now(),
        },
      });

      // Record entitlement
      await prisma.userEntitlement.create({
        data: {
          userId: user.id,
          source: "STRIPE_SUBSCRIPTION",
          sourceId: "simulated_stripe_test",
          startsAt: new Date(),
          expiresAt,
          isActive: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Successfully upgraded to SportsEdge AI Pro (Test Mode Active).",
        plan: "PRO",
        proExpiresAt: expiresAt.toISOString(),
      });
    } else {
      // Revert to FREE
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: "FREE",
          proExpiresAt: null,
          stripeSubscriptionId: null,
        },
      });

      // Deactivate active entitlements
      await prisma.userEntitlement.updateMany({
        where: { userId: user.id, isActive: true },
        data: { isActive: false },
      });

      return NextResponse.json({
        success: true,
        message: "Your account is now on the Free Plan.",
        plan: "FREE",
        proExpiresAt: null,
      });
    }
  } catch (error: any) {
    console.error("Plan change error:", error);
    return NextResponse.json({ error: "Failed to update subscription tier." }, { status: 500 });
  }
}
