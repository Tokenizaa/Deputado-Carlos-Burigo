import type {
  PublicArchiveDocumentDto,
  PublicArchiveEvidenceDto,
  PublicArchiveMediaDto,
  PublicArchiveVideoDto,
} from '../../src/contracts/publicArchive';

export function toPublicArchiveDocumentDto(row: any): PublicArchiveDocumentDto {
  return {
    id: row.id,
    legislativeItemId: row.legislative_item_id ?? undefined,
    evidenceId: row.evidence_id ?? undefined,
    documentType: row.document_type,
    title: row.title,
    originalUrl: row.original_url,
    storagePath: row.storage_path ?? undefined,
    mimeType: row.mime_type ?? undefined,
    fileSize: row.file_size ?? undefined,
    sha256: row.sha256 ?? undefined,
    sourceName: row.source_name ?? undefined,
    publishedAt: row.published_at ?? undefined,
    downloadedAt: row.downloaded_at ?? undefined,
    verificationStatus: row.verification_status,
    rightsStatus: row.rights_status,
    notes: row.notes ?? undefined,
  };
}

export function toPublicArchiveEvidenceDto(row: any): PublicArchiveEvidenceDto {
  return {
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id ?? undefined,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    sourceType: row.source_type,
    publicationDate: row.publication_date ?? undefined,
    verificationStatus: row.verification_status,
    notes: row.notes ?? undefined,
    verifiedAt: row.verified_at ?? undefined,
  };
}

export function toPublicArchiveMediaDto(row: any): PublicArchiveMediaDto {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    altText: row.alt_text,
    description: row.description ?? undefined,
    credit: row.credit ?? undefined,
    category: row.category,
    storagePath: row.storage_path,
    url: row.url ?? undefined,
    size: row.size,
    mimeType: row.mime_type,
    uploadedAt: row.created_at,
    originalUrl: row.original_url ?? undefined,
    sourceName: row.source_name ?? undefined,
    sourcePageUrl: row.source_page_url ?? undefined,
    sha256: row.sha256 ?? undefined,
    publishedAt: row.published_at ?? undefined,
    verificationStatus: row.verification_status,
    rightsStatus: row.rights_status,
    eventName: row.event_name ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export function toPublicArchiveVideoDto(row: any): PublicArchiveVideoDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    platform: row.platform,
    category: row.category,
    publishedAt: row.published_at ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    featured: Boolean(row.featured),
    sourceName: row.source_name ?? undefined,
    verificationStatus: row.verification_status,
    rightsStatus: row.rights_status,
  };
}
