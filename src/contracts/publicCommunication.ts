export interface PublicNewsDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  mainImage?: string;
  gallery: string[];
  videoUrl?: string;
  category: string;
  municipality?: string;
  date: string;
  authorId?: string;
  status: 'publicado';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
  sourceName?: string;
  sourceUrl?: string;
  imageCredit?: string;
}

export interface PublicAgendaDto {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  municipality: string;
  image?: string;
  link?: string;
  participants?: string;
  visibility: 'publico';
}

export interface PublicPageBlockDto {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content: Record<string, unknown>;
  visible: boolean;
  active: boolean;
  position: number;
}

export interface PublicPageDto {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'publicado';
  updatedAt: string;
  updatedBy?: string;
  blocks: PublicPageBlockDto[];
}
