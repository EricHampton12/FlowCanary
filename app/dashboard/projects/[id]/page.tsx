"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import type { ProjectDetail } from "@/lib/mockData";
import type { FlowDefinition } from "@/lib/flows";
import type { FlowHealth } from "@/lib/flowMetrics";
import type { Incident } from "@/lib/incidents";

// -----------------------------------------
// Flow Status Classification
// -----------------------------------------
function classifyFlowStatus(m: FlowHealth | undefined) {
  if (!m || m.attempts === 0) {
    return { label: "No signal", tone: "muted" as const };
  }

  // Looser dev thresholds (matching the Incident logic)
  if (m.failureRate >= 0.2 && m.attempts >= 1) {
    return { label: "At risk", tone: "danger" as const };
  }

  if (m.failureRate >= 0.05 && m.attempts >= 1) {
    return { label: "Watch", tone: "warn" as const };
  }

  return { label: "Healthy", tone: "ok" as const };
}

// -----------------------------------------
// Component
// -----------------------------------------
export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [flows, setFlows] = useState<FlowDefinition[]>([]);
  const [metrics, setMetrics] = useState<FlowHealth[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingFlows, setLoadingFlows] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Add-flow form state
  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowDescription, setNewFlowDescription] = useState("");
  const [newFlowStepsText, setNewFlowStepsText] = useState("");
  const [submittingFlow, setSubmittingFlow] = useState(false);

  // -----------------------------------------
  // Fetch Data
  // -----------------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const json = await res.json();
        setProject(json.project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProject(false);
      }
    };

    const fetchFlows = async () => {
      try {
        const res = await fetch(`/api/projects/${id}/flows`);
        const json = await res.json();
        setFlows(json.flows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFlows(false);
      }
    };

    const fetchMetrics = async () => {
      try {
        const res = await fetch(`/api/projects/${id}/flow-metrics`);
        const json = await res.json();
        setMetrics(json.metrics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMetrics(false);
      }
    };

    const fetchIncidents = async () => {
      try {
        const res = await fetch(`/api/projects/${id}/incidents`);
        const json = await res.json();
        setIncidents(json.incidents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingIncidents(false);
      }
    };

    fetchProject();
    fetchFlows();
    fetchMetrics();
    fetchIncidents();
  }, [id]);

  // -----------------------------------------
  // Handle Add Flow
  // -----------------------------------------
  async function handleAddFlow(e: FormEvent) {
    e.preventDefault();
    if (!id) return;

    const steps = newFlowStepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!newFlowName || steps.length === 0) return;

    setSubmittingFlow(true);

    try {
      const res = await fetch(`/api/projects/${id}/flows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFlowName,
          description: newFlowDescription,
          steps,
        }),
      });

      const json = await res.json();
      setFlows((prev) => [json.flow, ...prev]);
      setNewFlowName("");
      setNewFlowDescription("");
      setNewFlowStepsText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFlow(false);
    }
  }

  if (loadingProject && !project) {
    return <div className="text-sm text-slate-400">Loading project...</div>;
  }

  if (notFound || !project) {
    return <div className="text-sm text-red-400">Project not found.</div>;
  }

  const metricsByFlowId = new Map(metrics.map((m) => [m.flowId, m]));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">{project.name}</h1>
        <p className="text-xs text-slate-500">Project ID: {project.id}</p>
      </header>

      {/* Project settings */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-sm font-medium text-slate-100">Project settings</h2>
        <p className="text-xs text-slate-500 mt-1">SDK snippet & key.</p>

        <div className="mt-3 text-xs">
          <div className="text-slate-400">API key</div>
          <div className="mt-1 rounded-md border border-slate-700 bg-slate-950 p-2 font-mono text-[11px]">
            {project.apiKey}
          </div>
        </div>
      </section>

      {/* Flow definitions */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
        <h2 className="text-sm font-medium text-slate-100">Flow definitions</h2>
        <p className="text-xs text-slate-500">Define the key UX flows.</p>

        {/* Add Flow Form */}
        <form
          onSubmit={handleAddFlow}
          className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 grid gap-3"
        >
          <input
            value={newFlowName}
            onChange={(e) => setNewFlowName(e.target.value)}
            placeholder="Flow name"
            className="px-2 py-1.5 rounded-md border border-slate-700 bg-slate-950 text-sm"
          />

          <input
            value={newFlowDescription}
            onChange={(e) => setNewFlowDescription(e.target.value)}
            placeholder="Description"
            className="px-2 py-1.5 rounded-md border border-slate-700 bg-slate-950 text-sm"
          />

          <textarea
            rows={3}
            value={newFlowStepsText}
            onChange={(e) => setNewFlowStepsText(e.target.value)}
            placeholder="Steps (one per line)"
            className="px-2 py-1.5 rounded-md border border-slate-700 bg-slate-950 text-sm"
          />

          <button
            type="submit"
            disabled={submittingFlow}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {submittingFlow ? "Adding..." : "Add flow"}
          </button>
        </form>

        {/* Flow List */}
        <div className="overflow-x-auto text-xs">
          <table className="min-w-full text-left">
            <thead className="bg-slate-900/80 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Steps</th>
              </tr>
            </thead>
            <tbody>
              {flows.map((flow) => {
                const m = metricsByFlowId.get(flow.id);
                const status = classifyFlowStatus(m);

                return (
                  <tr
                    key={flow.id}
                    className="border-t border-slate-800/60 hover:bg-slate-900"
                  >
                    <td className="px-3 py-2 text-slate-100">
                      {flow.name}
                      {flow.description && (
                        <div className="text-[11px] text-slate-500">
                          {flow.description}
                        </div>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="px-3 py-2">
                      {(() => {
                        let cls =
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] border ";

                        if (status.tone === "danger")
                          cls +=
                            "border-amber-500 bg-amber-500/20 text-amber-300";
                        else if (status.tone === "warn")
                          cls +=
                            "border-yellow-500 bg-yellow-500/20 text-yellow-300";
                        else if (status.tone === "ok")
                          cls +=
                            "border-emerald-500 bg-emerald-500/20 text-emerald-300";
                        else
                          cls +=
                            "border-slate-700 bg-slate-900 text-slate-400";

                        return <span className={cls}>{status.label}</span>;
                      })()}
                    </td>

                    {/* Steps */}
                    <td className="px-3 py-2 text-slate-300">
                      {flow.steps.map((s) => s.label).join(" → ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Incidents */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
        <h2 className="text-sm font-medium text-slate-100">Incidents</h2>
        <p className="text-xs text-slate-500">
          Automatically created when a flow’s failure rate spikes.
        </p>

        {loadingIncidents ? (
          <div className="text-xs text-slate-400">Loading incidents…</div>
        ) : incidents.length === 0 ? (
          <div className="text-xs text-slate-500">
            No incidents yet — try generating failed attempts in the sandbox.
          </div>
        ) : (
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="px-3 py-2">Flow</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Failure rate</th>
                <th className="px-3 py-2">Attempts</th>
                <th className="px-3 py-2">Detected</th>
                <th className="px-3 py-2">Last updated</th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  className="border-t border-slate-800/60 hover:bg-slate-900"
                >
                  <td className="px-3 py-2 text-slate-100">
                    {inc.flowName}
                  </td>

                  <td className="px-3 py-2">
                    {inc.status === "active" ? (
                      <span className="inline-flex rounded-full border border-amber-500 bg-amber-500/20 px-2 py-0.5 text-[11px] text-amber-300">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-300">
                        Resolved
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {(inc.failureRate * 100).toFixed(1)}%
                  </td>

                  <td className="px-3 py-2 text-slate-300">
                    {inc.attempts}
                  </td>

                  <td className="px-3 py-2 text-slate-400">
                    {new Date(inc.detectedAt).toLocaleTimeString()}
                  </td>

                  <td className="px-3 py-2 text-slate-400">
                    {new Date(inc.lastUpdatedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
