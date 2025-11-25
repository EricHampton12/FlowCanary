"use client";

import { useEffect, useState } from "react";
import type { OverviewStats, FlowSummary } from "@/lib/mockData";
import type { FlowCanaryEvent } from "@/lib/events";

type OverviewResponse = {
  stats: OverviewStats;
  flows: FlowSummary[];
};

type EventsResponse = {
  events: FlowCanaryEvent[];
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [events, setEvents] = useState<FlowCanaryEvent[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch("/api/overview");
        if (!res.ok) throw new Error("Failed to fetch overview");
        const json = (await res.json()) as OverviewResponse;
        setOverview(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOverview(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const json = (await res.json()) as EventsResponse;
        setEvents(json.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchOverview();
    fetchEvents();
  }, []);

  if (loadingOverview && !overview) {
    return <div className="text-sm text-slate-400">Loading overview…</div>;
  }

  if (!overview) {
    return (
      <div className="text-sm text-red-400">
        Failed to load overview data.
      </div>
    );
  }

  const { stats, flows } = overview;

  return (
    <div className="space-y-6">
      {/* existing summary cards + flows table here... */}

      {/* Recent events */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-slate-100">
              Recent events
            </h2>
            <p className="text-xs text-slate-500">
              Last {events.length} ingested events (dev in-memory store).
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loadingEvents ? (
            <div className="px-4 py-3 text-xs text-slate-400">
              Loading events…
            </div>
          ) : events.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-500">
              No events yet. Visit the sandbox page and trigger some events.
            </div>
          ) : (
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-[11px] uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Project</th>
                  <th className="px-4 py-2">Path</th>
                  <th className="px-4 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-800/60 hover:bg-slate-900"
                  >
                    <td className="px-4 py-2 text-slate-400">
                      {new Date(e.ts).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2 text-slate-100">
                      {e.type}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {e.projectId}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {e.path ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-slate-400">
                      {e.payload && Object.keys(e.payload).length > 0
                        ? JSON.stringify(e.payload)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
