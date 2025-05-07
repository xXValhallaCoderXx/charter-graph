/* eslint-disable @typescript-eslint/no-require-imports */


require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {

  const systemDefs = [
    { key: "prod", name: "Production", category: "environment", parentKey: null },
    { key: "infra", name: "Infrastructure", category: "group", parentKey: "prod" },
    { key: "services", name: "Services", category: "group", parentKey: "prod" },
    { key: "db", name: "Database Cluster", category: "database", parentKey: "infra" },
    { key: "cache", name: "Cache Cluster", category: "cache", parentKey: "infra" },
    { key: "webapp", name: "Web App", category: "frontend", parentKey: "services" },
    { key: "api", name: "API Service", category: "service", parentKey: "services" },
  ];


  const ifaceDefs = [

    { a: "prod", b: "infra", directional: false, connection_type: "hosts" },
    { a: "prod", b: "services", directional: false, connection_type: "hosts" },


    { a: "infra", b: "db", directional: false, connection_type: "provisions" },
    { a: "infra", b: "cache", directional: false, connection_type: "provisions" },


    { a: "services", b: "api", directional: false, connection_type: "contains" },
    { a: "services", b: "webapp", directional: false, connection_type: "contains" },


    { a: "webapp", b: "api", directional: true, connection_type: "REST" },
    { a: "api", b: "db", directional: true, connection_type: "PostgreSQL" },
    { a: "api", b: "cache", directional: true, connection_type: "Memcached" },
  ];

  console.log('▶️ Clearing existing data...');
  await supabase.from('system_interfaces').delete().neq('id', '');
  await supabase.from('systems').delete().neq('id', '');

  console.log('🌱 Seeding systems...');
  const idMap = {};
  for (const def of systemDefs) {
    const { data, error } = await supabase
      .from('systems')
      .insert({
        name: def.name,
        category: def.category,
        parent_id: def.parentKey ? idMap[def.parentKey] : null,
      })
      .select('id')
      .single();
    if (error) {
      console.error(`❌ Error inserting system ${def.key}:`, error);
      process.exit(1);
    }
    idMap[def.key] = data.id;
  }

  console.log('🌱 Seeding interfaces...');
  for (const def of ifaceDefs) {
    const { error } = await supabase
      .from('system_interfaces')
      .insert({
        system_a_id: idMap[def.a],
        system_b_id: idMap[def.b],
        connection_type: def.connection_type,
        directional: def.directional,
      });
    if (error) {
      console.error(`❌ Error inserting interface ${def.a}→${def.b}:`, error);
      process.exit(1);
    }
  }

  console.log('✅ Seeding complete');
}

seed().catch((err) => console.error('Seed failed:', err));
