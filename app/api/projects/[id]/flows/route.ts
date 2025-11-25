import { NextResponse } from "next/server";
import {
  getFlowsForProject,
  addFlowToProject,
  type FlowDefinition,
} from "@/lib/flows";

type ParamsContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: ParamsContext) {
  const { id } = await context.params;
  const flows = getFlowsForProject(id);
  return NextResponse.json({ flows });
}

type NewFlowBody = {
  name?: string;
  description?: string;
  steps?: string[]; // one step label per array entry
};

export async function POST(req: Request, context: ParamsContext) {
  const { id } = await context.params;
  const body = (await req.json()) as NewFlowBody;

  if (!body.name || !body.steps || body.steps.length === 0) {
    return NextResponse.json(
      { error: "name and at least one step are required" },
      { status: 400 }
    );
  }

  const flow = addFlowToProject(id, {
    name: body.name,
    description: body.description ?? "",
    steps: body.steps.map((label, index) => ({
      id: `step-${index + 1}`,
      label,
    })),
  });

  return NextResponse.json({ flow }, { status: 201 });
}
