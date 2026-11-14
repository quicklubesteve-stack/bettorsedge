import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const logs = await prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ logs });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
