import { NextResponse } from "next/server";
import { getLineupImpactEvents } from "@/lib/lineup-change-monitor";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league") as "NFL" | "NHL" | null;
    const events = getLineupImpactEvents(league || undefined);
    return NextResponse.json({
      success: true,
      totalEvents: events.length,
      events,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load lineup impact events" }, { status: 500 });
  }
}
