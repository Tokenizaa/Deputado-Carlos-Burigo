import { createClient } from '@supabase/supabase-js';

const url = 'https://wktanxbpijurimdjgone.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGFueGJwaWp1cmltZGpnb25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUwNTU3OCwiZXhwIjoyMTA1MDgxNTc4fQ.M7QA4vFdwhxSn1LSqlLV-SDw0XUvv8ZXxw07cn1cy0o';

const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const editorId = '98f89853-5ad3-41eb-b450-7417f9c805d7';
  
  // Check if profile exists
  const { data: existingProfile } = await client.from('profiles').select('*').eq('id', editorId).single();
  console.log('Existing profile:', existingProfile);

  // Try INSERT instead of upsert
  const { data: insertData, error: insertError } = await client.from('profiles').insert({
    id: editorId,
    name: 'Editor Test User',
    cargo: 'Editor de Conteúdo',
    avatar_url: null,
  });
  console.log('Insert profile:', insertData, insertError);

  // Try role
  const { data: roleData, error: roleError } = await client.from('user_roles').insert({
    user_id: editorId,
    role: 'EDITOR',
  });
  console.log('Insert role:', roleData, roleError);
}

main().catch(console.error);