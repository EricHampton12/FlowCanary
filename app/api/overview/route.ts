// app/api/overview/route.ts
import { NextResponse } from "next/server";
import { mockOverviewStats, mockFlows } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    stats: mockOverviewStats,
    flows: mockFlows,
  });
}
