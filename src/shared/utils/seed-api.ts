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
  await supabase.from("system_interfaces").delete().neq("id", "");
  await supabase.from("systems").delete().neq("id", "");

  const systemDefs: SystemDef[] = [
    {
      key: "production",
      name: "Production Environment",
      category: "environment",
      parentKey: null,
    },
    {
      key: "serviceGroup",
      name: "Service Layer",
      category: "group",
      parentKey: "production",
    },
    {
      key: "infraGroup",
      name: "Infrastructure Layer",
      category: "group",
      parentKey: "production",
    },
    {
      key: "frontendGroup",
      name: "Frontend Layer",
      category: "group",
      parentKey: "production",
    },
    {
      key: "authService",
      name: "Authentication Service",
      category: "service",
      parentKey: "serviceGroup",
    },
    {
      key: "userService",
      name: "User Service",
      category: "service",
      parentKey: "serviceGroup",
    },
    {
      key: "analyticsService",
      name: "Analytics Service",
      category: "service",
      parentKey: "serviceGroup",
    },
    {
      key: "dbCluster",
      name: "Database Cluster",
      category: "database",
      parentKey: "infraGroup",
    },
    {
      key: "cacheCluster",
      name: "Cache Cluster",
      category: "cache",
      parentKey: "infraGroup",
    },
    {
      key: "messageQueue",
      name: "Message Queue",
      category: "queue",
      parentKey: "infraGroup",
    },
    {
      key: "webApp",
      name: "Web Application",
      category: "frontend",
      parentKey: "frontendGroup",
    },
    {
      key: "adminPortal",
      name: "Admin Portal",
      category: "frontend",
      parentKey: "frontendGroup",
    },
  ];

  const ifaceDefs: InterfaceDef[] = [
    {
      a: "production",
      b: "serviceGroup",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "production",
      b: "infraGroup",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "production",
      b: "frontendGroup",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "serviceGroup",
      b: "authService",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "serviceGroup",
      b: "userService",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "serviceGroup",
      b: "analyticsService",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "infraGroup",
      b: "dbCluster",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "infraGroup",
      b: "cacheCluster",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "infraGroup",
      b: "messageQueue",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "frontendGroup",
      b: "webApp",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "frontendGroup",
      b: "adminPortal",
      directional: false,
      connection_type: "dependency",
    },
    {
      a: "webApp",
      b: "authService",
      directional: true,
      connection_type: "REST",
    },
    {
      a: "webApp",
      b: "userService",
      directional: true,
      connection_type: "gRPC",
    },
    {
      a: "authService",
      b: "dbCluster",
      directional: true,
      connection_type: "PostgreSQL",
    },
    {
      a: "userService",
      b: "messageQueue",
      directional: true,
      connection_type: "RabbitMQ",
    },
    {
      a: "analyticsService",
      b: "dbCluster",
      directional: true,
      connection_type: "ETL",
    },
    {
      a: "adminPortal",
      b: "authService",
      directional: true,
      connection_type: "GraphQL",
    },
  ];

  // Clear existing data
  await supabase.from("system_interfaces").delete().neq("id", "");
  await supabase.from("systems").delete().neq("id", "");

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
