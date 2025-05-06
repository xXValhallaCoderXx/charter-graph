/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // Define systems in a real-world infra hierarchy (ordered)
  const systemDefs = [
    { key: 'production', name: 'Production Environment', category: 'environment', parentKey: null },
    { key: 'serviceGroup', name: 'Service Layer', category: 'group', parentKey: 'production' },
    { key: 'infraGroup', name: 'Infrastructure Layer', category: 'group', parentKey: 'production' },
    { key: 'frontendGroup', name: 'Frontend Layer', category: 'group', parentKey: 'production' },
    { key: 'authService', name: 'Authentication Service', category: 'service', parentKey: 'serviceGroup' },
    { key: 'userService', name: 'User Service', category: 'service', parentKey: 'serviceGroup' },
    { key: 'analyticsService', name: 'Analytics Service', category: 'service', parentKey: 'serviceGroup' },
    { key: 'dbCluster', name: 'Database Cluster', category: 'database', parentKey: 'infraGroup' },
    { key: 'cacheCluster', name: 'Cache Cluster', category: 'cache', parentKey: 'infraGroup' },
    { key: 'messageQueue', name: 'Message Queue', category: 'queue', parentKey: 'infraGroup' },
    { key: 'webApp', name: 'Web Application', category: 'frontend', parentKey: 'frontendGroup' },
    { key: 'adminPortal', name: 'Admin Portal', category: 'frontend', parentKey: 'frontendGroup' },
  ];

  // Define interfaces between systems
  const ifaceDefs = [
    // Undirected dependencies at top level
    { a: 'production', b: 'serviceGroup', directional: false, connection_type: 'dependency' },
    { a: 'production', b: 'infraGroup', directional: false, connection_type: 'dependency' },
    { a: 'production', b: 'frontendGroup', directional: false, connection_type: 'dependency' },
    // Service Layer internal
    { a: 'serviceGroup', b: 'authService', directional: false, connection_type: 'dependency' },
    { a: 'serviceGroup', b: 'userService', directional: false, connection_type: 'dependency' },
    { a: 'serviceGroup', b: 'analyticsService', directional: false, connection_type: 'dependency' },
    // Infra Layer internal
    { a: 'infraGroup', b: 'dbCluster', directional: false, connection_type: 'dependency' },
    { a: 'infraGroup', b: 'cacheCluster', directional: false, connection_type: 'dependency' },
    { a: 'infraGroup', b: 'messageQueue', directional: false, connection_type: 'dependency' },
    // Frontend Layer internal
    { a: 'frontendGroup', b: 'webApp', directional: false, connection_type: 'dependency' },
    { a: 'frontendGroup', b: 'adminPortal', directional: false, connection_type: 'dependency' },
    // Directed data/API flows
    { a: 'webApp', b: 'authService', directional: true, connection_type: 'REST' },
    { a: 'webApp', b: 'userService', directional: true, connection_type: 'gRPC' },
    { a: 'authService', b: 'dbCluster', directional: true, connection_type: 'PostgreSQL' },
    { a: 'userService', b: 'messageQueue', directional: true, connection_type: 'RabbitMQ' },
    { a: 'analyticsService', b: 'dbCluster', directional: true, connection_type: 'ETL' },
    { a: 'adminPortal', b: 'authService', directional: true, connection_type: 'GraphQL' },
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
