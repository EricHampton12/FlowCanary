// lib/flowMetrics.ts
import type { FlowDefinition } from "./flows";
import type { FlowCanaryEvent } from "./events";

export type FlowHealth = {
  flowId: string;
  flowName: string;
  attempts: number;
  completed: number;
  failed: number;
  failureRate: number; // 0–1
  lastCompletedAt?: number;
};

export function computeFlowHealthForProject(options: {
  projectId: string;
  flows: FlowDefinition[];
  events: FlowCanaryEvent[];
}): FlowHealth[] {
  const { projectId, flows, events } = options;

  if (!flows.length) return [];

  // filter relevant events
  const flowEvents = events.filter(
    (e) =>
      e.projectId === projectId &&
      e.type === "flow_step" &&
      !!e.flowId &&
      !!e.sessionId &&
      !!e.stepId
  );

  // group by (flowId + sessionId)
  type AttemptKey = string;
  type Attempt = {
    flowId: string;
    sessionId: string;
    stepIds: Set<string>;
    lastTs: number;
  };

  const attemptsByKey = new Map<AttemptKey, Attempt>();

  for (const e of flowEvents) {
    const key = `${e.flowId}:${e.sessionId}`;
    const existing = attemptsByKey.get(key);
    if (!existing) {
      attemptsByKey.set(key, {
        flowId: e.flowId!,
        sessionId: e.sessionId!,
        stepIds: new Set([e.stepId!]),
        lastTs: e.ts,
      });
    } else {
      existing.stepIds.add(e.stepId!);
      if (e.ts > existing.lastTs) existing.lastTs = e.ts;
    }
  }

  const healthByFlowId = new Map<string, FlowHealth>();

  for (const flow of flows) {
    healthByFlowId.set(flow.id, {
      flowId: flow.id,
      flowName: flow.name,
      attempts: 0,
      completed: 0,
      failed: 0,
      failureRate: 0,
      lastCompletedAt: undefined,
    });
  }

  for (const [, attempt] of attemptsByKey) {
    const flow = flows.find((f) => f.id === attempt.flowId);
    if (!flow) continue;

    const health = healthByFlowId.get(flow.id);
    if (!health) continue;

    health.attempts += 1;

    const lastStepId = flow.steps[flow.steps.length - 1]?.id;
    const isComplete = lastStepId ? attempt.stepIds.has(lastStepId) : false;

    if (isComplete) {
      health.completed += 1;
      if (!health.lastCompletedAt || attempt.lastTs > health.lastCompletedAt) {
        health.lastCompletedAt = attempt.lastTs;
      }
    } else {
      health.failed += 1;
    }
  }

  for (const health of healthByFlowId.values()) {
    if (health.attempts > 0) {
      health.failureRate = health.failed / health.attempts;
    }
  }

  return Array.from(healthByFlowId.values());
}
