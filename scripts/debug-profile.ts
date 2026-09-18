import { createClient } from '@supabase/supabase-js';

const url = 'https://wktanxbpijurimdjgone.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGFueGJwaWp1cmltZGpnb25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUwNTU3OCwiZXhwIjoyMTA1MDgxNTc4fQ.M7QA4vFdwhxSn1LSqlLV-SDw0XUvv8ZXxw07cn1cy0o';

const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function test() {
  // Test creating a profile directly
  const testId = '98f89853-5ad3-41eb-b450-7417f9c805d7'; // The editor user ID from earlier
  const { data, error } = await client.from('profiles').upsert({
    id: testId,
    name: 'Editor Test User',
    cargo: 'Editor de Conteúdo',
    avatar_url: null,
  });
  console.log('Profile upsert:', data, error);
  
  // Test user_roles
  const { data: roleData, error: roleError } = await client.from('user_roles').upsert({
    user_id: testId,
    role: 'EDITOR',
  });
  console.log('Role upsert:', roleData, roleError);
}

test();