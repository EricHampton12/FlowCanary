// app/dashboard/layout.tsx
'use client';
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Small helper to highlight active links
function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  // App Router layouts are server components by default.
  // We'll keep this simple: no active highlighting for now.
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
    >
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-slate-800 bg-slate-950/80 p-4 md:flex md:flex-col">
        <div className="mb-6">
          <div className="text-lg font-semibold tracking-tight">
            FlowCanary
          </div>
          <div className="text-xs text-slate-500">
            Frontend Flow Monitoring
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink href="/dashboard" label="Overview" />
          <NavLink href="/dashboard/projects" label="Projects" />
          {/* You can add “Alerts”, “Settings” later */}
        </nav>

        <div className="mt-4 border-t border-slate-800 pt-4 text-xs text-slate-500">
          Early Access • v0.0.1
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-100">
              Dashboard
            </div>
            <div className="text-xs text-slate-500">
              Prototype environment
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="hidden sm:inline">Project:</span>
            <button className="rounded-md border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800">
              Demo Project
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-slate-950 px-4 py-4 md:px-6 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
