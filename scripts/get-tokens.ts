import { createClient } from '@supabase/supabase-js';

const url = 'https://wktanxbpijurimdjgone.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGFueGJwaWp1cmltZGpnb25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUwNTU3OCwiZXhwIjoyMTA1MDgxNTc4fQ.M7QA4vFdwhxSn1LSqlLV-SDw0XUvv8ZXxw07cn1cy0o';

const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const users = [
    { email: 'admin@test.carlosburigo.rs.gov.br', password: 'TestAdmin123!', role: 'ADMIN' },
    { email: 'editor@test.carlosburigo.rs.gov.br', password: 'TestEditor123!', role: 'EDITOR' },
    { email: 'comunicacao@test.carlosburigo.rs.gov.br', password: 'TestComunicacao123!', role: 'COMUNICACAO' },
  ];

  const tokens = [];

  for (const user of users) {
    const { data, error } = await client.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    if (error) throw error;
    
    const { data: profile } = await client.from('profiles').select('id, name, cargo').eq('id', data.user.id).single();
    const { data: roleData } = await client.from('user_roles').select('role').eq('user_id', data.user.id).single();
    
    tokens.push({
      role: user.role,
      email: user.email,
      userId: data.user.id,
      accessToken: data.session.access_token,
      name: profile?.name,
      cargo: profile?.cargo,
      dbRole: roleData?.role,
    });
    
    console.log(`${user.role}: ${data.session.access_token.slice(0, 40)}...`);
  }

  const fs = await import('fs');
  fs.writeFileSync('test-tokens.json', JSON.stringify(tokens, null, 2));
  console.log('\nTokens saved to test-tokens.json');
}

main().catch(console.error);