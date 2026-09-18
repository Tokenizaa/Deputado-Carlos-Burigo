export interface PublicMediaDto {
  id: string;
  name: string;
  title: string;
  altText: string;
  description: string | null;
  credit: string | null;
  category: string;
  storagePath: string;
  url: string | null;
  size: number;
  mimeType: string;
  uploadedAt: string;
  originalUrl: string | null;
  sourceName: string | null;
  sourcePageUrl: string | null;
  sha256: string | null;
  publishedAt: string | null;
  downloadedAt: string | null;
  verificationStatus: string;
  rightsStatus: string;
  eventName: string | null;
  notes: string | null;
}

export interface PublicVideoDto {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: string;
  category: string;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  featured: boolean;
  status: string;
  createdAt: string;
  sourceName: string | null;
  verificationStatus: string;
  rightsStatus: string;
}

export interface PublicDocumentDto {
  id: string;
  legislativeItemId: string;
  documentType: string;
  title: string;
  originalUrl: string | null;
  publicUrl: string | null;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  sha256: string | null;
  sourceName: string | null;
  downloadedAt: string | null;
  verificationStatus: string;
  rightsStatus: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicEvidenceDto {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string | null;
  storagePath: string | null;
  mimeType: string | null;
  fileSize: number | null;
  sha256: string | null;
  sourceName: string | null;
  uploadedAt: string | null;
  verificationStatus: string;
  rightsStatus: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}