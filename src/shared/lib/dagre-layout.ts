import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

export function getLayoutedNodes(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 50 });

  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 40 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      ...n,
      position: { x: pos.x - 180 / 2, y: pos.y - 40 / 2 },
    };
  });
}
