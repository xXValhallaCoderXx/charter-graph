import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

export function getLayoutedNodes(
  rawNodes: Node[],
  rawEdges: Edge[],
  selectedId?: string
): { nodes: Node[]; edges: Edge[] } {
  // 1) run your existing dagre layout to compute positions
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", ranksep: 50, nodesep: 30 });
  g.setDefaultEdgeLabel(() => ({}));

  rawNodes.forEach((n) => {
    g.setNode(n.id, { width: 180, height: 50 });
  });
  rawEdges.forEach((e) => {
    g.setEdge(e.source, e.target);
  });
  dagre.layout(g);

  // 2) Map back to ReactFlow nodes & edges, merging old style + new style
  const nodes = rawNodes.map((n) => {
    const pos = g.node(n.id);
    const isSel = n.id === selectedId;

    return {
      ...n,
      position: { x: pos.x - 90, y: pos.y - 25 },
      style: {
        ...n.style,
        borderWidth: isSel ? 3 : 1,
        borderColor: isSel ? "#4F46E5" : n.style?.borderColor ?? "#333",
      },
    };
  });

  const edges = rawEdges.map((e) => {
    const isSelEdge = selectedId === e.source || selectedId === e.target;

    return {
      ...e,
      animated: Boolean(isSelEdge),
      style: {
        ...e.style,
        stroke: isSelEdge ? "#4F46E5" : e.style?.stroke ?? "#999",
      },
    };
  });

  return { nodes, edges };
}