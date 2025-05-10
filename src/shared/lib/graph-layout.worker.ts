/* eslint-disable @typescript-eslint/no-explicit-any */
// import dagre from "dagre";
import {
  normalizeGraph,
  applyDagreLayout,
} from "../slices/graph/graph.services";

interface ApiNode {
  id: number;
  name: string;
  category: string;
  parent_id: number | null;
}
interface ApiEdge {
  id: number;
  system_a_id: number;
  system_b_id: number;
  connection_type: string;
  directional: boolean;
}

interface FlowNode {
  id: string;
  type: string;
  data: { label: string; category: string; parentId: string | null };
  position?: { x: number; y: number };
}
interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  type?: string;
}

self.onmessage = function (event: MessageEvent) {
  const { type, payload } = event.data as {
    type: "INIT" | "LAYOUT";
    payload: any;
  };

  if (type === "INIT") {
    // 1) Normalize
    const { nodes, edges } = normalizeGraph(
      payload.nodes as ApiNode[],
      payload.edges as ApiEdge[]
    );
    // 2) Send back to main thread
    self.postMessage({ type: "NORMALIZED", payload: { nodes, edges } });
  }

  if (type === "LAYOUT") {
    console.log("PROCESSING LAYOUT");
    // payload should be the normalized { nodes, edges }
    const { nodes, edges } = applyDagreLayout(
      payload.nodes as FlowNode[],
      payload.edges as FlowEdge[]
    );
    self.postMessage({ type: "LAYOUT_COMPLETE", payload: { nodes, edges } });
  }
  //   const { nodes: rawNodes, edges: rawEdges, selectedId } = e.data
  //   const { nodes: rawNodes, edges: rawEdges, selectedId } = e.data;

  //   const g = new dagre.graphlib.Graph();
  //   g.setGraph({
  //     rankdir: "TB",
  //     ranksep: 100,
  //     nodesep: 50,
  //     align: "UL",
  //   });
  //   g.setDefaultEdgeLabel(() => ({}));

  //   rawNodes.forEach((n: Node) => {
  //     g.setNode(n.id, { width: 180, height: 50 });
  //   });
  //   rawEdges.forEach((e: Edge) => {
  //     g.setEdge(e.source, e.target);
  //   });
  //   dagre.layout(g);

  //   const nodes = rawNodes.map((n: Node) => {
  //     const pos = g.node(n.id);
  //     const isSel = n.id === selectedId;
  //     return {
  //       ...n,
  //       position: { x: pos.x - 90, y: pos.y - 25 },
  //       style: {
  //         ...n.style,
  //         borderWidth: isSel ? 3 : 1,
  //         borderColor: isSel ? "#4F46E5" : n.style?.borderColor ?? "#333",
  //       },
  //     };
  //   });

  //   const edges = rawEdges.map((e: Edge) => {
  //     const isSelEdge = selectedId === e.source || selectedId === e.target;
  //     return {
  //       ...e,
  //       style: {
  //         ...e.style,
  //         stroke: isSelEdge ? "#4F46E5" : e.style?.stroke ?? "#999",
  //       },
  //     };
  //   });

  // Send result back to main thread
  self.postMessage({ nodes: [], edges: [] });
};
