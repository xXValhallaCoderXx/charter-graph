import { supabase } from "@/shared/lib/supabase-client";
import { SystemInterface } from "./interface.types";

type NewInterface = Omit<SystemInterface, "id">;

export async function fetchAllInterfaces(): Promise<SystemInterface[]> {
  const { data, error } = await supabase
    .from<"system_interfaces", SystemInterface>("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional");
  if (error) throw error;
  return data!;
}

export async function fetchInterfaceById(id: string): Promise<SystemInterface> {
  const { data, error } = await supabase
    .from("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as SystemInterface;
}

export async function fetchInterfacesBySystemIds(
  ids: string[]
): Promise<SystemInterface[]> {
  if (ids.length === 0) {
    return [];
  }

  // Convert the string IDs to numbers and join them into a comma list
  const idList = ids.map((i) => Number(i)).join(",");

  const { data, error } = await supabase
    .from<"system_interfaces", SystemInterface>("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .or(`system_a_id.in.(${idList}),system_b_id.in.(${idList})`);

  if (error) throw error;
  return data!;
}

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


export async function deleteInterface(id: string): Promise<void> {
  const { error } = await supabase
    .from("system_interfaces")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
