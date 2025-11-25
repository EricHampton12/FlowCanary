"use client";

import { useEffect, useState } from "react";
import type { OverviewStats, FlowSummary } from "@/lib/mockData";

type OverviewResponse = {
  stats: OverviewStats;
  flows: FlowSummary[];
};

export default function DashboardPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch("/api/overview");
        if (!res.ok) throw new Error("Failed to fetch overview");
        const json = (await res.json()) as OverviewResponse;
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-400">Loading overview…</div>;
  }

  if (!data) {
    return (
      <div className="text-sm text-red-400">
        Failed to load overview data.
      </div>
    );
  }

  const { stats, flows } = data;

  return (
    <div className="space-y-6">
      {/* Top summary cards */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="text-xs uppercase text-slate-400">
            JS Errors (24h)
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {stats.errors24h}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Spike vs baseline
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="text-xs uppercase text-slate-400">
            Flows at Risk
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {stats.flowsAtRisk}
          </div>
          <div className="mt-1 text-xs text-amber-400">
            Investigate before deploy
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="text-xs uppercase text-slate-400">
            Avg LCP (s)
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {stats.avgLcp.toFixed(1)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Across monitored pages
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="text-xs uppercase text-slate-400">
            Rage Clicks (24h)
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {stats.rageClicks}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Clustered on 2 components
          </div>
        </div>
      </section>

      {/* Flows table */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-medium text-slate-100">
            Critical flows
          </h2>
          <p className="text-xs text-slate-500">
            Monitored paths and their recent failure behavior.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-2">Flow</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Failure rate</th>
                <th className="px-4 py-2">Last incident</th>
              </tr>
            </thead>
            <tbody>
              {flows.map((flow) => (
                <tr
                  key={flow.id}
                  className="border-t border-slate-800/60 hover:bg-slate-900"
                >
                  <td className="px-4 py-2 text-slate-100">
                    {flow.name}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        flow.status === "Healthy"
                          ? "inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300"
                          : "inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300"
                      }
                    >
                      {flow.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-200">
                    {flow.failureRate}
                  </td>
                  <td className="px-4 py-2 text-slate-400 text-xs">
                    {flow.lastIncident}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
