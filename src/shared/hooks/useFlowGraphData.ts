/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { fetchGraph } from "@/shared/slices/system/system.service";
import type { Node, Edge } from "@xyflow/react";
import stringHash from "string-hash";

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export function useFlowData(
  rootId?: string
): UseQueryResult<FlowData, PostgrestError> {
  // in-memory map so each type always gets the same color
  const typeColorMap = new Map<string, string>();
  function getColorForType(type: string): string {
    if (!typeColorMap.has(type)) {
      const hue = stringHash(type) % 360;
      typeColorMap.set(type, `hsl(${hue}, 70%, 60%)`);
    }
    return typeColorMap.get(type)!;
  }

  return useQuery<FlowData, PostgrestError>({
    queryKey: ["graph-data", rootId],
    queryFn: async () => {
      const { nodes: rawNodes, edges: rawEdges } = await fetchGraph(rootId);

      // 2) map to React-Flow shapes
      const nodes: Node[] = rawNodes.map((sys) => {
        // choose your type field—could be sys.category or sys.type
        const t = (sys as any).category ?? "default";
        return {
          id: sys.id.toString(),
          data: { label: sys.name, type: sys.category },
          position: { x: 0, y: 0 },
          style: {
            background: getColorForType(t),
            color: "white",
            fontWeight: 700,
            borderRadius: 8,
            padding: 10,
          },
        };
      });

      const edges: Edge[] = rawEdges.map((intf) => ({
        id: intf.id.toString(),
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
