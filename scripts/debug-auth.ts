import { createClient } from '@supabase/supabase-js';

const url = 'https://wktanxbpijurimdjgone.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGFueGJwaWp1cmltZGpnb25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTUwNTU3OCwiZXhwIjoyMTA1MDgxNTc4fQ.M7QA4vFdwhxSn1LSqlLV-SDw0XUvv8ZXxw07cn1cy0o';

const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await client.auth.admin.listUsers();
console.log('Users:', data?.users?.length, error);

const { data: profiles, error: pErr } = await client.from('profiles').select('*').limit(5);
console.log('Profiles:', profiles, pErr);