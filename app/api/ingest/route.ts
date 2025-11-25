import { NextResponse } from "next/server";
import type { FlowCanaryEvent } from "@/lib/events";
import { addEvent } from "@/lib/eventStore";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<FlowCanaryEvent>;

    if (!body.projectId || !body.type || !body.ts) {
      return NextResponse.json(
        { error: "projectId, type, and ts are required" },
        { status: 400 }
      );
    }

    const event: FlowCanaryEvent = {
      projectId: body.projectId,
      type: body.type,
      ts: body.ts,
      path: body.path,
      flowId: body.flowId,
      stepId: body.stepId,
      sessionId: body.sessionId,
      payload: body.payload ?? {},
    };

    addEvent(event);

    console.log("[FlowCanary] Ingest event:", JSON.stringify(event));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("💥 Ingest handler crashed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
