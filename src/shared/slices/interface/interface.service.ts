import { supabase } from "@/shared/lib/supabase-client";
import { SystemInterface } from "./interface.types";

// Type for creating a new interface (no `id` yet)
type NewInterface = Omit<SystemInterface, "id">;

/**
 * Fetch all interfaces (all edges in the graph)
 */
export async function fetchAllInterfaces(): Promise<SystemInterface[]> {
  const { data, error } = await supabase
    .from<"system_interfaces", SystemInterface>("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional");
  if (error) throw error;
  return data!;
}

/**
 * Fetch a single interface by its ID
 */
export async function fetchInterfaceById(id: string): Promise<SystemInterface> {
  const { data, error } = await supabase
    .from("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as SystemInterface;
}
/**
 * Fetch interfaces where either endpoint is in the given list of system IDs
 */
export async function fetchInterfacesBySystemIds(
  ids: string[]
): Promise<SystemInterface[]> {
  // If there’s no rootId (or no ids), don’t hit the API at all
  if (ids.length === 0) {
    return [];
  }

  // Convert the string IDs to numbers and join them into a comma list
  const idList = ids.map((i) => Number(i)).join(",");

  // Now filter by integer IN (…) with no quotes
  const { data, error } = await supabase
    .from<"system_interfaces", SystemInterface>("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .or(`system_a_id.in.(${idList}),system_b_id.in.(${idList})`);

  if (error) throw error;
  return data!;
}

/**
 * Create a new interface
 */
export async function createInterface(
  payload: NewInterface
): Promise<SystemInterface> {
  const { data, error } = await supabase
    .from("system_interfaces")
    .insert(payload)
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .single();
  if (error) throw error;
  return data as SystemInterface;
}

/**
 * Update an existing interface
 */
export async function updateInterface(
  id: string,
  updates: Partial<Omit<SystemInterface, "id">>
): Promise<SystemInterface> {
  const { data, error } = await supabase
    .from("system_interfaces")
    .update(updates)
    .eq("id", id)
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .single();
  if (error) throw error;
  return data as SystemInterface;
}

/**
 * Delete an interface by ID
 */
export async function deleteInterface(id: string): Promise<void> {
  const { error } = await supabase
    .from("system_interfaces")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
