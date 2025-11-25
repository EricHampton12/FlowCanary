export type FlowStep = {
  id: string;
  label: string;
};

export type FlowDefinition = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  steps: FlowStep[];
};

type FlowStore = Record<string, FlowDefinition[]>;

const initialFlows: FlowStore = {
  "demo-news-site": [
    {
      id: "checkout",
      name: "Checkout",
      description: "Cart → payment → confirmation",
      isActive: true,
      steps: [
        { id: "step-1", label: "Cart page loaded" },
        { id: "step-2", label: "Payment step visible" },
        { id: "step-3", label: "Order confirmation displayed" },
      ],
    },
  ],
};

let flowsByProject: FlowStore = { ...initialFlows };

export function getFlowsForProject(projectId: string): FlowDefinition[] {
  return flowsByProject[projectId] ?? [];
}

export function addFlowToProject(
  projectId: string,
  flowInput: Omit<FlowDefinition, "id" | "isActive">
): FlowDefinition {
  const newFlow: FlowDefinition = {
    id: `${flowInput.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    isActive: true,
    ...flowInput,
  };

  const existing = flowsByProject[projectId] ?? [];
  flowsByProject[projectId] = [newFlow, ...existing];

  return newFlow;
}
