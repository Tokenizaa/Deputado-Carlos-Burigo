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

async function getPublishedLegislativeCodes() {
  const { data, error } = await supabaseAdmin
    .from('legislative_items')
    .select('number,year,status,verification_status')
    .eq('status', 'PUBLISHED')
    .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE']);
  if (error) throw error;
  return new Set((data ?? []).map((item) => `${item.number}/${item.year}`));
}

export async function getPublicProjects() {
  const publishedCodes = await getPublishedLegislativeCodes();
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('id,code,title,summary,detailed_description,theme,status,link_alrs,year,impacts')
    .order('year', { ascending: false })
    .order('code', { ascending: true });
  if (error) throw error;

  return (data ?? [])
    .filter((item) => publishedCodes.has(item.code))
    .map((item) => ({
      id: item.id,
      code: item.code,
      title: item.title,
      summary: item.summary,
      detailedDescription: item.detailed_description,
      theme: item.theme,
      status: item.status,
      linkAlrs: item.link_alrs,
      year: item.year,
      impacts: Array.isArray(item.impacts) ? item.impacts : [],
    }));
}

export async function getPublicResults() {
  const publishedCodes = await getPublishedLegislativeCodes();
  const { data, error } = await supabaseAdmin
    .from('results')
    .select('id,title,category,description,metrics,municipality,result_date')
    .order('result_date', { ascending: false });
  if (error) throw error;

  return (data ?? []).filter((item) => {
    const match = item.title?.match(/(PL|PLC)\s+\d+\/\d{4}/i);
    return match ? publishedCodes.has(match[0].toUpperCase()) : false;
  }).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    metrics: item.metrics,
    municipality: item.municipality,
    date: item.result_date,
  }));
}
