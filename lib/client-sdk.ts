// lib/client-sdk.ts
import type { FlowCanaryEvent, FlowCanaryEventType } from "./events";

const DEFAULT_ENDPOINT = "/api/ingest";

type InitOptions = {
  projectId: string;
  endpoint?: string;
};

let _projectId: string | null = null;
let _endpoint: string = DEFAULT_ENDPOINT;

export function initFlowCanary(options: InitOptions) {
  _projectId = options.projectId;
  _endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
}

export async function sendFlowCanaryEvent(
  type: FlowCanaryEventType,
  payload: Omit<FlowCanaryEvent, "type" | "projectId" | "ts"> = {}
) {
  if (!_projectId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[FlowCanary] initFlowCanary() not called before send.");
    }
    return;
  }

  const event: FlowCanaryEvent = {
    projectId: _projectId,
    type,
    ts: Date.now(),
    ...payload,
  };

  try {
    const res = await fetch(_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (!res.ok && process.env.NODE_ENV !== "production") {
      console.warn(
        "[FlowCanary] Failed to send event",
        res.status,
        await res.text()
      );
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[FlowCanary] Error sending event:", err);
    }
  }
}

// 👇 helper for flow steps
export async function trackFlowStep(options: {
  flowId: string;
  stepId: string;
  sessionId: string;
  path?: string;
  payload?: Record<string, unknown>;
}) {
  return sendFlowCanaryEvent("flow_step", {
    flowId: options.flowId,
    stepId: options.stepId,
    sessionId: options.sessionId,
    path: options.path,
    payload: options.payload,
  });
}
