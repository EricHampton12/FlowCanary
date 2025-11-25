"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        {/* Top nav */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/40" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                FlowCanary
              </span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Frontend flow monitoring
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/dashboard"
              className="rounded-md border border-slate-700 px-3 py-1.5 text-slate-200 hover:bg-slate-900"
            >
              View demo dashboard
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col justify-center gap-8 pb-12 pt-4 md:flex-row md:items-center">
          <div className="max-w-xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200">
              Early access • For frontend teams
            </p>

            <h1 className="text-3xl font-semibold leading-tight text-slate-50 md:text-4xl">
              Detect broken frontend flows{" "}
              <span className="text-emerald-300">before your users do.</span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-400 md:text-base">
              FlowCanary watches your production UI for broken checkouts, dead
              buttons, rage clicks, and performance spikes—then sends you a
              clear signal when a flow silently fails.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-2">
              <div className="flex flex-col gap-2 text-sm md:flex-row">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center rounded-md border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Joining…" : "Join early access"}
                </button>
              </div>

              {status === "success" && (
                <p className="text-xs text-emerald-300">
                  You&apos;re in. We&apos;ll reach out when FlowCanary is ready
                  for your stack.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-400">
                  Something went wrong. Try again in a moment.
                </p>
              )}
              {status === "idle" && (
                <p className="text-xs text-slate-500">
                  No spam. Just a short note when we&apos;re ready for more
                  teams.
                </p>
              )}
            </form>
          </div>

          {/* Right side: fake dashboard preview */}
          <div className="mt-8 w-full max-w-md md:mt-0">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg shadow-slate-950/40">
              <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>FlowCanary · Demo project</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                  Live signal
                </span>
              </div>

              <div className="grid gap-2 text-xs md:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                  <div className="text-[10px] uppercase text-slate-500">
                    Flows at risk
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-50">
                    3
                  </div>
                  <div className="mt-1 text-[11px] text-amber-300">
                    Checkout, Sign up, Article view
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                  <div className="text-[10px] uppercase text-slate-500">
                    Rage clicks (24h)
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-50">
                    42
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Clustered on 2 components
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Critical flows</span>
                  <span>Last 24h</span>
                </div>
                <ul className="space-y-1 text-[11px]">
                  <li className="flex items-center justify-between">
                    <span className="text-slate-200">Checkout</span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300">
                      Failing 12%
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-200">Sign up</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                      Healthy
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-200">Article view</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                      Healthy
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-500">
                <span>Inline JS SDK · ~3kb</span>
                <span>Alerts to Slack · Email</span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-900 pt-6 text-xs text-slate-400 md:text-sm">
          <h2 className="mb-3 text-sm font-medium text-slate-100">
            How FlowCanary fits into your stack
          </h2>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                01 · Drop the snippet
              </div>
              <p>
                Add a tiny JS SDK to your app. No rerouting traffic, no complex
                proxy, no production rebuilds required.
              </p>
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                02 · Define flows
              </div>
              <p>
                Tell FlowCanary what to watch: checkout, sign up, paywall
                unlock, newsletter opt-in—using simple JSON definitions.
              </p>
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                03 · Get a clear signal
              </div>
              <p>
                When something silently breaks, FlowCanary surfaces it with a
                concrete incident: which flow, which component, and how bad.
              </p>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
