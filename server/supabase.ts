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

export async function getPublicSettings() {
  const { data, error } = await supabaseAdmin.from('site_settings')
    .select('*').eq('id', true).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    candidateTitle: data.candidate_title,
    mandateTitle: data.mandate_title,
    institutionalTitle: data.institutional_title,
    candidateName: data.candidate_name,
    electoralNumber: data.electoral_number,
    partyNumber: data.party_number,
    partyName: data.party_name,
    campaignSlogan: data.campaign_slogan,
    campaignCnpj: data.campaign_cnpj,
    campaignCoalition: data.campaign_coalition,
    officialElectionDate: data.official_election_date,
    gabineteAddressPoa: data.gabinete_address_poa,
    gabineteAddressCaxias: data.gabinete_address_caxias,
    gabinetePhone: data.gabinete_phone,
    gabineteWhatsapp: data.gabinete_whatsapp,
    gabineteEmail: data.gabinete_email,
    socialInstagram: data.social_instagram,
    socialFacebook: data.social_facebook,
    socialYoutube: data.social_youtube,
    socialWhatsapp: data.social_whatsapp,
    seoDefaultTitle: data.seo_default_title,
    seoDefaultDescription: data.seo_default_description,
    privacyPolicyText: data.privacy_policy_text,
  };
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
    .select('id,title,description,url,platform,category,published_at,thumbnail_url,featured,status')
    .eq('status', 'ativo')
    .order('published_at', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    url: item.url,
    platform: item.platform,
    category: item.category,
    date: item.published_at,
    thumbnail: item.thumbnail_url ?? '',
    featured: item.featured,
    status: item.status,
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
    .select('id,title,slug,summary,content,main_media_id,gallery,video_url,category,municipality,published_at,author_id,status,featured,seo_title,seo_description,social_media_id')
    .eq('status', 'publicado')
    .order('published_at', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    content: item.content,
    mainImage: item.main_media_id ?? '',
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
    videoUrl: item.video_url ?? undefined,
    category: item.category,
    municipality: item.municipality ?? undefined,
    date: item.published_at,
    author: item.author_id ?? '',
    status: item.status,
    featured: item.featured,
    seoTitle: item.seo_title ?? undefined,
    seoDescription: item.seo_description ?? undefined,
    socialImage: item.social_media_id ?? undefined,
  }));
}

export async function getPublicAgenda() {
  const { data, error } = await supabaseAdmin.from('events')
    .select('id,title,description,starts_at,ends_at,location,municipality,media_id,link,participants,visibility,status')
    .eq('status', 'publicado')
    .eq('visibility', 'publico')
    .order('starts_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((item) => {
    const start = item.starts_at ? new Date(item.starts_at) : null;
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      date: start ? start.toISOString().slice(0, 10) : '',
      time: start ? start.toISOString().slice(11, 16) : '',
      location: item.location,
      municipality: item.municipality,
      image: item.media_id ?? undefined,
      link: item.link ?? undefined,
      participants: item.participants ?? undefined,
      visibility: item.visibility,
    };
  });
}
