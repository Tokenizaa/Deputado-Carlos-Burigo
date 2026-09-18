import type {
  PublicMediaDto,
  PublicVideoDto,
  PublicDocumentDto,
  PublicEvidenceDto,
} from '../../src/contracts/publicArchive';

// Define row types based on database columns (snake_case)
type MediaRow = {
  id: string;
  name: string;
  title: string;
  alt_text: string;
  description: string | null;
  credit: string | null;
  category: string;
  storage_path: string;
  url: string | null;
  size: number;
  mime_type: string;
  created_at: string;
  original_url: string | null;
  source_name: string | null;
  source_page_url: string | null;
  sha256: string | null;
  published_at: string | null;
  downloaded_at: string | null;
  verification_status: string;
  rights_status: string;
  event_name: string | null;
  notes: string | null;
};

type VideoRow = {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: string;
  category: string;
  published_at: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  status: string;
  created_at: string;
  source_name: string | null;
  verification_status: string;
  rights_status: string;
};

type DocumentRow = {
  id: string;
  legislative_item_id: string;
  document_type: string;
  title: string;
  original_url: string | null;
  storage_path: string;
  mime_type: string;
  file_size: number;
  sha256: string | null;
  source_name: string | null;
  downloaded_at: string | null;
  verification_status: string;
  rights_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type EvidenceRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  source_name: string;
  source_url: string | null;
  source_type: string;
  publication_date: string | null;
  verification_status: string;
  notes: string | null;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Map a media database row to PublicMediaDto
 */
export function mapToPublicMediaDto(row: MediaRow): PublicMediaDto {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    altText: row.alt_text,
    description: row.description,
    credit: row.credit,
    category: row.category,
    storagePath: row.storage_path,
    url: row.url,
    size: row.size,
    mimeType: row.mime_type,
    uploadedAt: row.created_at,
    originalUrl: row.original_url,
    sourceName: row.source_name,
    sourcePageUrl: row.source_page_url,
    sha256: row.sha256,
    publishedAt: row.published_at,
    downloadedAt: row.downloaded_at,
    verificationStatus: row.verification_status,
    rightsStatus: row.rights_status,
    eventName: row.event_name,
    notes: row.notes,
  };
}

/**
 * Map a video database row to PublicVideoDto
 */
export function mapToPublicVideoDto(row: VideoRow): PublicVideoDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    platform: row.platform,
    category: row.category,
    publishedAt: row.published_at,
    thumbnailUrl: row.thumbnail_url,
    featured: row.featured,
    status: row.status,
    createdAt: row.created_at,
    sourceName: row.source_name,
    verificationStatus: row.verification_status,
    rightsStatus: row.rights_status,
  };
}

/**
 * Map a document database row to PublicDocumentDto
 */
export function mapToPublicDocumentDto(row: DocumentRow): PublicDocumentDto {
  return {
    id: row.id,
    legislativeItemId: row.legislative_item_id,
    documentType: row.document_type,
    title: row.title,
    originalUrl: row.original_url,
    publicUrl: null,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    sha256: row.sha256,
    sourceName: row.source_name,
    downloadedAt: row.downloaded_at,
    verificationStatus: row.verification_status,
    rightsStatus: row.rights_status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map an evidence database row to PublicEvidenceDto
 */
export function mapToPublicEvidenceDto(row: EvidenceRow): PublicEvidenceDto {
  return {
    id: row.id,
    title: row.source_name ?? '',
    description: row.notes ?? null,
    type: row.entity_type ?? '',
    url: row.source_url ?? null,
    storagePath: null,
    mimeType: null,
    fileSize: null,
    sha256: null,
    sourceName: row.source_name ?? null,
    uploadedAt: row.publication_date ?? row.created_at ?? null,
    verificationStatus: row.verification_status ?? '',
    rightsStatus: '',
    notes: row.notes ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}