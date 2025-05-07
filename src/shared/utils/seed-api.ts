// lib/seed.ts
// ES module version of your CLI seed logic, exportable for use in API routes
import { SupabaseClient } from "@supabase/supabase-js";

type SystemDef = {
  key: string;
  name: string;
  category: string;
  parentKey: string | null;
};
type InterfaceDef = {
  a: string;
  b: string;
  directional: boolean;
  connection_type: string;
};

export async function seedDatabase(supabase: SupabaseClient) {


  const systemDefs: SystemDef[] = [
    {
      key: "prod",
      name: "Production",
      category: "environment",
      parentKey: null,
    },
    {
      key: "infra",
      name: "Infrastructure",
      category: "group",
      parentKey: "prod",
    },
    { key: "services", name: "Services", category: "group", parentKey: "prod" },
    {
      key: "db",
      name: "Database Cluster",
      category: "database",
      parentKey: "infra",
    },
    {
      key: "cache",
      name: "Cache Cluster",
      category: "cache",
      parentKey: "infra",
    },
    {
      key: "webapp",
      name: "Web App",
      category: "frontend",
      parentKey: "services",
    },
    {
      key: "api",
      name: "API Service",
      category: "service",
      parentKey: "services",
    },
  ];

  const ifaceDefs: InterfaceDef[] = [
    { a: "prod", b: "infra", directional: false, connection_type: "hosts" },
    { a: "prod", b: "services", directional: false, connection_type: "hosts" },

    { a: "infra", b: "db", directional: false, connection_type: "provisions" },
    {
      a: "infra",
      b: "cache",
      directional: false,
      connection_type: "provisions",
    },

    {
      a: "services",
      b: "api",
      directional: false,
      connection_type: "contains",
    },
    {
      a: "services",
      b: "webapp",
      directional: false,
      connection_type: "contains",
    },

    { a: "webapp", b: "api", directional: true, connection_type: "REST" },
    { a: "api", b: "db", directional: true, connection_type: "PostgreSQL" },
    { a: "api", b: "cache", directional: true, connection_type: "Memcached" },
  ];



  // Insert systems, track their IDs
  const idMap: Record<string, string> = {};
  for (const def of systemDefs) {
    const { data, error } = await supabase
      .from("systems")
      .insert({
        name: def.name,
        category: def.category,
        parent_id: def.parentKey ? idMap[def.parentKey] : null,
      })
      .select("id")
      .single();
    if (error || !data)
      throw error || new Error("Missing data on system insert");
    idMap[def.key] = data.id;
  }

  // Insert interfaces
  for (const def of ifaceDefs) {
    const { error } = await supabase.from("system_interfaces").insert({
      system_a_id: idMap[def.a],
      system_b_id: idMap[def.b],
      connection_type: def.connection_type,
      directional: def.directional,
    });
    if (error) throw error;
  }
}
