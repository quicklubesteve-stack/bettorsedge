import { NextResponse } from "next/server";
import { runWeeklyLearningCycle } from "@/lib/learning/weekly-learning-cycle";
import { getActiveModelWeightSnapshot } from "@/lib/learning/weight-calibration";

export async function GET() {
  try {
    const activeSnapshot = await getActiveModelWeightSnapshot("COMBINED");
    return NextResponse.json({
      success: true,
      activeSnapshot,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const forceRollbackTest = body.forceRollbackTest === true;
    const customWeek = body.customWeek ? parseInt(body.customWeek, 10) : 11;

    const report = await runWeeklyLearningCycle({
      forceRollbackTest,
      customWeek,
    });

    return NextResponse.json({
      success: true,
      message: "Weekly continuous learning and calibration cycle completed successfully.",
      report,
    });
  } catch (err: any) {
    console.error("POST /api/learning/cycle error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
