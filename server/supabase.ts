import { createClient } from '@supabase/supabase-js';
import {
  normalizeLegislativeCode,
  toPublicLegislativeItemDto,
  toPublicLegislativeVoteDto,
  toPublicProjectDto,
  toPublicResultDto,
} from './mappers/publicLegislative';
import type { LegislativeItemRow } from './mappers/publicLegislative';
import type { PublicLegislativeItemDto, PublicLegislativeVoteDto } from '../src/contracts/publicLegislative';
import { extractLegislativeCode } from '../src/contracts/publicLegislative';

// Public read-only adapter: RLS exposes only the institutional/public rows needed here.
const url = process.env.SUPABASE_URL ?? 'https://wktanxbpijurimdjgone.supabase.co';
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
  ?? process.env.SUPABASE_ANON_KEY
  ?? 'sb_publishable_HsuRNZejK8aMxqOxDGK60g_WnabIOYj';

export const supabasePublic = createClient(url, publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Keep the existing server export for admin/auth routes. Public functions never require it.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = serviceRoleKey
  ? createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : supabasePublic;

type PublishedLegislativeIndex = ReadonlyMap<string, string>;

async function getPublishedLegislativeIndex(): Promise<PublishedLegislativeIndex> {
  const { data, error } = await supabasePublic.from('legislative_items')
    .select('id,type,number,year,status,verification_status')
    .eq('status', 'PUBLISHED')
    .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE']);
  if (error) throw error;

  return new Map((data ?? []).map((item) => [
    normalizeLegislativeCode(`${item.type} ${item.number}/${item.year}`),
    item.id,
  ]));
}

async function getPublishedLegislativeItems(): Promise<LegislativeItemRow[]> {
  const { data, error } = await supabasePublic.from('legislative_items')
    .select('id,type,number,year,title,summary,status,presented_at,concluded_at,source_url,verification_status')
    .eq('status', 'PUBLISHED')
    .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE'])
    .order('year', { ascending: false })
    .order('number', { ascending: false });
  if (error) throw error;
  return (data ?? []) as LegislativeItemRow[];
}

export async function getPublishedLegislativeCodes() {
  return new Set((await getPublishedLegislativeIndex()).keys());
}

export async function getPublicLegislativeItems(): Promise<PublicLegislativeItemDto[]> {
  const items = await getPublishedLegislativeItems();
  const itemIds = items.map((item) => item.id);
  if (itemIds.length === 0) return [];

  const [{ data: events, error: eventsError }, { data: votes, error: votesError }, { data: roles, error: rolesError }] = await Promise.all([
    supabasePublic.from('legislative_events')
      .select('id,item_id,event_type,event_date,description,source_url,verification_status')
      .in('item_id', itemIds)
      .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE'])
      .order('event_date', { ascending: true }),
    supabasePublic.from('legislative_votes')
      .select('id,item_id,session_name,vote_date,voter_name,vote,source_url,verification_status')
      .in('item_id', itemIds)
      .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE'])
      .order('vote_date', { ascending: true }),
    supabasePublic.from('legislative_roles')
      .select('id,item_id,person_name,role,source_url,verification_status')
      .in('item_id', itemIds)
      .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE']),
  ]);

  if (eventsError) throw eventsError;
  if (votesError) throw votesError;
  if (rolesError) throw rolesError;

  const eventsByItem = new Map<string, typeof events>();
  for (const event of events ?? []) {
    const list = eventsByItem.get(event.item_id) ?? [];
    list.push(event);
    eventsByItem.set(event.item_id, list);
  }

  const votesByItem = new Map<string, typeof votes>();
  for (const vote of votes ?? []) {
    const list = votesByItem.get(vote.item_id) ?? [];
    list.push(vote);
    votesByItem.set(vote.item_id, list);
  }

  const rolesByItem = new Map<string, typeof roles>();
  for (const role of roles ?? []) {
    const list = rolesByItem.get(role.item_id) ?? [];
    list.push(role);
    rolesByItem.set(role.item_id, list);
  }

  return items.map((item) => toPublicLegislativeItemDto(item, {
    events: eventsByItem.get(item.id) ?? [],
    votes: votesByItem.get(item.id) ?? [],
    roles: rolesByItem.get(item.id) ?? [],
  }));
}

export async function getPublicLegislativeVotes(): Promise<PublicLegislativeVoteDto[]> {
  const items = await getPublishedLegislativeItems();
  const itemById = new Map(items.map((item) => [item.id, item]));
  const itemIds = items.map((item) => item.id);
  if (itemIds.length === 0) return [];

  const { data, error } = await supabasePublic.from('legislative_votes')
    .select('id,item_id,session_name,vote_date,voter_name,vote,source_url,verification_status')
    .in('item_id', itemIds)
    .in('verification_status', ['VERIFIED_PRIMARY', 'VERIFIED_MULTIPLE'])
    .order('vote_date', { ascending: false, nullsFirst: false });
  if (error) throw error;

  return (data ?? []).flatMap((vote) => {
    const item = itemById.get(vote.item_id);
    return item ? [toPublicLegislativeVoteDto(vote, item)] : [];
  });
}

export async function getPublicSettings() {
  const { data, error } = await supabasePublic.from('site_settings')
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
  const publishedIndex = await getPublishedLegislativeIndex();
  const publishedCodes = new Set(publishedIndex.keys());
  const { data, error } = await supabasePublic.from('projects')
    .select('id,code,title,summary,detailed_description,theme,status,link_alrs,year,impacts')
    .order('year', { ascending: false }).order('code', { ascending: true });
  if (error) throw error;
  return (data ?? [])
    .map((item) => {
      const legislativeCode = normalizeLegislativeCode(item.code);
      const legislativeItemId = publishedIndex.get(legislativeCode);
      return legislativeItemId ? toPublicProjectDto(item, publishedCodes, legislativeItemId) : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export async function getPublicResults() {
  const publishedIndex = await getPublishedLegislativeIndex();
  const publishedCodes = new Set(publishedIndex.keys());
  const { data, error } = await supabasePublic.from('results')
    .select('id,title,category,description,metrics,municipality,result_date')
    .order('result_date', { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((item) => {
      const legislativeCode = extractLegislativeCode(item.title);
      const legislativeItemId = legislativeCode ? publishedIndex.get(normalizeLegislativeCode(legislativeCode)) : undefined;
      return toPublicResultDto(item, publishedCodes, legislativeItemId);
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export async function getPublicMunicipalities() {
  const { data, error } = await supabasePublic.from('municipalities')
    .select('id,name,region,population,key_deliveries').order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    region: item.region,
    population: item.population,
    keyDeliveries: Array.isArray(item.key_deliveries) ? item.key_deliveries : [],
  }));
}

export async function getPublicVideos() {
  const { data, error } = await supabasePublic.from('videos')
    .select('id,title,description,url,platform,category,published_at,thumbnail_url,featured,status,created_at,source_name,verification_status,rights_status')
    .eq('status', 'ativo')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    url: item.url,
    platform: item.platform,
    category: item.category,
    date: item.published_at ?? item.created_at,
    thumbnail: item.thumbnail_url ?? '',
    featured: Boolean(item.featured),
    status: item.status,
    sourceName: item.source_name,
    verificationStatus: item.verification_status,
    rightsStatus: item.rights_status,
  }));
}

export async function getPublicMedia() {
  const { data, error } = await supabasePublic.from('media')
    .select('id,name,title,alt_text,description,credit,category,storage_path,url,size,mime_type,created_at,original_url,source_name,source_page_url,sha256,published_at,downloaded_at,verification_status,rights_status,event_name,notes')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    altText: item.alt_text,
    description: item.description,
    credit: item.credit,
    category: item.category,
    storagePath: item.storage_path,
    url: item.url,
    size: item.size,
    mimeType: item.mime_type,
    uploadedAt: item.created_at,
    originalUrl: item.original_url,
    sourceName: item.source_name,
    sourcePageUrl: item.source_page_url,
    sha256: item.sha256,
    publishedAt: item.published_at,
    verificationStatus: item.verification_status,
    rightsStatus: item.rights_status,
    eventName: item.event_name,
    notes: item.notes,
  }));
}

export async function getPublicNews() {
  const { data, error } = await supabasePublic.from('news')
    .select('id,title,slug,summary,content,main_media_id,gallery,video_url,category,municipality,published_at,author_id,status,featured,seo_title,seo_description,social_media_id,created_at')
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
    date: item.published_at ?? item.created_at,
    author: item.author_id ?? '',
    status: item.status,
    featured: Boolean(item.featured),
    seoTitle: item.seo_title ?? undefined,
    seoDescription: item.seo_description ?? undefined,
    socialImage: item.social_media_id ?? undefined,
  }));
}

export async function getPublicAgenda() {
  const { data, error } = await supabasePublic.from('events')
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
