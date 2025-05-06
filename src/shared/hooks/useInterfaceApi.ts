import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import {
  deleteInterface,
  createInterface,
  fetchInterfacesBySystemIds,
  updateInterface,
} from "../slices/interface/interface.service";
import { SystemInterface } from "../slices/interface/interface.types";
import { QUERY_KEYS } from "../slices/query-keys";

/**
 * Hook: fetch all interfaces for a given root (and its descendants)
 */
export function useFetchInterfaces(rootId?: string) {
  return useQuery<SystemInterface[], PostgrestError>({
    queryKey: QUERY_KEYS.interfaces(rootId),
    queryFn: () =>
      rootId
        ? fetchInterfacesBySystemIds([rootId])
        : fetchInterfacesBySystemIds([]),
    enabled: Boolean(rootId),
    staleTime: 30_000,
  });
}

/**
 * Hook: create a new interface and invalidate caches
 */
export function useCreateInterface(rootId?: string) {
  const qc = useQueryClient();
  return useMutation<
    SystemInterface,
    PostgrestError,
    Omit<SystemInterface, "id">
  >({
    mutationFn: (payload) => createInterface(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.interfaces(rootId) });
      //   qc.invalidateQueries({ queryKey: QUERY_KEYS.graphData(rootId) });
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}

/**
 * Hook: update an existing interface and invalidate caches
 */
export function useUpdateInterface(rootId?: string) {
  const qc = useQueryClient();
  return useMutation<
    SystemInterface,
    PostgrestError,
    Partial<Omit<SystemInterface, "id">> & { id: string }
  >({
    mutationFn: ({ id, ...updates }) => updateInterface(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.interfaces(rootId) });
      //   qc.invalidateQueries({ queryKey: QUERY_KEYS.graphData(rootId) });
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}

/**
 * Hook: delete an interface by ID and invalidate caches
 */
export function useDeleteInterface(rootId?: string) {
  const qc = useQueryClient();
  return useMutation<void, PostgrestError, string>({
    mutationFn: (id) => deleteInterface(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.interfaces(rootId) });
      //   qc.invalidateQueries({ queryKey: QUERY_KEYS.graphData(rootId) });
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}
