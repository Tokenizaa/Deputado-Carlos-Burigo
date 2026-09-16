export type PublicArchiveVerification =
  | 'VERIFIED_PRIMARY'
  | 'VERIFIED_MULTIPLE';

export type PublicArchiveRights =
  | 'PUBLIC'
  | 'RIGHTS_OFFICIAL'
  | 'CC_BY_3.0';

export interface PublicArchiveDocumentDto {
  id: string;
  legislativeItemId?: string;
  evidenceId?: string;
  documentType: string;
  title: string;
  originalUrl: string;
  storagePath?: string;
  mimeType?: string;
  fileSize?: number;
  sha256?: string;
  sourceName?: string;
  publishedAt?: string;
  downloadedAt?: string;
  verificationStatus: PublicArchiveVerification;
  rightsStatus: PublicArchiveRights;
  notes?: string;
}

export interface PublicArchiveEvidenceDto {
  id: string;
  entityType: string;
  entityId?: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: string;
  publicationDate?: string;
  verificationStatus: PublicArchiveVerification;
  notes?: string;
  verifiedAt?: string;
}

export interface PublicArchiveMediaDto {
  id: string;
  name: string;
  title: string;
  altText: string;
  description?: string;
  credit?: string;
  category: string;
  storagePath: string;
  url?: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  originalUrl?: string;
  sourceName?: string;
  sourcePageUrl?: string;
  sha256?: string;
  publishedAt?: string;
  verificationStatus: PublicArchiveVerification;
  rightsStatus: PublicArchiveRights;
  eventName?: string;
  notes?: string;
}

export interface PublicArchiveVideoDto {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: string;
  category: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  featured: boolean;
  sourceName?: string;
  verificationStatus: PublicArchiveVerification;
  rightsStatus: PublicArchiveRights;
}
