// lib/events.ts

export type FlowCanaryEventType =
  | "page_view"
  | "js_error"
  | "rage_click"
  | "flow_step";

export type FlowCanaryEvent = {
  projectId: string;
  type: FlowCanaryEventType;
  ts: number; // epoch ms
  path?: string;
  flowId?: string;
  step?: string;
  // generic payload for now
  payload?: Record<string, unknown>;
  stepId?: string;    // e.g. "step-1"
  sessionId?: string; // simple string for “who is this attempt”
};



// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getRecentEvents } from "@/lib/eventStore";

export async function GET() {
  const events = getRecentEvents(50);
  return NextResponse.json({ events });
}
