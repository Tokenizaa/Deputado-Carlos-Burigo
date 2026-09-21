import { createClient } from '@supabase/supabase-js';
import {
  normalizeLegislativeCode,
  toPublicLegislativeItemDto,
  toPublicResultDto,
} from './mappers/publicLegislative';
import type { User, UserRole } from '../src/types';
import type { AuditLog } from '../src/types';
import {
  toPublicAgendaDto,
  toPublicNewsDto,
  toPublicPageDto,
} from './mappers/publicCommunication';
import {
  mapToPublicMediaDto,
  mapToPublicVideoDto,
  mapToPublicDocumentDto,
  mapToPublicEvidenceDto,
} from './mappers/publicArchive';
import {
  mapToPublicDemandDto,
  mapToPublicDemandMessageDto,
  mapToPublicDemandHistoryDto,
} from './mappers/publicDemand';
import type { LegislativeItemRow } from './mappers/publicLegislative';
import type { PublicLegislativeItemDto } from '../src/contracts/publicLegislative';
import type { PublicAgendaDto, PublicNewsDto, PublicPageDto } from '../src/contracts/publicCommunication';
import type { PublicDemandDto, DemandMessageDto, DemandHistoryDto } from '../src/contracts/publicDemand';
import { extractLegislativeCode } from '../src/contracts/publicLegislative';
import { validatePassword } from '../src/lib/passwordValidation';

// Public read-only adapter: RLS exposes only the institutional/public rows needed here.
const url = process.env.SUPABASE_URL ?? 'https://wktanxbpijurimdjgone.supabase.co';
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
  ?? process.env.SUPABASE_ANON_KEY
  ?? 'sb_publishable_HsuRNZejK8aMxqOxDGK60g_WnabIOYj';

export const supabasePublic = createClient(url, publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Keep the existing server export for admin/auth routes. Public functions never require it.
// Worker runtime has no process.env bindings at module scope; Cloudflare passes the
// service key via env in fetch(). configureSupabaseAdmin() upgrades the client lazily.
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export let supabaseAdmin = serviceRoleKey
  ? createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : supabasePublic;

export function configureSupabaseAdmin(key?: string): void {
  if (!key) return;
  serviceRoleKey = key;
  supabaseAdmin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

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
    .select('id,type,number,year,title,summary,status,presented_at,concluded_at,source_url,verification_status,theme,detailed_description,impacts')
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


// Votos públicos são derivados diretamente de getPublicLegislativeItems().
export async function getPublicSettings() {
  const { data, error } = await supabasePublic.from('site_settings')
    .select('*').eq('id', true).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const {
    site_mode: _siteMode,
    electoral_number: _electoralNumber,
    party_number: _partyNumber,
    party_name: _partyName,
    campaign_slogan: _campaignSlogan,
    campaign_cnpj: _campaignCnpj,
    campaign_coalition: _campaignCoalition,
    official_election_date: _officialElectionDate,
    campaign_official_name: _campaignOfficialName,
    ...publicData
  } = data;
  return {
    ...publicData,
    candidateTitle: data.candidate_title,
    mandateTitle: data.mandate_title,
    institutionalTitle: data.institutional_title,
    candidateName: data.candidate_name,
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
    seoDefaultImageUrl: data.seo_default_image_url,
    privacyPolicyText: data.privacy_policy_text,
  };
}

export async function getPlatformSettings() {
  const { data, error } = await supabaseAdmin
    .from('platform_settings')
    .select('id,citizen_demand_enabled')
    .eq('id', true)
    .single();
  if (error) throw error;
  return {
    citizenDemandEnabled: Boolean(data?.citizen_demand_enabled),
  };
}

export async function updatePlatformSettings(input: { citizenDemandEnabled: boolean }) {
  const { data, error } = await supabaseAdmin
    .from('platform_settings')
    .update({
      citizen_demand_enabled: Boolean(input.citizenDemandEnabled),
      updated_at: new Date().toISOString(),
    })
    .eq('id', true)
    .select('id,citizen_demand_enabled')
    .single();
  if (error) throw error;
  return {
    citizenDemandEnabled: Boolean(data.citizen_demand_enabled),
  };
}

export async function updateAdminSettings(input: Record<string, unknown>) {
  const allowed = [
    'mandate_slogan','bio_highlights','cta_title','cta_subtitle',
    'gabinete_address_poa','gabinete_address_caxias','gabinete_phone','gabinete_phone_caxias',
    'gabinete_whatsapp','gabinete_email','social_instagram','social_facebook','social_youtube',
    'seo_default_title','seo_default_description','seo_default_image_url','privacy_policy_text'
  ];
  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (!(key in input)) continue;
    if (input[key] === null) {
      patch[key] = null;
    } else if (key === 'bio_highlights') {
      patch[key] = Array.isArray(input[key])
        ? input[key].map((item) => String(item).trim()).filter(Boolean)
        : [];
    } else {
      patch[key] = String(input[key] ?? '').trim();
    }
  }
  const { data, error } = await supabaseAdmin.from('site_settings').update(patch).eq('id', true).select('*').single();
  if (error) throw error;
  const {
    site_mode: _siteMode,
    electoral_number: _electoralNumber,
    party_number: _partyNumber,
    party_name: _partyName,
    campaign_slogan: _campaignSlogan,
    campaign_cnpj: _campaignCnpj,
    campaign_coalition: _campaignCoalition,
    official_election_date: _officialElectionDate,
    campaign_official_name: _campaignOfficialName,
    ...publicData
  } = data;
  return {
    ...publicData,
    candidateTitle: data.candidate_title,
    mandateTitle: data.mandate_title,
    institutionalTitle: data.institutional_title,
    candidateName: data.candidate_name,
    gabineteAddressPoa: data.gabinete_address_poa,
    gabineteAddressCaxias: data.gabinete_address_caxias,
    gabinetePhone: data.gabinete_phone,
    gabineteWhatsapp: data.gabinete_whatsapp,
    gabineteEmail: data.gabinete_email,
    gabinetePhoneCaxias: data.gabinete_phone_caxias,
    mandateSlogan: data.mandate_slogan,
    bioHighlights: Array.isArray(data.bio_highlights) ? data.bio_highlights : [],
    ctaTitle: data.cta_title,
    ctaSubtitle: data.cta_subtitle,
    socialInstagram: data.social_instagram,
    socialFacebook: data.social_facebook,
    socialYoutube: data.social_youtube,
    socialWhatsapp: data.social_whatsapp,
    seoDefaultTitle: data.seo_default_title,
    seoDefaultDescription: data.seo_default_description,
    seoDefaultImageUrl: data.seo_default_image_url,
    privacyPolicyText: data.privacy_policy_text,
  };
}

export async function getAdminResults() {
  const { data, error } = await supabaseAdmin
    .from('results')
    .select('id,title,category,description,metrics,municipality,result_date')
    .order('result_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createAdminResult(input: {
  title: string;
  category: string;
  description: string;
  metrics?: string | null;
  municipality?: string | null;
  date?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('results')
    .insert({
      title: String(input.title ?? '').trim(),
      category: String(input.category ?? '').trim(),
      description: String(input.description ?? '').trim(),
      metrics: input.metrics ? String(input.metrics).trim() : null,
      municipality: input.municipality ? String(input.municipality).trim() : null,
      result_date: input.date ? String(input.date).trim() : null,
    })
    .select('id,title,category,description,metrics,municipality,result_date')
    .single();
  if (error) throw error;
  return data;
}

export async function updateAdminResult(id: string, input: {
  title?: string;
  category?: string;
  description?: string;
  metrics?: string | null;
  municipality?: string | null;
  date?: string | null;
}) {
  const patch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries({
    title: input.title,
    category: input.category,
    description: input.description,
    metrics: input.metrics,
    municipality: input.municipality,
    result_date: input.date,
  })) {
    if (value !== undefined) patch[key] = typeof value === 'string' ? value.trim() : value;
  }
  const { data, error } = await supabaseAdmin
    .from('results')
    .update(patch)
    .eq('id', id)
    .select('id,title,category,description,metrics,municipality,result_date')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteAdminResult(id: string) {
  const { data, error } = await supabaseAdmin
    .from('results')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminMunicipalities() {
  const { data, error } = await supabaseAdmin
    .from('municipalities')
    .select('id,name,region,population,key_deliveries')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    region: item.region,
    population: item.population,
    keyDeliveries: Array.isArray(item.key_deliveries) ? item.key_deliveries : [],
  }));
}

export async function createAdminMunicipality(input: {
  name: string;
  region: string;
  population?: string | null;
  keyDeliveries: string[];
}) {
  const { data, error } = await supabaseAdmin
    .from('municipalities')
    .insert({
      name: String(input.name ?? '').trim(),
      region: String(input.region ?? '').trim(),
      population: input.population ? String(input.population).trim() : null,
      key_deliveries: Array.isArray(input.keyDeliveries) ? input.keyDeliveries : [],
    })
    .select('id,name,region,population,key_deliveries')
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    region: data.region,
    population: data.population,
    keyDeliveries: Array.isArray(data.key_deliveries) ? data.key_deliveries : [],
  };
}

export async function updateAdminMunicipality(id: string, input: {
  name?: string;
  region?: string;
  population?: string | null;
  keyDeliveries?: string[];
}) {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = String(input.name).trim();
  if (input.region !== undefined) patch.region = String(input.region).trim();
  if (input.population !== undefined) patch.population = input.population ? String(input.population).trim() : null;
  if (input.keyDeliveries !== undefined) patch.key_deliveries = Array.isArray(input.keyDeliveries) ? input.keyDeliveries : [];

  const { data, error } = await supabaseAdmin
    .from('municipalities')
    .update(patch)
    .eq('id', id)
    .select('id,name,region,population,key_deliveries')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    region: data.region,
    population: data.population,
    keyDeliveries: Array.isArray(data.key_deliveries) ? data.key_deliveries : [],
  };
}

export async function deleteAdminMunicipality(id: string) {
  const { data, error } = await supabaseAdmin
    .from('municipalities')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  return data;
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

export async function getAdminVideos() {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .select('id,title,description,url,platform,category,published_at,thumbnail_url,featured,status,created_at,source_name,verification_status,rights_status')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createAdminVideo(input: {
  title: string;
  description: string;
  url: string;
  platform: string;
  category: string;
  thumbnail?: string | null;
  featured?: boolean;
  status?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .insert({
      title: String(input.title ?? '').trim(),
      description: String(input.description ?? '').trim(),
      url: String(input.url ?? '').trim(),
      platform: String(input.platform ?? '').trim(),
      category: String(input.category ?? '').trim(),
      thumbnail_url: input.thumbnail ? String(input.thumbnail).trim() : null,
      featured: Boolean(input.featured),
      status: input.status ? String(input.status).trim() : 'ativo',
      published_at: new Date().toISOString(),
    })
    .select('id,title,description,url,platform,category,published_at,thumbnail_url,featured,status,created_at,source_name,verification_status,rights_status')
    .single();
  if (error) throw error;
  return data;
}

export async function updateAdminVideo(id: string, input: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  const fields: Record<string, string> = {
    title: 'title', description: 'description', url: 'url', platform: 'platform',
    category: 'category', thumbnail: 'thumbnail_url', status: 'status', featured: 'featured',
  };
  for (const [key, column] of Object.entries(fields)) {
    if (input[key] !== undefined) patch[column] = typeof input[key] === 'string' ? String(input[key]).trim() : input[key];
  }
  const { data, error } = await supabaseAdmin
    .from('videos').update(patch).eq('id', id)
    .select('id,title,description,url,platform,category,published_at,thumbnail_url,featured,status,created_at,source_name,verification_status,rights_status')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteAdminVideo(id: string) {
  const { data, error } = await supabaseAdmin.from('videos').delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPublicVideos() {
  const { data, error } = await supabasePublic.from('videos')
    .select('id,title,description,url,platform,category,published_at,thumbnail_url,featured,status,created_at,source_name,verification_status,rights_status')
    .eq('status', 'ativo')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPublicMedia() {
  const { data, error } = await supabasePublic.from('media')
    .select('id,name,title,alt_text,description,credit,category,storage_path,url,size,mime_type,created_at,original_url,source_name,source_page_url,sha256,published_at,downloaded_at,verification_status,rights_status,event_name,notes')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

const ADMIN_DOCUMENT_SELECT = 'id,legislative_item_id,evidence_id,document_type,title,original_url,storage_path,mime_type,file_size,sha256,source_name,published_at,downloaded_at,verification_status,rights_status,notes,created_at,updated_at,visible,category,status,tags,visibility';

async function mapAdminDocument(row: any) {
  const dto = mapToPublicDocumentDto(row);
  if (!row.storage_path) return { ...dto, publicUrl: null };
  if (row.visibility === 'publico') {
    const publicUrl = supabaseAdmin.storage.from('documents').getPublicUrl(row.storage_path).data.publicUrl;
    return { ...dto, publicUrl };
  }
  const { data } = await supabaseAdmin.storage.from('documents-private').createSignedUrl(row.storage_path, 3600);
  return { ...dto, publicUrl: data?.signedUrl ?? null };
}

export async function getAdminDocuments() {
  const { data, error } = await supabaseAdmin.from('documents')
    .select(ADMIN_DOCUMENT_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data ?? []).map(mapAdminDocument));
}

export async function createAdminDocument(input: Record<string, unknown>) {
  const title = String(input.title ?? '').trim();
  const documentType = String(input.documentType ?? '').trim();
  const originalUrl = input.originalUrl ? String(input.originalUrl).trim() : '';
  if (!title) throw new Error('Título é obrigatório');
  if (!documentType) throw new Error('Tipo do documento é obrigatório');
  if (!originalUrl) throw new Error('Arquivo ou link do documento é obrigatório');

  const row = {
    legislative_item_id: input.legislativeItemId || null,
    evidence_id: input.evidenceId || null,
    document_type: documentType,
    title,
    original_url: originalUrl,
    storage_path: input.storagePath ? String(input.storagePath) : null,
    mime_type: input.mimeType ? String(input.mimeType) : null,
    file_size: typeof input.fileSize === 'number' ? input.fileSize : null,
    source_name: input.sourceName ? String(input.sourceName).trim() : null,
    published_at: input.publishedAt ? String(input.publishedAt) : null,
    verification_status: input.verificationStatus ? String(input.verificationStatus) : 'FOUND_UNVERIFIED',
    rights_status: input.rightsStatus ? String(input.rightsStatus) : 'UNKNOWN',
    notes: input.notes ? String(input.notes).trim() : null,
    visible: input.visible !== false,
    category: input.category ? String(input.category) : 'parlamentar',
    status: input.status ? String(input.status) : 'publicado',
    tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
    visibility: input.visibility ? String(input.visibility) : 'publico',
  };

  const { data, error } = await supabaseAdmin.from('documents')
    .insert(row)
    .select(ADMIN_DOCUMENT_SELECT)
    .single();
  if (error) throw error;
  return mapAdminDocument(data);
}

async function moveDocumentAsset(storagePath: string, fromBucket: string, toBucket: string) {
  const { data, error } = await supabaseAdmin.storage.from(fromBucket).download(storagePath);
  if (error) throw error;
  const bytes = new Uint8Array(await data.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage.from(toBucket).upload(storagePath, bytes, {
    contentType: data.type || 'application/octet-stream',
    upsert: false,
  });
  if (uploadError && !/already exists/i.test(uploadError.message)) throw uploadError;
  const { error: removeError } = await supabaseAdmin.storage.from(fromBucket).remove([storagePath]);
  if (removeError) throw removeError;
}

export async function updateAdminDocument(id: string, input: Record<string, unknown>) {
  const { data: current, error: currentError } = await supabaseAdmin.from('documents')
    .select('id,storage_path,visibility')
    .eq('id', id)
    .maybeSingle();
  if (currentError) throw currentError;
  if (!current) return null;

  const nextVisibility = 'visibility' in input ? String(input.visibility || 'publico') : String(current.visibility || 'publico');
  if (!['publico', 'interno', 'restrito'].includes(nextVisibility)) throw new Error('Visibilidade inválida');

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if ('visible' in input) {
    if (typeof input.visible !== 'boolean') throw new Error('O campo visible deve ser booleano');
    patch.visible = input.visible;
  }
  if ('title' in input) {
    const value = String(input.title ?? '').trim();
    if (!value) throw new Error('Título é obrigatório');
    patch.title = value;
  }
  if ('documentType' in input) patch.document_type = String(input.documentType ?? '').trim();
  if ('notes' in input) patch.notes = input.notes ? String(input.notes).trim() : null;
  if ('originalUrl' in input) patch.original_url = input.originalUrl ? String(input.originalUrl).trim() : null;
  if ('storagePath' in input) patch.storage_path = input.storagePath ? String(input.storagePath) : null;
  if ('mimeType' in input) patch.mime_type = input.mimeType ? String(input.mimeType) : null;
  if ('fileSize' in input) patch.file_size = typeof input.fileSize === 'number' ? input.fileSize : null;
  if ('sourceName' in input) patch.source_name = input.sourceName ? String(input.sourceName).trim() : null;
  if ('publishedAt' in input) patch.published_at = input.publishedAt ? String(input.publishedAt) : null;
  if ('verificationStatus' in input) patch.verification_status = String(input.verificationStatus || 'FOUND_UNVERIFIED');
  if ('rightsStatus' in input) patch.rights_status = String(input.rightsStatus || 'UNKNOWN');
  if ('category' in input) patch.category = String(input.category || 'outros');
  if ('status' in input) patch.status = String(input.status || 'publicado');
  if ('tags' in input) patch.tags = Array.isArray(input.tags) ? input.tags.map((tag) => String(tag).trim()).filter(Boolean) : [];
  if ('visibility' in input) patch.visibility = nextVisibility;
  if ('legislativeItemId' in input) patch.legislative_item_id = input.legislativeItemId || null;
  if ('evidenceId' in input) patch.evidence_id = input.evidenceId || null;

  const currentBucket = current.storage_path ? (current.visibility === 'publico' ? 'documents' : 'documents-private') : null;
  const targetPath = 'storagePath' in input && input.storagePath ? String(input.storagePath) : current.storage_path;
  const targetBucket = targetPath ? (nextVisibility === 'publico' ? 'documents' : 'documents-private') : null;
  if (current.storage_path && targetPath === current.storage_path && currentBucket && targetBucket && currentBucket !== targetBucket) {
    await moveDocumentAsset(current.storage_path, currentBucket, targetBucket);
  }

  const { data, error } = await supabaseAdmin.from('documents')
    .update(patch)
    .eq('id', id)
    .select(ADMIN_DOCUMENT_SELECT)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapAdminDocument(data);
}

export async function getPublicDocuments() {
  const { data, error } = await supabasePublic.from('documents')
    .select('id,legislative_item_id,evidence_id,document_type,title,original_url,storage_path,mime_type,file_size,sha256,source_name,published_at,downloaded_at,verification_status,rights_status,notes,created_at,updated_at,visible,category,status,tags,visibility')
    .eq('visible', true)
    .eq('status', 'publicado')
    .eq('visibility', 'publico')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const dto = mapToPublicDocumentDto(row);
    const publicUrl = supabasePublic.storage.from('documents').getPublicUrl(row.storage_path).data.publicUrl;
    return { ...dto, publicUrl };
  });
}

export async function getAdminEvidence() {
  const { data, error } = await supabaseAdmin.from('evidence')
    .select('id,entity_type,entity_id,source_name,source_url,source_type,publication_date,verification_status,notes,verified_at,verified_by,created_at,updated_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapToPublicEvidenceDto);
}

export async function getPublicEvidence() {
  const { data, error } = await supabasePublic.from('evidence')
    .select('id,entity_type,entity_id,source_name,source_url,source_type,publication_date,verification_status,notes,verified_at,verified_by,created_at,updated_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapToPublicEvidenceDto);
}

export async function getPublicDemands(): Promise<PublicDemandDto[]> {
  const { data, error } = await supabasePublic.from('demands')
    .select('id,protocol,tracking_token_hash,citizen_name,citizen_email,citizen_phone,municipality,neighborhood,category,subject,description,attachments,assigned_to,priority,status,created_at,updated_at')
    .in('status', ['recebida', 'em análise', 'em atendimento', 'encaminhada', 'aguardando retorno', 'respondida', 'concluída'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapToPublicDemandDto);
}

export async function getPublicDemandById(id: string): Promise<PublicDemandDto | null> {
  // Get the demand
  const { data: demandData, error: demandError } = await supabasePublic.from('demands')
    .select('id,protocol,tracking_token_hash,citizen_name,citizen_email,citizen_phone,municipality,neighborhood,category,subject,description,attachments,assigned_to,priority,status,created_at,updated_at')
    .eq('id', id)
    .single();
   
  if (demandError) throw demandError;
  if (!demandData) return null;
  
  // Get messages for this demand
  const { data: messagesData, error: messagesError } = await supabasePublic.from('demand_messages')
    .select('id,demand_id,sender_type,sender_name,text,attachments,created_at')
    .eq('demand_id', id)
    .order('created_at', { ascending: true });
  
  if (messagesError) throw messagesError;
  
  // Get history for this demand
  const { data: historyData, error: historyError } = await supabasePublic.from('demand_history')
    .select('id,demand_id,action,previous_status,new_status,actor_id,actor_name,actor_role,note,created_at')
    .eq('demand_id', id)
    .order('created_at', { ascending: true });
  
  if (historyError) throw historyError;
  
  // Map to DTO with messages and history
  const demandDto = mapToPublicDemandDto(demandData);
  return {
    ...demandDto,
    messages: (messagesData ?? []).map(mapToPublicDemandMessageDto),
    history: (historyData ?? []).map(mapToPublicDemandHistoryDto)
  };
}

export async function getPublicDemandByProtocol(protocol: string): Promise<PublicDemandDto | null> {
  // Get the demand by protocol
  const { data: demandData, error: demandError } = await supabasePublic.from('demands')
    .select('id,protocol,tracking_token_hash,citizen_name,citizen_email,citizen_phone,municipality,neighborhood,category,subject,description,attachments,assigned_to,priority,status,created_at,updated_at')
    .eq('protocol', protocol)
    .single();
   
  if (demandError) throw demandError;
  if (!demandData) return null;
  
  // Get messages for this demand
  const { data: messagesData, error: messagesError } = await supabasePublic.from('demand_messages')
    .select('id,demand_id,sender_type,sender_name,text,attachments,created_at')
    .eq('demand_id', demandData.id)
    .order('created_at', { ascending: true });
  
  if (messagesError) throw messagesError;
  
  // Get history for this demand
  const { data: historyData, error: historyError } = await supabasePublic.from('demand_history')
    .select('id,demand_id,action,previous_status,new_status,actor_id,actor_name,actor_role,note,created_at')
    .eq('demand_id', demandData.id)
    .order('created_at', { ascending: true });
  
  if (historyError) throw historyError;
  
  // Map to DTO with messages and history
  const demandDto = mapToPublicDemandDto(demandData);
  return {
    ...demandDto,
    messages: (messagesData ?? []).map(mapToPublicDemandMessageDto),
    history: (historyData ?? []).map(mapToPublicDemandHistoryDto)
  };
}

export async function getPublicNews(): Promise<PublicNewsDto[]> {
  const { data, error } = await supabasePublic.from('news')
    .select('id,title,slug,summary,content,main_media_id,gallery,video_url,category,municipality,published_at,author_id,status,featured,seo_title,seo_description,social_media_id,created_at')
    .eq('status', 'publicado')
    .order('published_at', { ascending: false, nullsFirst: false });
  if (error) throw error;

  const mediaIds = [...new Set((data ?? []).map((row) => row.main_media_id).filter(Boolean))] as string[];
  const mediaById = new Map<string, string>();
  if (mediaIds.length) {
    const { data: mediaRows, error: mediaError } = await supabasePublic
      .from('media')
      .select('id,url,original_url')
      .in('id', mediaIds);
    if (mediaError) throw mediaError;
    for (const media of mediaRows ?? []) {
      const url = media.url || media.original_url;
      if (url) mediaById.set(media.id, url);
    }
  }

  // Algumas notícias antigas não têm main_media_id preenchido, mas a imagem
  // correspondente já existe no acervo parlamentar. Reconstitui o vínculo
  // pelo título-base para não perder a fotografia real publicada pela ALRS.
  const missingImageTitles = (data ?? [])
    .filter((row) => !row.main_media_id)
    .map((row) => row.title.trim())
    .filter(Boolean);
  const mediaByNewsTitle = new Map<string, { url: string; sourceName?: string; sourceUrl?: string }>();
  if (missingImageTitles.length) {
    const { data: activityMedia, error: activityMediaError } = await supabasePublic
      .from('media')
      .select('title,url,original_url,source_name,source_page_url')
      .eq('category', 'foto/atividade_parlamentar')
      .not('url', 'is', null);
    if (activityMediaError) throw activityMediaError;

    for (const media of activityMedia ?? []) {
      const baseTitle = String(media.title ?? '').replace(/\s+—\s+foto\s+\d+\s*$/i, '').trim();
      const url = media.url || media.original_url;
      if (!baseTitle || !url) continue;

      const exactNewsTitle = missingImageTitles.find((title) => title === baseTitle);
      const relatedNewsTitle = missingImageTitles.find((title) =>
        title.includes('Brigada Militar') && baseTitle.includes('Brigada Militar')
      );
      const newsTitle = exactNewsTitle ?? relatedNewsTitle;
      if (!newsTitle) continue;

      const current = mediaByNewsTitle.get(newsTitle);
      const preferred = /_G\.(?:jpe?g|png)$/i.test(url);
      if (!current || preferred) {
        mediaByNewsTitle.set(newsTitle, { url, sourceName: media.source_name ?? undefined, sourceUrl: media.source_page_url ?? undefined });
      }
    }
  }

  return (data ?? []).map((row) => {
    const dto = toPublicNewsDto(row);
    return {
      ...dto,
      mainImage: row.main_media_id
        ? mediaById.get(row.main_media_id)
        : mediaByNewsTitle.get(row.title.trim())?.url ?? dto.mainImage,
      sourceName: mediaByNewsTitle.get(row.title.trim())?.sourceName,
      sourceUrl: mediaByNewsTitle.get(row.title.trim())?.sourceUrl,
      imageCredit: mediaByNewsTitle.get(row.title.trim())?.sourceName,
    };
  });
}

export async function getAdminNews() {
  const { data, error } = await supabaseAdmin.from('news').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

function slugifyAdmin(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function createAdminNews(input: Record<string, unknown>, actorId: string) {
  const title = String(input.title ?? '').trim();
  if (!title) throw new Error('Título é obrigatório');
  const slug = slugifyAdmin(String(input.slug ?? title));
  const status = input.status === 'rascunho' ? 'rascunho' : 'publicado';
  const { data, error } = await supabaseAdmin.from('news').insert({
    title,
    slug,
    summary: String(input.summary ?? ''),
    content: String(input.content ?? ''),
    category: String(input.category ?? ''),
    municipality: input.municipality ? String(input.municipality) : null,
    main_media_id: input.mainImage ? String(input.mainImage) : null,
    featured: Boolean(input.featured),
    status,
    published_at: status === 'publicado' ? new Date().toISOString() : null,
    author_id: actorId,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateAdminNews(id: string, input: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  for (const key of ['title','summary','content','category','municipality','featured','status']) {
    if (key in input) patch[key] = input[key];
  }
  if ('mainImage' in input) patch.main_media_id = input.mainImage || null;
  if ('slug' in input) patch.slug = slugifyAdmin(String(input.slug ?? ''));
  if (patch.status === 'publicado') patch.published_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('news').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteAdminNews(id: string) {
  const { error } = await supabaseAdmin.from('news').delete().eq('id', id);
  if (error) throw error;
  return { id };
}

export async function getAdminAgenda() {
  const { data, error } = await supabaseAdmin.from('events').select('*').order('starts_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

function agendaStartsAt(input: Record<string, unknown>): string {
  const date = String(input.date ?? '').trim();
  const time = String(input.time ?? '00:00').trim();
  const value = new Date(date + 'T' + time + ':00');
  if (Number.isNaN(value.getTime())) throw new Error('Data e horário inválidos');
  return value.toISOString();
}

export async function createAdminAgenda(input: Record<string, unknown>, actorId: string) {
  const title = String(input.title ?? '').trim();
  if (!title) throw new Error('Título é obrigatório');
  const { data, error } = await supabaseAdmin.from('events').insert({
    title,
    description: String(input.description ?? ''),
    starts_at: agendaStartsAt(input),
    location: String(input.location ?? ''),
    municipality: String(input.municipality ?? ''),
    visibility: input.visibility === 'interno' ? 'interno' : 'publico',
    tags: Array.isArray(input.tags) ? input.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12) : [],
    status: 'publicado',
    created_by: actorId,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateAdminAgenda(id: string, input: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  for (const key of ['title','description','location','municipality','visibility']) {
    if (key in input) patch[key] = input[key];
  }
  if (Array.isArray(input.tags)) patch.tags = input.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12);
  const { data, error } = await supabaseAdmin.from('events').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteAdminAgenda(id: string) {
  const { error } = await supabaseAdmin.from('events').delete().eq('id', id);
  if (error) throw error;
  return { id };
}

export async function getPublicAgenda(): Promise<PublicAgendaDto[]> {
  const { data, error } = await supabasePublic.from('events')
    .select('id,title,description,starts_at,ends_at,location,municipality,media_id,link,participants,tags,visibility,status')
    .eq('status', 'publicado')
    .eq('visibility', 'publico')
    .order('starts_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toPublicAgendaDto);
}

export async function getPublicPages(slug?: string): Promise<PublicPageDto[]> {
  let query = supabasePublic.from('pages')
    .select('id,title,slug,description,seo_title,seo_description,og_image_url,status,updated_by,updated_at')
    .eq('status', 'publicado')
    .order('slug', { ascending: true });
  if (slug) query = query.eq('slug', slug);

  const { data: pages, error: pagesError } = await query;
  if (pagesError) throw pagesError;
  if (!pages?.length) return [];

  const pageIds = pages.map((page) => page.id);
  const { data: blocks, error: blocksError } = await supabasePublic.from('page_blocks')
    .select('id,page_id,type,title,subtitle,content,visible,active,position')
    .in('page_id', pageIds)
    .eq('visible', true)
    .eq('active', true)
    .order('position', { ascending: true });
  if (blocksError) throw blocksError;

  const blocksByPage = new Map<string, typeof blocks>();
  for (const block of blocks ?? []) {
    const list = blocksByPage.get(block.page_id) ?? [];
    list.push(block);
    blocksByPage.set(block.page_id, list);
  }

  return pages.map((page) => toPublicPageDto(page, blocksByPage.get(page.id) ?? []));
}

export async function getAuthenticatedAdminUser(accessToken: string): Promise<User | null> {
  if (!accessToken) return null;
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !data.user) return null;
    return getAdminUserById(data.user.id);
  } catch (error) {
    console.error('Error resolving authenticated admin user:', error);
    return null;
  }
}

export async function getAdminUserById(id: string): Promise<User | null> {
  // Supabase Auth user IDs are UUIDs. Guard the boundary so malformed client
  // values do not reach auth.admin.getUserById() and generate noisy runtime errors.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  try {
    // Get auth user (includes email)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(id);
    if (authError) throw authError;
    if (!authUser) return null;

    // Get profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, cargo, avatar_url')
      .eq('id', id)
      .single();
    if (profileError) throw profileError;
    if (!profile) return null;

    // Get user role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', id)
      .single();
    if (roleError && roleError.code !== 'PGRST116') throw roleError; // PGRST116 means no rows
    const role = roleData?.role ?? 'VISUALIZADOR';

const userEntity = authUser!.user;
return {
        id: profile.id,
        name: profile.name,
        email: userEntity.email ?? '',
        role: role as UserRole,
        avatar: profile.avatar_url ?? undefined,
        cargo: profile.cargo ?? '',
      };
  } catch (error) {
    console.error('Error fetching admin user by id:', error);
    return null;
  }
}


export async function bootstrapFirstAdmin(input: {
  name: string;
  cargo: string;
  email: string;
  password: string;
}): Promise<User> {
  const name = input.name.trim();
  const cargo = input.cargo.trim();
  const email = input.email.trim().toLowerCase();

  if (!name || !cargo || !email || !input.password) throw new Error('Nome, cargo, e-mail e senha são obrigatórios.');
  const passwordValidation = validatePassword(input.password);
  if (!passwordValidation.valid) throw new Error(passwordValidation.error ?? 'Senha inválida.');

  const { data: admins, error: adminsError } = await supabaseAdmin
    .from('user_roles')
    .select('user_id')
    .eq('role', 'ADMIN')
    .limit(1);
  if (adminsError) throw adminsError;
  if ((admins ?? []).length > 0) throw new Error('O cadastro inicial já foi encerrado.');

  const { data: claim, error: claimError } = await supabaseAdmin
    .from('admin_bootstrap')
    .update({
      claimed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', true)
    .is('claimed_at', null)
    .is('completed_at', null)
    .select('id')
    .maybeSingle();
  if (claimError) throw claimError;
  if (!claim) throw new Error('O cadastro inicial já está em andamento ou foi concluído.');

  let createdUserId: string | null = null;
  try {
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (createError) throw createError;
    if (!created.user?.id) throw new Error('Supabase não retornou o usuário criado.');
    createdUserId = created.user.id;

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: createdUserId,
        name,
        cargo,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    if (profileError) throw profileError;

    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: createdUserId,
        role: 'ADMIN',
      }, { onConflict: 'user_id' });
    if (roleError) throw roleError;

    const { error: completeError } = await supabaseAdmin
      .from('admin_bootstrap')
      .update({
        claimed_user_id: createdUserId,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', true);
    if (completeError) throw completeError;

    const user = await getAdminUserById(createdUserId);
    if (!user) throw new Error('O usuário foi criado, mas o perfil administrativo não pôde ser confirmado.');
    return user;
  } catch (error) {
    if (createdUserId) {
      try {
        await supabaseAdmin.from('user_roles').delete().eq('user_id', createdUserId);
        await supabaseAdmin.from('profiles').delete().eq('id', createdUserId);
        await supabaseAdmin.auth.admin.deleteUser(createdUserId);
      } catch (rollbackError) {
        console.error('Falha no rollback do primeiro administrador:', rollbackError);
      }
    }
    await supabaseAdmin
      .from('admin_bootstrap')
      .update({
        claimed_at: null,
        claimed_user_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', true)
      .is('completed_at', null);
    throw error;
  }
}

export async function getAllAdminUsers(): Promise<User[]> {
  try {
    // Get all auth users (admin API)
    const { data: listUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;
    const authUsers = listUsers?.users ?? [];

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, cargo, avatar_url');
    if (profilesError) throw profilesError;

    // Get all user roles
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role');
    if (rolesError) throw rolesError;

    // Build maps
    const profileMap = new Map<string, any>();
    profiles?.forEach(p => profileMap.set(p.id, p));

    const roleMap = new Map<string, string>();
    roles?.forEach(r => roleMap.set(r.user_id, r.role));

    const users: User[] = [];
    for (const authUser of authUsers) {
      const profile = profileMap.get(authUser.id);
if (!profile) continue; // skip if no profile (should not happen)
       const role = roleMap.get(authUser.id) ?? 'VISUALIZADOR';
       users.push({
         id: authUser.id,
         name: profile.name,
         email: ((authUser as any).email ?? (authUser as any)?.user?.email) ?? '',
         role: role as UserRole,
         avatar: profile.avatar_url ?? undefined,
         cargo: profile.cargo ?? '',
       });
    }

    return users;
  } catch (error) {
    console.error('Error fetching all admin users:', error);
    return [];
  }
}

export async function createAdminAuditLog(input: {
  userId: string | null;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabaseAdmin.from('audit_logs').insert({
    user_id: input.userId,
    user_name: input.userName,
    user_role: input.userRole,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    details: input.details ?? {},
  });
  if (error) throw error;
}

export async function getAdminAuditLogs(): Promise<AuditLog[]> {
  const { data, error } = await supabaseAdmin.from('audit_logs')
    .select('id, user_id, user_name, user_role, action, entity_type, entity_id, details, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userRole: row.user_role,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: row.details,
    timestamp: row.created_at,
  }));
}

const DEMAND_FIELDS = 'id,protocol,tracking_token_hash,citizen_name,citizen_email,citizen_phone,municipality,neighborhood,category,subject,description,attachments,assigned_to,priority,status,created_at,updated_at';

export async function getAllDemandsAdmin(): Promise<PublicDemandDto[]> {
  const { data: demandsData, error } = await supabaseAdmin.from('demands')
    .select(DEMAND_FIELDS)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = demandsData ?? [];
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return [];

  const [{ data: messagesData }, { data: historyData }] = await Promise.all([
    supabaseAdmin.from('demand_messages').select('id,demand_id,sender_type,sender_name,text,attachments,created_at').in('demand_id', ids).order('created_at', { ascending: true }),
    supabaseAdmin.from('demand_history').select('id,demand_id,action,previous_status,new_status,actor_id,actor_name,actor_role,note,created_at').in('demand_id', ids).order('created_at', { ascending: true }),
  ]);

  const messagesByDemand = new Map<string, DemandMessageDto[]>();
  (messagesData ?? []).forEach((m) => {
    const list = messagesByDemand.get(m.demand_id) ?? [];
    list.push(mapToPublicDemandMessageDto(m));
    messagesByDemand.set(m.demand_id, list);
  });
  const historyByDemand = new Map<string, DemandHistoryDto[]>();
  (historyData ?? []).forEach((h) => {
    const list = historyByDemand.get(h.demand_id) ?? [];
    list.push(mapToPublicDemandHistoryDto(h));
    historyByDemand.set(h.demand_id, list);
  });

  return rows.map((row) => ({
    ...mapToPublicDemandDto(row),
    messages: messagesByDemand.get(row.id) ?? [],
    history: historyByDemand.get(row.id) ?? [],
  }));
}


export type AdminTaskStatus = 'pendente' | 'em_andamento' | 'aguardando' | 'concluida' | 'cancelada';
export type AdminTaskPriority = 'baixa' | 'normal' | 'alta' | 'urgente';
export type AdminTaskSourceType = 'demanda' | 'legislativo' | 'agenda' | 'conteudo' | 'documento' | 'interna';

const TASK_FIELDS = 'id,title,description,status,priority,assigned_to,due_at,source_type,source_id,completion_notes,completed_at,created_by,created_at,updated_at';

export async function getAdminTasks(): Promise<any[]> {
  const { data, error } = await supabaseAdmin.from('tasks')
    .select(TASK_FIELDS)
    .order('due_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export interface AdminTaskCreate {
  title: string;
  description?: string | null;
  status?: AdminTaskStatus;
  priority?: AdminTaskPriority;
  assignedTo?: string | null;
  dueAt?: string | null;
  sourceType?: AdminTaskSourceType | null;
  sourceId?: string | null;
  completionNotes?: string | null;
  createdBy: string;
}

export async function createAdminTask(input: AdminTaskCreate): Promise<any> {
  const { data, error } = await supabaseAdmin.from('tasks').insert({
    title: input.title.trim(),
    description: input.description ?? null,
    status: input.status ?? 'pendente',
    priority: input.priority ?? 'normal',
    assigned_to: input.assignedTo || null,
    due_at: input.dueAt || null,
    source_type: input.sourceType || null,
    source_id: input.sourceId || null,
    completion_notes: input.completionNotes || null,
    completed_at: input.status === 'concluida' ? new Date().toISOString() : null,
    created_by: input.createdBy,
  }).select(TASK_FIELDS).single();
  if (error) throw error;
  return data;
}

export async function updateAdminTask(id: string, patch: Partial<AdminTaskCreate> & { status?: AdminTaskStatus; completedAt?: string | null }): Promise<any | null> {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) updates.title = patch.title.trim();
  if (patch.description !== undefined) updates.description = patch.description;
  if (patch.status !== undefined) {
    updates.status = patch.status;
    updates.completed_at = patch.status === 'concluida' ? (patch.completedAt || new Date().toISOString()) : null;
  }
  if (patch.priority !== undefined) updates.priority = patch.priority;
  if (patch.assignedTo !== undefined) updates.assigned_to = patch.assignedTo || null;
  if (patch.dueAt !== undefined) updates.due_at = patch.dueAt || null;
  if (patch.sourceType !== undefined) updates.source_type = patch.sourceType || null;
  if (patch.sourceId !== undefined) updates.source_id = patch.sourceId || null;
  if (patch.completionNotes !== undefined) updates.completion_notes = patch.completionNotes;
  const { data, error } = await supabaseAdmin.from('tasks').update(updates).eq('id', id).select(TASK_FIELDS).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function deleteAdminTask(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('tasks').delete().eq('id', id);
  if (error) throw error;
  return true;
}


export interface AdminDemandUpdate {
  status?: string;
  priority?: string;
  assignedTo?: string; // uuid ou nome legado
  internalNote?: string;
  officialReply?: string;
  actor?: { id?: string; name?: string; role?: string };
}

export async function updateDemandAdmin(
  id: string,
  patch: AdminDemandUpdate,
  actor: { id?: string; name?: string; role?: string } = {},
): Promise<PublicDemandDto | null> {
  const actorName = actor.name || 'Sistema';
  const actorRole = actor.role || 'system';

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const historyNotes: string[] = [];
  let replyText: string | undefined;

  if (patch.status) {
    const { data: current } = await supabaseAdmin.from('demands').select('status').eq('id', id).single();
    updates.status = patch.status;
    historyNotes.push(`Status alterado para ${patch.status}${current?.status && current.status !== patch.status ? ` (era ${current.status})` : ''}`);
  }
  if (patch.priority) {
    updates.priority = patch.priority;
    historyNotes.push(`Prioridade alterada para ${patch.priority}`);
  }
  if (patch.assignedTo !== undefined) {
    // frontend envia uuid; aceita nome legado por compatibilidade
    if (patch.assignedTo && !patch.assignedTo.includes('-')) {
      const { data: user } = await supabaseAdmin.from('profiles').select('id,name').eq('name', patch.assignedTo).maybeSingle();
      updates.assigned_to = user?.id ?? null;
      historyNotes.push(user ? `Demanda atribuída a ${user.name}` : 'Atribuição removida');
    } else {
      updates.assigned_to = patch.assignedTo || null;
      historyNotes.push(patch.assignedTo ? `Demanda atribuída a ${patch.assignedTo}` : 'Atribuição removida');
    }
  }
  if (patch.internalNote) historyNotes.push(`Nota interna: ${patch.internalNote}`);
  if (patch.officialReply) replyText = patch.officialReply;

  const { error: updateError } = await supabaseAdmin.from('demands').update(updates).eq('id', id);
  if (updateError) throw updateError;

  if (replyText) {
    const { error: msgError } = await supabaseAdmin.from('demand_messages').insert({
      demand_id: id,
      sender_type: 'cabinet',
      sender_name: actorName,
      text: replyText,
      attachments: [],
      created_at: new Date().toISOString(),
    });
    if (msgError) throw msgError;
    historyNotes.push(`Resposta oficial enviada ao cidadão`);
  }

  if (historyNotes.length > 0) {
    const { error: histError } = await supabaseAdmin.from('demand_history').insert(
      historyNotes.map((note) => ({
        demand_id: id,
        action: 'Atualização administrativa',
        new_status: patch.status ?? null,
        actor_id: actor.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actor.id) ? actor.id : null,
        actor_name: actorName,
        actor_role: actorRole,
        note,
        created_at: new Date().toISOString(),
      })),
    );
    if (histError) throw histError;
  }

  return getPublicDemandById(id);
}