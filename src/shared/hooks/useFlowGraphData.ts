/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { fetchGraph } from "@/shared/slices/system/system.service";
import type { Node, Edge } from "@xyflow/react";

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export function useFlowData(
  rootId?: string
): UseQueryResult<FlowData, PostgrestError> {
  return useQuery<FlowData, PostgrestError>({
    queryKey: ["graph-data", rootId],
    queryFn: async () => {
      console.log("Fetching graph data...");
      console.log("Root ID: ", rootId);
      const { nodes: rawNodes, edges: rawEdges } = await fetchGraph(rootId);

      // 2) map to React-Flow shapes
      const nodes: Node[] = rawNodes.map((sys) => ({
        id: sys.id.toString(), // ← string!
        data: { label: sys.name },
        position: { x: 0, y: 0 },
        style: { borderRadius: 8, padding: 10 },
      }));

      const edges: Edge[] = rawEdges.map((intf) => ({
        id: intf.id.toString(), // ← string!
        source: intf.system_a_id.toString(),
        target: intf.system_b_id.toString(),
        animated: intf.directional,
        label: intf.connection_type,
        style: { strokeWidth: 2 },
      }));

      return { nodes, edges };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
