/* eslint-disable @typescript-eslint/ban-ts-comment */
import { supabase } from "@/shared/lib/supabase-client";
import { System, Graph } from "./system.types";
import { SystemInterface } from "@/shared/slices/interface/interface.types";

export async function fetchAllSystems(): Promise<System[]> {
  const { data, error } = await supabase
    .from("systems")
    .select("id, name, category, parent_id");
  if (error) throw error;
  return data as System[];
}

export async function fetchSystemById(id: string): Promise<System> {
  console.log("ID: ", id);
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
  if (ids.length === 0) {
    // no root, return empty list
    return [];
  }
  // join IDs without quotes to match integer columns
  const idList = ids.join(",");
  const { data, error } = await supabase
    .from<"system_interfaces", SystemInterface>("system_interfaces")
    .select("id, system_a_id, system_b_id, connection_type, directional")
    .or(`system_a_id.in.(${idList}),system_b_id.in.(${idList})`);
  if (error) throw error;
  return data!;
}

// --- Combined Graph Fetcher ---
export async function fetchGraph(rootId?: string): Promise<Graph> {
  if (!rootId) {
    const [nodes, edges] = await Promise.all([
      fetchAllSystems(),
      fetchAllInterfaces(),
    ]);
    return { nodes, edges };
  }

  // 1) Root
  const root = await fetchSystemById(rootId);

  // 2) Level 1 children
  const { data: children = [] as System[], error: childrenErr } = await supabase
    .from("systems")
    .select("id, name, category, parent_id")
    .eq("parent_id", rootId);
  if (childrenErr) throw childrenErr;

  // 3) Level 2 grandchildren
  const childIds = children?.map((c) => c.id);
  let grandchildren: System[] = [];
  if (childIds?.length) {
    const { data: grandData = [], error: grandErr } = await supabase
      .from("systems")
      .select("id, name, category, parent_id")
      .in("parent_id", childIds);
    if (grandErr) throw grandErr;
    grandchildren = grandData as System[];
  }

  // 4) Combine and fetch interfaces for those IDs
  const nodes = [root, ...(children || []), ...grandchildren];
  const ids = nodes.map((n) => n.id);
  const edges = await fetchInterfacesBySystemIds(ids);

  return { nodes, edges };
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
  updates: Partial<Pick<System, "name" | "category" | "parent_id">>
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
  const { error } = await supabase.from("systems").delete().eq("id", id);
  if (error) throw error;
}

export async function createSystemAndInterface(
  name: string,
  category: string,
  parentId: string
): Promise<{ system: System; iface: SystemInterface }> {
  console.log("Creating system and interface");
  const { data: system, error: err1 } = await supabase
    .from("systems")
    .insert({ name, category, parent_id: parentId })
    .select("id, name, category, parent_id")
    .single();
  if (err1) throw err1;

  const { data: iface, error: err2 } = await supabase
    .from("system_interfaces")
    .insert({
      system_a_id: parentId,

      system_b_id: system.id,
      connection_type: "hierarchy",
      directional: false,
    })
    .single();
  if (err2) throw err2;

  return { system, iface };
}
