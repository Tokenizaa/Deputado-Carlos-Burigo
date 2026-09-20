import { supabaseAdmin } from './supabase.js';
import type { Page, PageBlock, PageVersion } from '../src/types.js';

type PageInput = {
  title?: string;
  slug?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  status?: 'publicado' | 'rascunho';
  blocks?: PageBlock[];
  publish?: boolean;
  note?: string;
};

const PAGE_COLUMNS = 'id,title,slug,description,seo_title,seo_description,og_image_url,status,updated_by,updated_at,created_at';
const BLOCK_COLUMNS = 'id,page_id,type,title,subtitle,content,visible,active,position,created_at,updated_at';
const VERSION_COLUMNS = 'id,page_id,version_number,title,blocks,seo_title,seo_description,og_image_url,saved_by,status,note,created_at';

function toBlock(row: any): PageBlock {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    content: row.content && typeof row.content === 'object' ? row.content : {},
    visible: row.visible !== false,
    active: row.active !== false,
    order: Number(row.position ?? 0),
  };
}

function toVersion(row: any): PageVersion {
  return {
    id: row.id,
    pageId: row.page_id,
    versionNumber: row.version_number,
    title: row.title,
    blocks: Array.isArray(row.blocks) ? row.blocks : [],
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
    savedAt: row.created_at,
    savedBy: row.saved_by ?? '',
    status: (row.status === 'published' ? 'published' : 'draft'),
  };
}

async function hydratePage(page: any): Promise<Page> {
  const [{ data: blocks, error: blocksError }, { data: versions, error: versionsError }] = await Promise.all([
    supabaseAdmin.from('page_blocks').select(BLOCK_COLUMNS).eq('page_id', page.id).order('position', { ascending: true }),
    supabaseAdmin.from('page_versions').select(VERSION_COLUMNS).eq('page_id', page.id).order('version_number', { ascending: false }),
  ]);
  if (blocksError) throw blocksError;
  if (versionsError) throw versionsError;

  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    description: page.description ?? undefined,
    seoTitle: page.seo_title ?? undefined,
    seoDescription: page.seo_description ?? undefined,
    ogImageUrl: page.og_image_url ?? undefined,
    blocks: (blocks ?? []).map(toBlock),
    status: page.status,
    updatedAt: page.updated_at,
    updatedBy: page.updated_by ?? '',
    versions: (versions ?? []).map(toVersion),
  };
}

export async function getAdminPages(): Promise<Page[]> {
  const { data, error } = await supabaseAdmin.from('pages').select(PAGE_COLUMNS).order('updated_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data ?? []).map(hydratePage));
}

export async function getAdminPage(id: string): Promise<Page | null> {
  const { data, error } = await supabaseAdmin.from('pages').select(PAGE_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? hydratePage(data) : null;
}

function normalizeSlug(slug: string): string {
  return slug.trim().replace(/^\/+|\/+$/g, '').replace(/\s+/g, '-').toLowerCase();
}

function normalizeBlocks(blocks: PageBlock[] | undefined): PageBlock[] {
  return (blocks ?? []).map((block, index) => ({
    ...block,
    order: index + 1,
    visible: block.visible !== false,
    active: block.active !== false,
    content: block.content && typeof block.content === 'object' ? block.content : {},
  }));
}

async function saveBlocks(pageId: string, blocks: PageBlock[]) {
  const { data: existing, error: existingError } = await supabaseAdmin.from('page_blocks').select('id').eq('page_id', pageId);
  if (existingError) throw existingError;

  const normalized = normalizeBlocks(blocks);
  const incomingIds = new Set(normalized.filter((block) => /^[0-9a-f-]{36}$/i.test(block.id)).map((block) => block.id));
  const staleIds = (existing ?? []).map((row) => row.id).filter((id) => !incomingIds.has(id));

  if (staleIds.length) {
    const { error } = await supabaseAdmin.from('page_blocks').delete().in('id', staleIds);
    if (error) throw error;
  }

  const existingBlocks = normalized.filter((block) => incomingIds.has(block.id));
  if (existingBlocks.length) {
    const { error } = await supabaseAdmin.from('page_blocks').upsert(existingBlocks.map((block) => ({
      id: block.id,
      page_id: pageId,
      type: block.type,
      title: block.title,
      subtitle: block.subtitle ?? null,
      content: block.content ?? {},
      visible: block.visible,
      active: block.active !== false,
      position: block.order,
    })), { onConflict: 'id' });
    if (error) throw error;
  }

  const newBlocks = normalized.filter((block) => !incomingIds.has(block.id));
  if (newBlocks.length) {
    const { error } = await supabaseAdmin.from('page_blocks').insert(newBlocks.map((block) => ({
      page_id: pageId,
      type: block.type,
      title: block.title,
      subtitle: block.subtitle ?? null,
      content: block.content ?? {},
      visible: block.visible,
      active: block.active !== false,
      position: block.order,
    })));
    if (error) throw error;
  }
}

async function saveVersion(page: Page, note?: string) {
  const nextVersion = (page.versions?.[0]?.versionNumber ?? 0) + 1;
  const { error } = await supabaseAdmin.from('page_versions').insert({
    page_id: page.id,
    version_number: nextVersion,
    title: page.title,
    blocks: page.blocks,
    seo_title: page.seoTitle ?? null,
    seo_description: page.seoDescription ?? null,
    og_image_url: page.ogImageUrl ?? null,
    saved_by: null,
    status: page.status === 'publicado' ? 'published' : 'draft',
    note: note ?? null,
  });
  if (error) throw error;
}

export async function createAdminPage(input: PageInput): Promise<Page> {
  const title = input.title?.trim() || 'Nova Landing Page';
  const slug = normalizeSlug(input.slug || title);
  if (!slug) throw new Error('O slug da página é obrigatório.');

  const { data, error } = await supabaseAdmin.from('pages').insert({
    title,
    slug,
    description: input.description?.trim() || null,
    seo_title: input.seoTitle?.trim() || null,
    seo_description: input.seoDescription?.trim() || null,
    og_image_url: input.ogImageUrl?.trim() || null,
    status: input.publish ? 'publicado' : (input.status ?? 'rascunho'),
  }).select(PAGE_COLUMNS).single();
  if (error) throw error;

  const blocks = normalizeBlocks(input.blocks);
  if (blocks.length) await saveBlocks(data.id, blocks);
  const page = await hydratePage(data);
  await saveVersion(page, input.note ?? 'Página criada no Page Builder');
  return (await getAdminPage(data.id)) as Page;
}

export async function updateAdminPage(id: string, input: PageInput): Promise<Page> {
  const current = await getAdminPage(id);
  if (!current) throw new Error('Página não encontrada.');

  const slug = input.slug !== undefined ? normalizeSlug(input.slug) : current.slug;
  if (!slug) throw new Error('O slug da página é obrigatório.');
  const status = input.publish ? 'publicado' : (input.status ?? current.status);

  const { data, error } = await supabaseAdmin.from('pages').update({
    title: input.title?.trim() ?? current.title,
    slug,
    description: input.description !== undefined ? input.description.trim() : current.description ?? null,
    seo_title: input.seoTitle !== undefined ? input.seoTitle.trim() || null : current.seoTitle ?? null,
    seo_description: input.seoDescription !== undefined ? input.seoDescription.trim() || null : current.seoDescription ?? null,
    og_image_url: input.ogImageUrl !== undefined ? input.ogImageUrl.trim() || null : current.ogImageUrl ?? null,
    status,
  }).eq('id', id).select(PAGE_COLUMNS).single();
  if (error) throw error;

  await saveBlocks(id, input.blocks ?? current.blocks);
  const page = await hydratePage(data);
  await saveVersion(page, input.note ?? (input.publish ? 'Página publicada' : 'Rascunho salvo'));
  return (await getAdminPage(id)) as Page;
}

export async function rollbackAdminPage(pageId: string, versionId: string): Promise<Page> {
  const { data: version, error: versionError } = await supabaseAdmin.from('page_versions').select(VERSION_COLUMNS).eq('id', versionId).eq('page_id', pageId).maybeSingle();
  if (versionError) throw versionError;
  if (!version) throw new Error('Versão não encontrada.');

  const current = await getAdminPage(pageId);
  if (!current) throw new Error('Página não encontrada.');

  const { data, error } = await supabaseAdmin.from('pages').update({
    title: version.title,
    seo_title: version.seo_title ?? null,
    seo_description: version.seo_description ?? null,
    og_image_url: version.og_image_url ?? null,
    status: version.status === 'published' ? 'publicado' : 'rascunho',
  }).eq('id', pageId).select(PAGE_COLUMNS).single();
  if (error) throw error;

  await saveBlocks(pageId, Array.isArray(version.blocks) ? version.blocks : []);
  const restored = await hydratePage(data);
  await saveVersion(restored, `Rollback da versão #${version.version_number}`);
  return (await getAdminPage(pageId)) as Page;
}
