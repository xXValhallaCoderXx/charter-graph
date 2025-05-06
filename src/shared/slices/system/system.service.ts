import { supabase } from "@/shared/lib/supabase-client";
import { System, SystemInterface, Graph } from "./system.types";

// fetch just the systems (nodes)
export async function fetchAllSystems(): Promise<System[]> {
  const { data, error } = await supabase
    .from<"systems", System>("systems")
    .select("id, name, category, parent_id");
  if (error) throw error;
  return data!;
}

// fetch just the interfaces (edges)
export async function fetchAllInterfaces(): Promise<SystemInterface[]> {
  const { data, error } = await supabase
    .from<"system_interfaces", SystemInterface>("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional");
  if (error) throw error;
  return data!;
}

// combine them into a single “graph” payload
export async function fetchGraph(): Promise<Graph> {
  const [nodes, edges] = await Promise.all([
    fetchAllSystems(),
    fetchAllInterfaces(),
  ]);
  return { nodes, edges };
}
