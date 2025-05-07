import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import {
  fetchSystemById,
  updateSystem,
  deleteSystem,
  fetchDescendants,
  createSystemAndInterface,
} from "@/shared/slices/system/system.service";
import type { System } from "@/shared/slices/system/system.types";
import { SystemInterface } from "@/shared/slices/interface/interface.types";
import { QUERY_KEYS } from "@/shared/slices/query-keys";

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

export function useUpdateSystem(id: string) {
  const qc = useQueryClient();
  return useMutation<
    System,
    PostgrestError,
    Partial<Pick<System, "name" | "category">>
  >({
    mutationFn: (patch) => updateSystem(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.system(id) });
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}

// Create a new child under a given parent system
export function useCreateChildSystem(parentId: string) {
  const qc = useQueryClient();

  return useMutation<
    { system: System; iface: SystemInterface }, // TData
    PostgrestError, // TError
    string // TVariables
  >({
    mutationFn: (name) => createSystemAndInterface(name, "service", parentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.descendants(parentId) });
       qc.invalidateQueries({ queryKey: QUERY_KEYS.interfaces(parentId) });
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}

export function useRemoveChildSystem(parentId: string) {
  const qc = useQueryClient();
  return useMutation<void, PostgrestError, string>({
    mutationFn: (childId) => deleteSystem(childId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.descendants(parentId) });
             qc.invalidateQueries({
               queryKey: QUERY_KEYS.interfaces(parentId),
             });
      qc.invalidateQueries({ queryKey: ["graph-data"], exact: false });
    },
  });
}
