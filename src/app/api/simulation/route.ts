import { NextResponse } from "next/server";
import { runPredictiveSimulation } from "@/lib/simulation-engine";

export async function GET() {
  try {
    const report = await runPredictiveSimulation();
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Simulation failed", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const report = await runPredictiveSimulation();
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Simulation failed", message: error.message },
      { status: 500 }
    );
  }
}
