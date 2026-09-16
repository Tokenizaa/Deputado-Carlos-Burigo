import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) throw new Error('SUPABASE_URL não configurada.');
if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada no servidor.');

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getPublishedLegislativeCodes() {
  const { data, error } = await supabaseAdmin.from('legislative_items')
    .select('type,number,year,status,verification_status')
    .eq('status', 'PUBLISHED')
    .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE']);
  if (error) throw error;
  return new Set((data ?? []).map((item) => `${item.type} ${item.number}/${item.year}`));
}

export async function getPublicProjects() {
  const publishedCodes = await getPublishedLegislativeCodes();
  const { data, error } = await supabaseAdmin.from('projects')
    .select('id,code,title,summary,detailed_description,theme,status,link_alrs,year,impacts')
    .order('year', { ascending: false }).order('code', { ascending: true });
  if (error) throw error;
  return (data ?? []).filter((item) => publishedCodes.has(item.code)).map((item) => ({
    id: item.id, code: item.code, title: item.title, summary: item.summary,
    detailedDescription: item.detailed_description, theme: item.theme, status: item.status,
    linkAlrs: item.link_alrs, year: item.year, impacts: Array.isArray(item.impacts) ? item.impacts : [],
  }));
}

export async function getPublicResults() {
  const publishedCodes = await getPublishedLegislativeCodes();
  const { data, error } = await supabaseAdmin.from('results')
    .select('id,title,category,description,metrics,municipality,result_date')
    .order('result_date', { ascending: false });
  if (error) throw error;
  return (data ?? []).filter((item) => {
    const match = item.title?.match(/(PL|PLC)\s+\d+\/\d{4}/i);
    return match ? publishedCodes.has(match[0].toUpperCase()) : false;
  }).map((item) => ({
    id: item.id, title: item.title, category: item.category, description: item.description,
    metrics: item.metrics, municipality: item.municipality, date: item.result_date,
  }));
}

export async function getPublicMunicipalities() {
  const { data, error } = await supabaseAdmin.from('municipalities')
    .select('id,name,region,population,key_deliveries').order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id, name: item.name, region: item.region, population: item.population,
    keyDeliveries: Array.isArray(item.key_deliveries) ? item.key_deliveries : [],
  }));
}

export async function getPublicVideos() {
  const { data, error } = await supabaseAdmin.from('videos')
    .select('id,name,title,description,category,url,thumbnail_url,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id, name: item.name, title: item.title, description: item.description,
    category: item.category, url: item.url, thumbnailUrl: item.thumbnail_url ?? null,
    createdAt: item.created_at,
  }));
}

export async function getPublicMedia() {
  const { data, error } = await supabaseAdmin.from('media')
    .select('id,name,title,alt_text,description,credit,category,storage_path,url,mime_type,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id, name: item.name, title: item.title, altText: item.alt_text,
    description: item.description, credit: item.credit, category: item.category,
    storagePath: item.storage_path, url: item.url, mimeType: item.mime_type,
    createdAt: item.created_at,
  }));
}

export async function getPublicNews() {
  const { data, error } = await supabaseAdmin.from('news')
    .select('*').eq('status', 'published').order('published_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPublicAgenda() {
  const { data, error } = await supabaseAdmin.from('events')
    .select('*').eq('status', 'published').order('start_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}
