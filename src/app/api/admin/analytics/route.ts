import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminPromoAnalytics } from "@/lib/promo";

export async function GET() {
  try {
    await requireAdmin();
    const analytics = await getAdminPromoAnalytics();
    return NextResponse.json({ analytics });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
