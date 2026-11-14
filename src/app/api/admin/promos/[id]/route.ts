import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { disablePromoCode } from "@/lib/promo";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const { id } = params;
    const body = await req.json();

    const updated = await prisma.$transaction(async (tx) => {
      const promo = await tx.promoCode.update({
        where: { id },
        data: {
          isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
          notes: body.notes !== undefined ? body.notes : undefined,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminId: admin.id,
          adminEmail: admin.email,
          action: "UPDATE_PROMO",
          targetType: "PROMO_CODE",
          targetId: promo.id,
          details: JSON.stringify({ updates: body }),
        },
      });

      return promo;
    });

    return NextResponse.json({ success: true, promo: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const { id } = params;

    const disabled = await disablePromoCode(id, admin.id, admin.email);
    return NextResponse.json({ success: true, promo: disabled });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to disable promotion" }, { status: 500 });
  }
}
