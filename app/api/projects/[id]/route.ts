// app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { mockProjectDetails, type ProjectDetail } from "@/lib/mockData";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // In Next 15, params is a Promise – we need to await it
  const { id } = await context.params;

  // Find the single project object from the array
  const project: ProjectDetail | undefined = mockProjectDetails.find(
    (p) => p.id === id
  );

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}
