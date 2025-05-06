/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchGraph } from "../slices/system/system.service";
import type { PostgrestError } from "@supabase/supabase-js";

export function useGraph(): UseQueryResult<any, PostgrestError> {
  return useQuery({
    queryKey: ["graph"],
    queryFn: fetchGraph,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
