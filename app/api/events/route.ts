// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getRecentEvents } from "@/lib/eventStore";

export async function GET() {
  try {
    console.log("📡 /api/events HIT");
    const events = getRecentEvents(50);
    return NextResponse.json({ events });
  } catch (err) {
    console.error("❌ Events route error:", err);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}
