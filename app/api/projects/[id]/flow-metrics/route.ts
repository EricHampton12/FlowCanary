// app/api/projects/[id]/flow-metrics/route.ts
import { NextResponse } from "next/server";
import { getFlowsForProject } from "@/lib/flows";
import { getRecentEvents } from "@/lib/eventStore";
import { computeFlowHealthForProject } from "@/lib/flowMetrics";
import { upsertIncidentsFromMetrics } from "@/lib/incidents";
import { mockProjectDetails } from "@/lib/mockData";

type ParamsContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: ParamsContext) {
  const { id } = await context.params;

  const flows = getFlowsForProject(id);
  const events = getRecentEvents(200); // simple recent window

  const metrics = computeFlowHealthForProject({
    projectId: id,
    flows,
    events,
  });

  // find project name from mock data
  const project = mockProjectDetails.find((p) => p.id === id);
  const projectName = project?.name ?? id;

  // update incidents store based on current metrics
  upsertIncidentsFromMetrics({
    projectId: id,
    projectName,
    flows,
    metrics,
  });

  return NextResponse.json({ metrics });
}
