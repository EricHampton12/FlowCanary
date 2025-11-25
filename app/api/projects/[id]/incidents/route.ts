// app/api/projects/[id]/incidents/route.ts
import { NextResponse } from "next/server";
import { getIncidentsForProject } from "@/lib/incidents";

type ParamsContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: ParamsContext) {
  const { id } = await context.params;
  const incidents = getIncidentsForProject(id);
  return NextResponse.json({ incidents });
}
