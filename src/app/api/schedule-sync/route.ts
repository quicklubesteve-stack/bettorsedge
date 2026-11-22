import { NextResponse } from "next/server";
import { getScheduleStatus, triggerManualSync } from "@/lib/schedule-sync-service";
import { syncAllLiveSportsData } from "@/lib/live-data-service";

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
    
    // Execute live ingestion across standings, rosters, injuries and recalculated predictions
    const syncResult = await syncAllLiveSportsData(source);
    const log = triggerManualSync(source);

    return NextResponse.json({
      success: true,
      message: "Live NHL & NFL sync triggered and completed successfully",
      syncResult,
      log,
      currentStatus: getScheduleStatus(),
    });
  } catch (error: any) {
    console.error("POST /api/schedule-sync error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to trigger sync" }, { status: 500 });
  }
}
