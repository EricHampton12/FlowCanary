// lib/mockData.ts

export type OverviewStats = {
  errors24h: number;
  flowsAtRisk: number;
  avgLcp: number;
  rageClicks: number;
};

export type FlowSummary = {
  id: string;
  name: string;
  status: "Healthy" | "Warning";
  failureRate: string;
  lastIncident: string;
};

export type ProjectSummary = {
  id: string;
  name: string;
  events24h: number;
  flows: number;
};

export type ProjectDetail = {
  id: string;
  name: string;
  errorTrend: number[];
};

export const mockOverviewStats: OverviewStats = {
  errors24h: 124,
  flowsAtRisk: 3,
  avgLcp: 1.9,
  rageClicks: 42,
};

export const mockFlows: FlowSummary[] = [
  {
    id: "checkout",
    name: "Checkout",
    status: "Warning",
    failureRate: "12%",
    lastIncident: "12 min ago",
  },
  {
    id: "signup",
    name: "Sign up",
    status: "Healthy",
    failureRate: "0.6%",
    lastIncident: "3 hours ago",
  },
  {
    id: "article-view",
    name: "Article view",
    status: "Healthy",
    failureRate: "0.2%",
    lastIncident: "1 day ago",
  },
];

export const mockProjects: ProjectSummary[] = [
  {
    id: "demo-news-site",
    name: "Demo News Site",
    events24h: 18237,
    flows: 4,
  },
  {
    id: "checkout-v2",
    name: "Checkout v2",
    events24h: 9321,
    flows: 3,
  },
];

export const mockProjectDetails: ProjectDetail[] = [
  {
    id: "demo-news-site",
    name: "Demo News Site",
    errorTrend: [12, 19, 7, 22, 30, 18, 9],
  },
  {
    id: "checkout-v2",
    name: "Checkout v2",
    errorTrend: [3, 6, 4, 5, 7, 9, 4],
  },
];
