import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const admin = await requireAdmin();
    const redemptions = await prisma.promoRedemption.findMany({
      include: {
        code: {
          select: { code: true, type: true, durationDays: true },
        },
        user: {
          select: { id: true, email: true },
        },
      },
      orderBy: { redeemedAt: "desc" },
    });

    // Generate CSV (masking user email for privacy protection)
    const header = "Redemption_ID,Promo_Code,Promo_Type,Duration_Days,User_ID,User_Domain,Redeemed_At,Access_Expires,Status\n";
    const rows = redemptions
      .map((r) => {
        const domain = r.user.email.split("@")[1] || "user";
        return `"${r.id}","${r.code.code}","${r.code.type}",${r.code.durationDays},"${r.user.id}","@${domain}","${r.redeemedAt.toISOString()}","${r.accessExpires.toISOString()}","${r.status}"`;
      })
      .join("\n");

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "EXPORT_REPORT",
        targetType: "REDEMPTIONS",
        details: JSON.stringify({ count: redemptions.length }),
      },
    });

    const csvData = header + rows;
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sportsedge_promotions_export_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 });
  }
}
