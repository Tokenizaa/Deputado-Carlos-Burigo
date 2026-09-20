import type {
  PublicAgendaDto,
  PublicNewsDto,
  PublicPageBlockDto,
  PublicPageDto,
} from '../../src/contracts/publicCommunication';

type NewsRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  main_media_id?: string | null;
  gallery?: unknown;
  video_url?: string | null;
  category: string;
  municipality?: string | null;
  published_at?: string | null;
  author_id?: string | null;
  status: 'publicado';
  featured: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  social_media_id?: string | null;
  created_at: string;
};

type EventRow = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at?: string | null;
  location: string;
  municipality: string;
  media_id?: string | null;
  link?: string | null;
  participants?: string | null;
  visibility: 'publico';
  status: 'publicado';
};

type PageRow = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
  status: 'publicado';
  updated_by?: string | null;
  updated_at: string;
};

type PageBlockRow = {
  id: string;
  page_id: string;
  type: string;
  title: string;
  subtitle?: string | null;
  content: unknown;
  visible: boolean;
  active: boolean;
  position: number;
};

function jsonObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export function toPublicNewsDto(row: NewsRow): PublicNewsDto {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    mainImage: row.main_media_id ?? undefined,
    gallery: Array.isArray(row.gallery) ? row.gallery.filter((value): value is string => typeof value === 'string') : [],
    videoUrl: row.video_url ?? undefined,
    category: row.category,
    municipality: row.municipality ?? undefined,
    date: row.published_at ?? row.created_at,
    authorId: row.author_id ?? undefined,
    status: 'publicado',
    featured: Boolean(row.featured),
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    socialImage: row.social_media_id ?? undefined,
  };
}

export function toPublicAgendaDto(row: EventRow): PublicAgendaDto {
  const start = new Date(row.starts_at);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: start.toISOString().slice(0, 10),
    time: start.toISOString().slice(11, 16),
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    location: row.location,
    municipality: row.municipality,
    image: row.media_id ?? undefined,
    link: row.link ?? undefined,
    participants: row.participants ?? undefined,
    visibility: 'publico',
  };
}

export function toPublicPageBlockDto(row: PageBlockRow): PublicPageBlockDto {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    content: jsonObject(row.content),
    visible: row.visible,
    active: row.active,
    position: row.position,
  };
}

export function toPublicPageDto(row: PageRow, blocks: PageBlockRow[]): PublicPageDto {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
    status: 'publicado',
    updatedAt: row.updated_at,
    updatedBy: row.updated_by ?? undefined,
    blocks: blocks
      .filter((block) => block.visible && block.active)
      .sort((a, b) => a.position - b.position)
      .map(toPublicPageBlockDto),
  };
}
