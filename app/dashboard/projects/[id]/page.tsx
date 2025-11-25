"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ProjectDetail } from "@/lib/mockData";

type ProjectDetailResponse = {
  project: ProjectDetail;
};

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch project");
        const json = (await res.json()) as ProjectDetailResponse;
        setProject(json.project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="text-sm text-slate-400">Loading project…</div>;
  }

  if (notFound || !project) {
    return (
      <div className="text-sm text-red-400">
        Project not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">
          {project.name}
        </h1>
        <p className="text-xs text-slate-500">Project ID: {project.id}</p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
        Error trend chart placeholder (values:{" "}
        {project.errorTrend.join(", ")} )
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
        Flow list + incidents will go here.
      </section>
    </div>
  );
}
