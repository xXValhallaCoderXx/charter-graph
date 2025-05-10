import dagre from "dagre";
import { System } from "../system/system.types";
import { SystemInterface } from "../interface/interface.types";
import { FlowEdge, FlowNode } from "./graph.types";

export function normalizeGraph(
  apiNodes: System[],
  apiEdges: SystemInterface[]
): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodeMap = new Map<number, FlowNode>();

  const nodes: FlowNode[] = apiNodes.map((n) => {
    const flowNode: FlowNode = {
      id: String(n.id),
      type: "default",
      data: {
        label: n.name,
        category: n.category,
        parentId: n.parent_id !== null ? String(n.parent_id) : null,
      },
    };
    nodeMap.set(parseInt(n.id), flowNode);
    return flowNode;
  });

  const edges: FlowEdge[] = apiEdges.map((e) => ({
    id: String(e.id),
    source: String(e.system_a_id),
    target: String(e.system_b_id),
    label: e.connection_type,
    animated: e.directional,
    type: e.directional ? "smoothstep" : "default",
  }));

  return { nodes, edges };
}

export function applyDagreLayout(nodes: FlowNode[], edges: FlowEdge[]) {
  // build dagre graph
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    ranksep: 100,
    nodesep: 50,
    align: "UL",
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    // estimate node width/height or keep constant
    g.setNode(n.id, { width: 150, height: 50 });
  });
  edges.forEach((e) => {
    g.setEdge(e.source, e.target);
  });

  dagre.layout(g);

  // write positions back into FlowNode
  const positioned = nodes.map((n) => {
    const { x, y } = g.node(n.id)!;
    return { ...n, position: { x: x - 75, y: y - 25 } };
  });

  return { nodes: positioned, edges };
}
