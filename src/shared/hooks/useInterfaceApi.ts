import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import {
  deleteInterface,
  createInterface,
  fetchInterfacesBySystemIds,
  updateInterface,
} from "../slices/interface/interface.service";
import { System } from "../slices/system/system.types";
import {
  fetchInterfacesByRoot,
  fetchAllSystems,
} from "../slices/system/system.service";
import { SystemInterface } from "@/shared/slices/interface/interface.types";
import { QUERY_KEYS } from "@/shared/slices/query-keys";

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

export function useFetchAllSystems() {
  return useQuery<System[], PostgrestError>({
    queryKey: ["systems"] as const,
    queryFn: fetchAllSystems,
    staleTime: 30_000,
  });
}

export function useFetchInterfaces2(rootId?: string) {
  return useQuery<SystemInterface[], PostgrestError>({
    queryKey: rootId ? QUERY_KEYS.interfaces(rootId) : ["interfaces"],
    queryFn: () => fetchInterfacesByRoot(rootId!),
    enabled: Boolean(rootId),
    staleTime: 30_000,
  });
}

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
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}

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
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}

export function useDeleteInterface(rootId?: string) {
  const qc = useQueryClient();
  return useMutation<void, PostgrestError, string>({
    mutationFn: (id) => deleteInterface(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.interfaces(rootId) });
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}
