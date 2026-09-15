import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) throw new Error('SUPABASE_URL não configurada.');
if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada no servidor.');

// Server-only client. The service-role key MUST never be exposed to the browser.
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
