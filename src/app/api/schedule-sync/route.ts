import { NextResponse } from "next/server";
import { getScheduleStatus, triggerManualSync } from "@/lib/schedule-sync-service";

export async function GET() {
  try {
    const status = getScheduleStatus();
    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load schedule status" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const source = body.source || "Manual UI Refresh";
    const log = triggerManualSync(source);
    return NextResponse.json({
      success: true,
      message: "Sync triggered and completed successfully",
      log,
      currentStatus: getScheduleStatus(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to trigger sync" }, { status: 500 });
  }
}
