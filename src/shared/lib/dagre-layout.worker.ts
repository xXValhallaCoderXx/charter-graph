/* eslint-disable @typescript-eslint/no-explicit-any */
import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

self.onmessage = function (e: any) {
  //   const { nodes: rawNodes, edges: rawEdges, selectedId } = e.data
  const { nodes: rawNodes, edges: rawEdges, selectedId } = e.data;

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    ranksep: 100,
    nodesep: 50,
    align: "UL",
  });
  g.setDefaultEdgeLabel(() => ({}));

  rawNodes.forEach((n: Node) => {
    g.setNode(n.id, { width: 180, height: 50 });
  });
  rawEdges.forEach((e: Edge) => {
    g.setEdge(e.source, e.target);
  });
  dagre.layout(g);

  const nodes = rawNodes.map((n: Node) => {
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

  const edges = rawEdges.map((e: Edge) => {
    const isSelEdge = selectedId === e.source || selectedId === e.target;
    return {
      ...e,
      style: {
        ...e.style,
        stroke: isSelEdge ? "#4F46E5" : e.style?.stroke ?? "#999",
      },
    };
  });

  // Send result back to main thread
  self.postMessage({ nodes, edges });
};
