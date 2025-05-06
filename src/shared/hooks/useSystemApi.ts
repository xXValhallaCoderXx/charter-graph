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

export const QUERY_KEYS = {
  graph: ["graph"] as const,
  system: (id: string) => ["system", id] as const,
  descendants: (id: string) => ["descendants", id] as const,
};

export function useFetchSystem(id: string) {
  return useQuery<System, PostgrestError>({
    queryKey: QUERY_KEYS.system(id),
    queryFn: () => fetchSystemById(id),
    staleTime: 30_000,
  });
}

// Update system fields
export function useUpdateSystem(id: string) {
  const qc = useQueryClient();
  return useMutation<
    System,
    PostgrestError,
    Partial<Pick<System, "name" | "category">>
  >({
    mutationFn: (patch) => updateSystem(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.system(id) }),
  });
}

// Create a new child system
export function useCreateChildSystem(parentId: string) {
  const qc = useQueryClient();
  return useMutation<System, PostgrestError, string>({
    mutationFn: (name) => createSystem(name, "service", parentId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.descendants(parentId) }),
  });
}

// Remove an existing child system
export function useRemoveChildSystem(parentId: string) {
  const qc = useQueryClient();
  return useMutation<void, PostgrestError, string>({
    mutationFn: (childId) => deleteSystem(childId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.descendants(parentId) }),
  });
}

// Fetch all descendants of a system
export function useFetchDescendants(id: string) {
  return useQuery<System[], PostgrestError>({
    queryKey: QUERY_KEYS.descendants(id),
    queryFn: () => fetchDescendants(id),
    staleTime: 30_000,
  });
}
