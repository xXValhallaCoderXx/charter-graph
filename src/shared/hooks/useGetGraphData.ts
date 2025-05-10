/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { fetchGraph } from "@/shared/slices/system/system.service";
import type { Node, Edge } from "@xyflow/react";

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export function useGetGraphData(
  rootId?: string
): UseQueryResult<FlowData, PostgrestError> {
  return useQuery<any, PostgrestError>({
    queryKey: ["graph-data", rootId],
    queryFn: async () => {
      const { nodes: rawNodes, edges: rawEdges } = await fetchGraph(rootId);

      return { nodes: rawNodes, edges: rawEdges };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
