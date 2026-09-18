import { createClient } from '@supabase/supabase-js';

const url = 'https://wktanxbpijurimdjgone.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGFueGJwaWp1cmltZGpnb25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUwNTU3OCwiZXhwIjoyMTA1MDgxNTc4fQ.M7QA4vFdwhxSn1LSqlLV-SDw0XUvv8ZXxw07cn1cy0o';

const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  // Get all auth users
  const { data: { users } } = await client.auth.admin.listUsers();
  console.log('Auth users:', users.map(u => ({ id: u.id, email: u.email })));

  // Define our test users by email
  const testUsers = [
    { email: 'admin@test.carlosburigo.rs.gov.br', role: 'ADMIN', name: 'Admin Test User', cargo: 'Administrador do Sistema' },
    { email: 'editor@test.carlosburigo.rs.gov.br', role: 'EDITOR', name: 'Editor Test User', cargo: 'Editor de Conteúdo' },
    { email: 'comunicacao@test.carlosburigo.rs.gov.br', role: 'COMUNICACAO', name: 'Comunicação Test User', cargo: 'Assessoria de Comunicação' },
  ];

  for (const testUser of testUsers) {
    const authUser = users.find(u => u.email === testUser.email);
    if (!authUser) {
      console.log(`User ${testUser.email} not found in auth`);
      continue;
    }

    console.log(`\nProcessing ${testUser.role}: ${authUser.id}`);

    // Create/update profile
    const { error: profileError } = await client.from('profiles').upsert({
      id: authUser.id,
      name: testUser.name,
      cargo: testUser.cargo,
      avatar_url: null,
    });
    if (profileError) throw profileError;
    console.log(`  Profile: OK`);

    // Assign role
    const { error: roleError } = await client.from('user_roles').upsert({
      user_id: authUser.id,
      role: testUser.role,
    });
    if (roleError) throw roleError;
    console.log(`  Role: OK`);

    // Sign in to get token
    const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.email.includes('admin') ? 'TestAdmin123!' : 
               testUser.email.includes('editor') ? 'TestEditor123!' : 'TestComunicacao123!',
    });
    if (signInError) throw signInError;
    const token = signInData.session?.access_token;
    console.log(`  Token: ${token?.slice(0, 30)}...`);
    
    // Save token
    const fs = await import('fs');
    const tokensFile = 'test-tokens.json';
    let existingTokens = [];
    try {
      existingTokens = JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));
    } catch {}
    
    existingTokens.push({
      role: testUser.role,
      email: testUser.email,
      userId: authUser.id,
      accessToken: token,
    });
    fs.writeFileSync(tokensFile, JSON.stringify(existingTokens, null, 2));
  }

  // Verify all
  const { data: allUsers } = await client.from('profiles').select(`
    id, name, cargo, user_roles ( role )
  `);
  console.log('\nAll users:');
  for (const u of allUsers ?? []) {
    const role = (u as any).user_roles?.[0]?.role || 'N/A';
    console.log(`  - ${u.name} (${u.cargo}) - ${role} - ${u.id}`);
  }
}

main().catch(console.error);