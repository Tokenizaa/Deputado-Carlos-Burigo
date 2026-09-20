export type SiteMode = 'campaign' | 'mandate' | 'institutional';

export type UserRole = 'ADMIN' | 'EDITOR' | 'COMUNICACAO' | 'ATENDIMENTO' | 'VISUALIZADOR';
export type Role = UserRole;

export interface User {

  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  cargo: string;
}

export interface SiteSettings {
  site_mode: SiteMode;
  candidate_title: string;
  mandate_title: string;
  institutional_title: string;
  candidate_name: string;
  electoral_number: string;
  party_number: string;
  party_name: string;
  campaign_slogan: string;
  campaign_cnpj: string;
  campaign_coalition: string;
  official_election_date: string;
  gabinete_address_poa: string;
  gabinete_address_caxias: string;
  gabinete_phone: string;
  gabinete_whatsapp: string;
  gabinete_email: string;
  social_instagram: string;
  social_facebook: string;
  social_youtube: string;
  social_whatsapp: string;
  seo_default_title: string;
  seo_default_description: string;
  seo_default_image_url: string;
  privacy_policy_text: string;
}

export type DemandStatus =
  | 'recebida'
  | 'em análise'
  | 'em atendimento'
  | 'encaminhada'
  | 'aguardando retorno'
  | 'respondida'
  | 'concluída'
  | 'arquivada';

export type DemandPriority = 'baixa' | 'média' | 'alta' | 'urgente';
export type PriorityLevel = DemandPriority;
export type NewsCategory = string;

export type DemandCategory =
  | 'solicitar atendimento'
  | 'apresentar demanda'
  | 'enviar sugestão'
  | 'solicitar informação'
  | 'projeto de lei'
  | 'saúde e hospitalar'
  | 'infraestrutura e rodovias'
  | 'educação'
  | 'agricultura e silvicultura'
  | 'outro assunto';

export interface DemandMessage {
  id: string;
  demandId: string;
  senderType: 'citizen' | 'cabinet';
  senderName: string;
  text: string;
  attachments?: string[];
  createdAt: string;
}

export interface DemandHistory {
  id: string;
  demandId: string;
  action: string;
  previousStatus?: DemandStatus;
  newStatus?: DemandStatus;
  actorName: string;
  actorRole: string;
  note?: string;
  timestamp: string;
}

export interface Demand {
  trackingTokenHash: string;
  id: string;
  protocol: string; // Ex: #2026-004821
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  municipality: string;
  neighborhood?: string;
  category: DemandCategory;
  subject: string;
  description: string;
  attachments: string[];
  assignedTo?: string;
  priority: DemandPriority;
  status: DemandStatus;
  messages: DemandMessage[];
  history: DemandHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  mainImage: string;
  gallery?: string[];
  videoUrl?: string;
  category: string;
  municipality?: string;
  date: string;
  author: string;
  status: 'rascunho' | 'publicado' | 'arquivado';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  municipality: string;
  image?: string;
  link?: string;
  participants?: string;
  visibility: 'publico' | 'interno';
}

export interface ResultItem {
  id: string;
  title: string;
  category: 'Infraestrutura' | 'Economia & Empreendedorismo' | 'Saúde' | 'Educação' | 'Gestão Pública';
  description: string;
  metrics?: string;
  municipality?: string;
  date?: string;
}

export interface Municipality {
  id: string;
  name: string;
  region: string;
  population?: string;
  keyDeliveries: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: 'YouTube' | 'Instagram' | 'Facebook' | 'Externo';
  category: string;
  date: string;
  thumbnail: string;
  featured: boolean;
  status: 'ativo' | 'arquivado';
  sourceName?: string;
  verificationStatus?: string;
  rightsStatus?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  title: string;
  altText: string;
  description?: string;
  credit?: string;
  category: 'fotos' | 'documentos' | 'banners' | 'campanha';
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  usedIn?: string[];
}

export type BlockType =
  | 'hero'
  | 'trajectory'
  | 'text'
  | 'text_image'
  | 'image'
  | 'gallery'
  | 'timeline'
  | 'highlights'
  | 'results'
  | 'projects'
  | 'news'
  | 'agenda'
  | 'videos'
  | 'municipalities'
  | 'citizen_cta'
  | 'social_feed'
  | 'contact'
  | 'map'
  | 'document'
  | 'cta';

export interface PageBlock {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  content?: Record<string, any>;
  visible: boolean;
  active?: boolean;
  order: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  blocks: PageBlock[];
  status: 'rascunho' | 'publicado';
  updatedAt: string;
  updatedBy: string;
  versions?: PageVersion[];
}

export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  blocks: PageBlock[];
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  savedAt: string;
  savedBy: string;
  status: 'draft' | 'published';
  note?: string;
}

export type TaskStatus = 'pendente' | 'em_andamento' | 'aguardando' | 'concluida' | 'cancelada';
export type TaskPriority = 'baixa' | 'normal' | 'alta' | 'urgente';
export type TaskSourceType = 'demanda' | 'legislativo' | 'agenda' | 'conteudo' | 'documento' | 'interna';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string | null;
  dueAt?: string | null;
  sourceType?: TaskSourceType | null;
  sourceId?: string | null;
  completionNotes?: string | null;
  completedAt?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}
