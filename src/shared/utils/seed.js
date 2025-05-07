/* eslint-disable @typescript-eslint/no-require-imports */


require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {

  const systemDefs = [
    { key: "prod", name: "Production", category: "environment", parentKey: null },
    { key: "frontend", name: "Web Frontend", category: "service", parentKey: "prod" },
    { key: "api", name: "API Service", category: "service", parentKey: "prod" },
    { key: "s3", name: "Amazon S3 Storage", category: "aws", parentKey: "prod" },
    { key: "ddb", name: "DynamoDB Table", category: "aws", parentKey: "prod" },

    // children of API Service (second tier)
    { key: "auth", name: "Auth Service", category: "service", parentKey: "api" },
    { key: "imgProc", name: "Image Processor", category: "service", parentKey: "api" },

    // grandchild under Auth Service (third tier)
    { key: "oauth", name: "OAuth Provider", category: "external", parentKey: "auth" },
  ];


  const ifaceDefs = [

    // hierarchy / hosts
    { a: "prod", b: "frontend", directional: false, connection_type: "hosts" },
    { a: "prod", b: "api", directional: false, connection_type: "hosts" },
    { a: "prod", b: "s3", directional: false, connection_type: "hosts" },
    { a: "prod", b: "ddb", directional: false, connection_type: "hosts" },

    // actual flows
    { a: "frontend", b: "api", directional: true, connection_type: "REST" },
    { a: "api", b: "s3", directional: true, connection_type: "S3 SDK" },
    { a: "api", b: "ddb", directional: true, connection_type: "DynamoDB" },

    // second tier under API
    { a: "api", b: "auth", directional: true, connection_type: "RPC" },
    { a: "api", b: "imgProc", directional: true, connection_type: "gRPC" },

    // third tier under Auth
    { a: "auth", b: "oauth", directional: true, connection_type: "OAuth2" },
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
