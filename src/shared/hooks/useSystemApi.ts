import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import {
  fetchSystemById,
  updateSystem,
  createSystem,
  deleteSystem,
  fetchDescendants,
} from "@/shared/slices/system/system.service";
import type { System } from "@/shared/slices/system/system.types";

// Shared query key prefixes
export const QUERY_KEYS = {
  graphData: ["graph-data"] as const,
  system: (id: string) => ["system", id] as const,
  descendants: (id: string) => ["descendants", id] as const,
};

// Fetch a single system
export function useFetchSystem(id: string) {
  return useQuery<System, PostgrestError>({
    queryKey: QUERY_KEYS.system(id),
    queryFn: () => fetchSystemById(id),
    enabled: !!id, // skip query if no id provided
    staleTime: 30_000,
  });
}

// Fetch direct child systems
export function useFetchDescendants(id: string) {
  return useQuery<System[], PostgrestError>({
    queryKey: QUERY_KEYS.descendants(id),
    queryFn: () => fetchDescendants(id),
     enabled: !!id, // skip query if no id provided
    staleTime: 30_000,
  });
}

// Update a system's name/category and then invalidate relevant caches
export function useUpdateSystem(id: string) {
  const qc = useQueryClient();
  return useMutation<
    System,
    PostgrestError,
    Partial<Pick<System, "name" | "category">>
  >({
    mutationFn: (patch) => updateSystem(id, patch),
    onSuccess: () => {
      // Refresh system details
      qc.invalidateQueries({ queryKey: QUERY_KEYS.system(id) });
      // Refresh all graph data (full or subtree)
      qc.invalidateQueries({ queryKey: QUERY_KEYS.graphData });
    },
  });
}

// Create a new child under a given parent system
export function useCreateChildSystem(parentId: string) {
  const qc = useQueryClient();
  return useMutation<System, PostgrestError, string>({
    mutationFn: (name) => createSystem(name, "service", parentId),
    onSuccess: () => {
      // Refresh child list
      qc.invalidateQueries({ queryKey: QUERY_KEYS.descendants(parentId) });
      // Refresh graph to include new node
      qc.invalidateQueries({ queryKey: QUERY_KEYS.graphData });
    },
  });
}

// Remove a child system and update caches
export function useRemoveChildSystem(parentId: string) {
  const qc = useQueryClient();
  return useMutation<void, PostgrestError, string>({
    mutationFn: (childId) => deleteSystem(childId),
    onSuccess: () => {
      // Refresh child list
      qc.invalidateQueries({ queryKey: QUERY_KEYS.descendants(parentId) });
      // Refresh graph to remove node
      qc.invalidateQueries({ queryKey: QUERY_KEYS.graphData });
    },
  });
}
