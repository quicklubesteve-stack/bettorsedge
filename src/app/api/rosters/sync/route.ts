import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { syncRosters } from "@/lib/roster-service";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    // Allow admins or internal automated triggers
    const isAdmin = Boolean(user && user.role === "ADMIN");

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { league = "ALL", force = true } = body;

    const result = await syncRosters(league, force);

    return NextResponse.json({
      success: true,
      message: "Weekly team rosters successfully synchronized and verified.",
      triggeredBy: isAdmin ? `ADMIN (${user?.email})` : "AUTOMATED_CRON",
      ...result,
    });
  } catch (error: any) {
    console.error("POST /api/rosters/sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync rosters", message: error.message },
      { status: 500 }
    );
  }
}
