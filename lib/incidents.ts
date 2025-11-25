// lib/incidents.ts
import type { FlowDefinition } from "./flows";
import type { FlowHealth } from "./flowMetrics";

export type IncidentStatus = "active" | "resolved";

export type Incident = {
  id: string;
  projectId: string;
  projectName: string;
  flowId: string;
  flowName: string;
  status: IncidentStatus;
  detectedAt: number;
  lastUpdatedAt: number;
  resolvedAt?: number;

  failureRate: number; // 0–1
  attempts: number;
};

let incidents: Incident[] = [];

// thresholds – tweak later
const RISK_THRESHOLD = 0.2; // 30% failure
const MIN_ATTEMPTS = 1;

export function getIncidentsForProject(projectId: string): Incident[] {
  return incidents
    .filter((i) => i.projectId === projectId)
    .sort((a, b) => b.detectedAt - a.detectedAt);
}

export function getAllIncidents(): Incident[] {
  return [...incidents].sort((a, b) => b.detectedAt - a.detectedAt);
}

/**
 * Upsert incidents for a project based on current flow health metrics.
 * Called whenever we recompute flow metrics.
 */
export function upsertIncidentsFromMetrics(options: {
  projectId: string;
  projectName: string;
  flows: FlowDefinition[];
  metrics: FlowHealth[];
}) {
  const { projectId, projectName, flows, metrics } = options;
  const now = Date.now();

  const flowsById = new Map(flows.map((f) => [f.id, f]));

  // Helper to find an active incident for a given flow
  function findActiveIncident(flowId: string): Incident | undefined {
    return incidents.find(
      (i) =>
        i.projectId === projectId &&
        i.flowId === flowId &&
        i.status === "active"
    );
  }

  for (const m of metrics) {
    const flow = flowsById.get(m.flowId);
    if (!flow) continue;

    const isAtRisk =
      m.attempts >= MIN_ATTEMPTS && m.failureRate >= RISK_THRESHOLD;

    const existing = findActiveIncident(m.flowId);

    if (isAtRisk) {
      if (existing) {
        // update existing incident
        existing.lastUpdatedAt = now;
        existing.failureRate = m.failureRate;
        existing.attempts = m.attempts;
      } else {
        // create new incident
        const incident: Incident = {
          id: `inc_${projectId}_${m.flowId}_${now}`,
          projectId,
          projectName,
          flowId: m.flowId,
          flowName: m.flowName,
          status: "active",
          detectedAt: now,
          lastUpdatedAt: now,
          failureRate: m.failureRate,
          attempts: m.attempts,
        };
        incidents.unshift(incident);
      }
    } else if (existing) {
      // flow no longer at risk: resolve the incident
      existing.status = "resolved";
      existing.lastUpdatedAt = now;
      existing.resolvedAt = now;
    }
  }
}
