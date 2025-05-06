import { supabase } from "@/shared/lib/supabase-client";
import { System, SystemInterface, Graph } from "./system.types";

export async function fetchAllSystems(): Promise<System[]> {
  const { data, error } = await supabase
    .from("systems")
    .select("id, name, category, parent_id");
  if (error) throw error;
  return data as System[];
}

export async function fetchSystemById(id: string): Promise<System> {
  const { data, error } = await supabase
    .from("systems")
    .select("id, name, category, parent_id")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as System;
}

export async function fetchDescendants(rootId: string): Promise<System[]> {
  const descendants: System[] = [];
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    const parentId = queue.shift()!;
    const { data, error } = await supabase
      .from("systems")
      .select("id, name, category, parent_id")
      .eq("parent_id", parentId);
    if (error) throw error;
    const children = data as System[];
    for (const child of children) {
      descendants.push(child);
      queue.push(child.id);
    }
  }

  return descendants;
}

// --- Fetchers for Interfaces ---
export async function fetchAllInterfaces(): Promise<SystemInterface[]> {
  const { data, error } = await supabase
    .from("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional");
  if (error) throw error;
  return data as SystemInterface[];
}

export async function fetchInterfacesBySystemIds(
  ids: string[]
): Promise<SystemInterface[]> {
  const idList = ids.map((i) => `'${i}'`).join(",");
  const { data, error } = await supabase
    .from("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .or(`system_a_id.in.(${idList}),system_b_id.in.(${idList})`);
  if (error) throw error;
  return data as SystemInterface[];
}

// --- Combined Graph Fetcher ---
export async function fetchGraph(rootId?: string): Promise<Graph> {
  if (rootId) {
    const root = await fetchSystemById(rootId);
    const descendants = await fetchDescendants(rootId);
    const nodes = [root, ...descendants];
    const ids = nodes.map((n) => n.id);
    const edges = await fetchInterfacesBySystemIds(ids);
    return { nodes, edges };
  } else {
    const [nodes, edges] = await Promise.all([
      fetchAllSystems(),
      fetchAllInterfaces(),
    ]);
    return { nodes, edges };
  }
}

// --- Mutators for Systems ---
export async function createSystem(
  name: string,
  category: string,
  parentId?: string
): Promise<System> {
  const { data, error } = await supabase
    .from("systems")
    .insert({ name, category, parent_id: parentId ?? null })
    .single();
  if (error) throw error;
  return data as System;
}

export async function updateSystem(
  id: string,
  updates: Partial<Pick<System, 'name' | 'category' | 'parent_id'>>
): Promise<System> {
  const { data, error } = await supabase
    .from("systems")
    .update(updates)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as System;
}

export async function deleteSystem(id: string): Promise<void> {
  const { error } = await supabase
    .from("systems")
    .delete()
    .eq("id", id);
  if (error) throw error;
}