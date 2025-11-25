"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProjectSummary } from "@/lib/mockData";

type ProjectsResponse = {
  projects: ProjectSummary[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const json = (await res.json()) as ProjectsResponse;
        setProjects(json.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-400">Loading projects…</div>;
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">
            Projects
          </h1>
          <p className="text-xs text-slate-500">
            Each project represents a monitored application.
          </p>
        </div>
        <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
          + New project
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="block rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-600 hover:bg-slate-900"
          >
            <div className="text-sm font-medium text-slate-100">
              {project.name}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              ID: {project.id}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
              <span>{project.events24h.toLocaleString()} events (24h)</span>
              <span>•</span>
              <span>{project.flows} flows</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
