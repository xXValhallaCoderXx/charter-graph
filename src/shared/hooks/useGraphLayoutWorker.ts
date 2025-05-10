/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

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

// React Flow types
export interface FlowNode {
  id: string;
  type: string;
  data: { label: string; category: string; parentId: string | null };
  position: { x: number; y: number };
}
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  type?: string;
}

const useGraphLayoutWorker = (
  apiNodes: ApiNode[],
  apiEdges: ApiEdge[]
): { nodes: FlowNode[]; edges: FlowEdge[] } => {
  const workerRef = useRef<Worker | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/shared/lib/graph-layout.worker.ts", import.meta.url)
    );
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    if (!nodes || !edges) return;

    const worker = workerRef.current;

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data as {
        type: "NORMALIZED" | "LAYOUT_COMPLETE";
        payload: { nodes: FlowNode[]; edges: FlowEdge[] };
      };
      console.log("Worker message received:", type, payload);
      if (type === "NORMALIZED") {
        // Request layout after normalization

        worker.postMessage({ type: "LAYOUT", payload });
      }
      if (type === "LAYOUT_COMPLETE") {
        setNodes(payload.nodes);
        setEdges(payload.edges);
      }
    };

    worker.addEventListener("message", handleMessage);

    // Kick off normalization
    worker.postMessage({
      type: "INIT",
      payload: { nodes: apiNodes, edges: apiEdges },
    });

    return () => {
      worker.removeEventListener("message", handleMessage);
      // Optionally terminate worker if not reused elsewhere
      // worker.terminate(); workerRef.current = null;
    };
  }, [apiNodes, apiEdges]);

  return {
    nodes: nodes.length > 0 ? nodes : [],
    edges: edges.length > 0 ? edges : [],
  };
};

export default useGraphLayoutWorker;
