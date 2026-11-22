import { NextResponse } from "next/server";
import { getPerformanceReport } from "@/lib/model-performance";

export async function GET() {
  try {
    const report = getPerformanceReport();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate performance report" }, { status: 500 });
  }
}
