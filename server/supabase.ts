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
  return data ?? [];
}

export async function getPublicMedia() {
  const { data, error } = await supabasePublic.from('media')
    .select('id,name,title,alt_text,description,credit,category,storage_path,url,size,mime_type,created_at,original_url,source_name,source_page_url,sha256,published_at,downloaded_at,verification_status,rights_status,event_name,notes')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPublicDocuments() {
  const { data, error } = await supabasePublic.from('documents')
    .select('id,legislative_item_id,document_type,title,original_url,storage_path,mime_type,file_size,sha256,source_name,downloaded_at,verification_status,rights_status,notes,created_at,updated_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const dto = mapToPublicDocumentDto(row);
    const publicUrl = supabasePublic.storage.from('documents').getPublicUrl(row.storage_path).data.publicUrl;
    return { ...dto, publicUrl };
  });
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
  const mediaByNewsTitle = new Map<string, string>();
  if (missingImageTitles.length) {
    const { data: activityMedia, error: activityMediaError } = await supabasePublic
      .from('media')
      .select('title,url,original_url')
      .eq('category', 'foto/atividade_parlamentar')
      .not('url', 'is', null);
    if (activityMediaError) throw activityMediaError;

    for (const media of activityMedia ?? []) {
      const baseTitle = String(media.title ?? '').replace(/\s+—\s+foto\s+\d+\s*$/i, '').trim();
      const url = media.url || media.original_url;
      if (baseTitle && url && missingImageTitles.includes(baseTitle) && !mediaByNewsTitle.has(baseTitle)) {
        mediaByNewsTitle.set(baseTitle, url);
      }
    }
  }

  return (data ?? []).map((row) => {
    const dto = toPublicNewsDto(row);
    return {
      ...dto,
      mainImage: row.main_media_id
        ? mediaById.get(row.main_media_id)
        : mediaByNewsTitle.get(row.title.trim()) ?? dto.mainImage,
    };
  });
}

export async function getPublicAgenda(): Promise<PublicAgendaDto[]> {
  const { data, error } = await supabasePublic.from('events')
    .select('id,title,description,starts_at,ends_at,location,municipality,media_id,link,participants,visibility,status')
    .eq('status', 'publicado')
    .eq('visibility', 'publico')
    .order('starts_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toPublicAgendaDto);
}

export async function getPublicPages(slug?: string): Promise<PublicPageDto[]> {
  let query = supabasePublic.from('pages')
    .select('id,title,slug,description,status,updated_by,updated_at')
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