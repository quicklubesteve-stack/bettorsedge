import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { createPromoCode } from "@/lib/promo";

export async function GET() {
  try {
    await requireAdmin();
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { redemptions: true },
        },
        redemptions: {
          include: {
            user: {
              select: { id: true, email: true, name: true },
            },
          },
          orderBy: { redeemedAt: "desc" },
          take: 50,
        },
      },
    });

    return NextResponse.json({ promos });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const created = await createPromoCode({
      code: body.code,
      type: body.type,
      durationDays: body.durationDays,
      maxRedemptions: body.maxRedemptions ? Number(body.maxRedemptions) : null,
      startDate: body.startDate,
      expiresAt: body.expiresAt,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      newUsersOnly: body.newUsersOnly !== undefined ? Boolean(body.newUsersOnly) : false,
      allowedEmail: body.allowedEmail,
      notes: body.notes,
      adminId: admin.id,
      adminEmail: admin.email,
    });

    return NextResponse.json({ success: true, promo: created });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }
    if (error.message === "PROMO_CODE_ALREADY_EXISTS") {
      return NextResponse.json({ error: "A promotion with this code already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create promo code" }, { status: 500 });
  }
}
