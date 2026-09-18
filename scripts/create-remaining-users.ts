import { createClient } from '@supabase/supabase-js';

const url = 'https://wktanxbpijurimdjgone.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGFueGJwaWp1cmltZGpnb25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUwNTU3OCwiZXhwIjoyMTA1MDgxNTc4fQ.M7QA4vFdwhxSn1LSqlLV-SDw0XUvv8ZXxw07cn1cy0o';

const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const users = [
    {
      email: 'editor@test.carlosburigo.rs.gov.br',
      password: 'TestEditor123!',
      name: 'Editor Test User',
      cargo: 'Editor de Conteúdo',
      role: 'EDITOR',
    },
    {
      email: 'comunicacao@test.carlosburigo.rs.gov.br',
      password: 'TestComunicacao123!',
      name: 'Comunicação Test User',
      cargo: 'Assessoria de Comunicação',
      role: 'COMUNICACAO',
    },
  ];

  for (const user of users) {
    try {
      console.log(`Creating ${user.role}: ${user.email}`);
      
      // Create auth user
      const { data: authData, error: authError } = await client.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name },
      });
      if (authError) throw authError;
      console.log(`  Auth user: ${authData.user.id}`);

      // Create profile
      const { error: profileError } = await client.from('profiles').upsert({
        id: authData.user.id,
        name: user.name,
        cargo: user.cargo,
        avatar_url: null,
      });
      if (profileError) throw profileError;
      console.log(`  Profile: OK`);

      // Assign role
      const { error: roleError } = await client.from('user_roles').upsert({
        user_id: authData.user.id,
        role: user.role,
      });
      if (roleError) throw roleError;
      console.log(`  Role: OK`);

      // Sign in to get token
      const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });
      if (signInError) throw signInError;
      console.log(`  Token: ${signInData.session?.access_token?.slice(0, 20)}...`);
      console.log('');
    } catch (error) {
      console.error(`  Failed:`, error);
    }
  }

  // Verify all
  const { data: allUsers } = await client.from('profiles').select(`
    id, name, cargo, user_roles ( role )
  `);
  console.log('All users:');
  for (const u of allUsers ?? []) {
    const role = (u as any).user_roles?.[0]?.role || 'N/A';
    console.log(`  - ${u.name} (${u.cargo}) - ${role} - ${u.id}`);
  }
}

main();