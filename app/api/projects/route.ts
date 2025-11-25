// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { mockProjects } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    projects: mockProjects,
  });
}
