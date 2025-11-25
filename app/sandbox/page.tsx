"use client";

import { useEffect, useState } from "react";
import { initFlowCanary, sendFlowCanaryEvent, trackFlowStep } from "@/lib/client-sdk";

function randomSessionId() {
  return `sess_${Math.random().toString(36).slice(2, 10)}`;
}

export default function SandboxPage() {
  const [sessionId] = useState(() => randomSessionId());

  useEffect(() => {
    initFlowCanary({ projectId: "demo-news-site" });

    void sendFlowCanaryEvent("page_view", {
      path: "/sandbox",
    });
  }, []);
    async function simulateFailedAttempt() {
    const failingSession = randomSessionId();
    await trackFlowStep({
      flowId: "checkout",
      stepId: "step-1", // only first step → never reaches confirmation
      sessionId: failingSession,
      path: "/sandbox",
      payload: { label: "Cart page loaded (stuck)" },
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold">FlowCanary Sandbox</h1>
        <p className="text-sm text-slate-400">
          Use these buttons to simulate a checkout flow for demo-news-site.
        </p>

        <div className="flex flex-col gap-2 text-sm">
          <button
            className="rounded-md border border-slate-700 px-4 py-2 hover:bg-slate-900"
            onClick={() =>
              trackFlowStep({
                flowId: "checkout",
                stepId: "step-1",
                sessionId,
                path: "/sandbox",
                payload: { label: "Cart page loaded" },
              })
            }
          >
            Step 1: Cart page loaded
          </button>
          <button
            className="rounded-md border border-slate-700 px-4 py-2 hover:bg-slate-900"
            onClick={() =>
              trackFlowStep({
                flowId: "checkout",
                stepId: "step-2",
                sessionId,
                path: "/sandbox",
                payload: { label: "Payment step visible" },
              })
            }
          >
            Step 2: Payment visible
          </button>
          <button
            className="rounded-md border border-emerald-500 px-4 py-2 hover:bg-emerald-500/10"
            onClick={() =>
              trackFlowStep({
                flowId: "checkout",
                stepId: "step-3",
                sessionId,
                path: "/sandbox",
                payload: { label: "Order confirmation shown" },
              })
            }
          >
            Step 3: Confirmation
          </button>
        </div>
          <div className="mt-4 space-y-2 text-sm">
          <button
            className="rounded-md border border-amber-500 px-4 py-2 hover:bg-amber-500/10 text-amber-200"
            onClick={simulateFailedAttempt}
          >
            Generate failed attempt (cart only)
          </button>
          <p className="text-xs text-slate-500">
            Each click creates a new session that only hits step 1. This should
            increase the failure rate for the Checkout flow.
          </p>
        </div>

        <p className="text-xs text-slate-500">
          Each sequence of steps with the same sessionId is treated as a flow attempt.
        </p>
      </div>
    </main>
  );
}
