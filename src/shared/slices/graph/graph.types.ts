export interface FlowNode {
  id: string;
  type: string;
  data: { label: string; category: string; parentId: string | null };
  position?: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  type?: string;
}
