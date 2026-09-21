import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, Eye, EyeOff, FilePlus2, GripVertical, History, Image as ImageIcon, Layout, Pencil, Plus, Save, Send, Trash2, X } from 'lucide-react';
import { Page, PageBlock, BlockType } from '../../types';
import { useApp } from '../../context/AppContext';
import { BlockEditorForm } from './BlockEditorForm';
import { renderBlock } from '../public/DynamicPageView';
import { getSupabaseClient } from '../../lib/supabaseClient';

const BLOCK_TYPES: Array<{ type: BlockType; label: string; description: string }> = [
  { type: 'hero', label: 'Hero', description: 'Destaque principal com texto e mídia' },
  { type: 'text', label: 'Texto editorial', description: 'Texto livre com título e CTA' },
  { type: 'text_image', label: 'Texto + mídia', description: 'Texto acompanhado de imagem ou vídeo' },
  { type: 'image', label: 'Mídia em destaque', description: 'Imagem ou vídeo em destaque' },
  { type: 'trajectory', label: 'Trajetória', description: 'Componente institucional existente' },
  { type: 'projects', label: 'Projetos', description: 'Projetos de lei do acervo' },
  { type: 'results', label: 'Resultados', description: 'Resultados e entregas do acervo' },
  { type: 'news', label: 'Notícias', description: 'Notícias publicadas' },
  { type: 'agenda', label: 'Agenda', description: 'Agenda pública' },
  { type: 'municipalities', label: 'Municípios', description: 'Presença territorial' },
  { type: 'videos', label: 'Vídeos', description: 'Vídeos publicados' },
  { type: 'citizen_cta', label: 'CTA Cidadão', description: 'Entrada para demandas' },
  { type: 'contact', label: 'Contato', description: 'Canais de contato' },
];

function newBlock(type: BlockType, order: number): PageBlock {
  const palette = BLOCK_TYPES.find((item) => item.type === type);
  return {
    id: `draft-${Date.now()}-${order}`,
    type,
    title: palette?.label || 'Novo bloco',
    subtitle: palette?.description || '',
    visible: true,
    active: true,
    order,
    content: {},
  };
}

export const AdminPagesTab: React.FC = () => {
  const { adminPages, media, videos, currentUser, createPage, updatePage, rollbackPage, showToast } = useApp();
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [insertBlockIndex, setInsertBlockIndex] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [draftBlocks, setDraftBlocks] = useState<PageBlock[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [inlineEditing, setInlineEditing] = useState<{ blockId: string; field: 'title' | 'subtitle' | 'text' } | null>(null);
  const [inlineOriginal, setInlineOriginal] = useState<PageBlock | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [mediaPickerBlockId, setMediaPickerBlockId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({ title: '', slug: '', description: '', seoTitle: '', seoDescription: '', ogImageUrl: '', status: 'rascunho' as 'rascunho' | 'publicado' });
  const [uploadingOg, setUploadingOg] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', description: '' });

  const selectedPage = useMemo(() => adminPages.find((page) => page.id === selectedPageId) || adminPages[0], [adminPages, selectedPageId]);

  useEffect(() => {
    if (!selectedPage) {
      setSelectedPageId('');
      setDraftBlocks([]);
      return;
    }
    setSelectedPageId(selectedPage.id);
    setDraftBlocks([...selectedPage.blocks].sort((a, b) => a.order - b.order));
    setMetadata({
      title: selectedPage.title,
      slug: selectedPage.slug,
      description: selectedPage.description || '',
      seoTitle: selectedPage.seoTitle || '',
      seoDescription: selectedPage.seoDescription || '',
      ogImageUrl: selectedPage.ogImageUrl || '',
      status: selectedPage.status,
    });
  }, [selectedPage?.id, selectedPage?.updatedAt]);

  const selectPage = (id: string) => {
    const page = adminPages.find((item) => item.id === id);
    if (!page) return;
    setSelectedPageId(id);
    setDraftBlocks([...page.blocks].sort((a, b) => a.order - b.order));
    setMetadata({ title: page.title, slug: page.slug, description: page.description || '', seoTitle: page.seoTitle || '', seoDescription: page.seoDescription || '', ogImageUrl: page.ogImageUrl || '', status: page.status });
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draftBlocks.length) return;
    const next = [...draftBlocks];
    [next[index], next[target]] = [next[target], next[index]];
    setDraftBlocks(next.map((block, position) => ({ ...block, order: position + 1 })));
  };

  const removeBlock = (id: string) => {
    setDraftBlocks((prev) => prev.filter((block) => block.id !== id).map((block, index) => ({ ...block, order: index + 1 })));
    setSelectedBlockId((current) => current === id ? null : current);
  };

  const duplicateBlock = (id: string) => {
    setDraftBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index < 0) return prev;
      const source = prev[index];
      const copy: PageBlock = { ...JSON.parse(JSON.stringify(source)), id: `draft-${Date.now()}-${index + 1}`, title: source.title ? `${source.title} (cópia)` : source.title };
      const next = [...prev]; next.splice(index + 1, 0, copy);
      return next.map((block, position) => ({ ...block, order: position + 1 }));
    });
    setSelectedBlockId(null);
    showToast('Bloco duplicado no rascunho. Salve para persistir.', 'success');
  };

  const toggleBlockVisibility = (id: string) => setDraftBlocks((prev) => prev.map((block) => block.id === id ? { ...block, visible: block.visible === false } : block));

  const moveBlockByDrag = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setDraftBlocks((prev) => {
      const sourceIndex = prev.findIndex((block) => block.id === sourceId);
      const targetIndex = prev.findIndex((block) => block.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next.map((block, index) => ({ ...block, order: index + 1 }));
    });
  };

  const addBlock = (type: BlockType) => {
    setDraftBlocks((prev) => {
      const index = insertBlockIndex === null ? prev.length : insertBlockIndex;
      const next = [...prev];
      next.splice(index, 0, newBlock(type, index + 1));
      return next.map((block, position) => ({ ...block, order: position + 1 }));
    });
    setInsertBlockIndex(null);
    setShowBlocks(false);
  };

  const openBlockPicker = (index?: number) => {
    setInsertBlockIndex(index ?? null);
    setShowBlocks(true);
  };

  const getInlineText = (block: PageBlock, field: 'title' | 'subtitle' | 'text') => {
    if (field === 'title') return block.title || '';
    if (field === 'subtitle') return block.subtitle || '';
    const content = block.content || {};
    return content.text || content.description || content.leadText || '';
  };

  const setInlineText = (blockId: string, field: 'title' | 'subtitle' | 'text', value: string) => {
    setDraftBlocks((prev) => prev.map((block) => {
      if (block.id !== blockId) return block;
      if (field === 'title') return { ...block, title: value };
      if (field === 'subtitle') return { ...block, subtitle: value };
      return {
        ...block,
        content: {
          ...(block.content || {}),
          text: value,
          description: value,
          leadText: block.type === 'hero' ? value : (block.content?.leadText || undefined),
        },
      };
    }));
  };

  const beginInlineEdit = (blockId: string, field: 'title' | 'subtitle' | 'text') => {
    const block = draftBlocks.find((item) => item.id === blockId);
    if (!block) return;
    setSelectedBlockId(blockId);
    setInlineOriginal(JSON.parse(JSON.stringify(block)));
    setInlineEditing({ blockId, field });
  };

  const cancelInlineEdit = () => {
    if (inlineOriginal) {
      setDraftBlocks((prev) => prev.map((block) => block.id === inlineOriginal.id ? inlineOriginal : block));
    }
    setInlineOriginal(null);
    setInlineEditing(null);
  };

  const finishInlineEdit = () => {
    setInlineOriginal(null);
    setInlineEditing(null);
  };

  const isTextEditable = (block: PageBlock) => ['hero', 'text', 'text_image'].includes(block.type);

  const isMediaEditable = (block: PageBlock) => ['hero', 'text_image', 'image'].includes(block.type);

  const applyMediaToBlock = (blockId: string, item: any) => {
    setDraftBlocks((prev) => prev.map((block) => block.id === blockId ? {
      ...block,
      content: {
        ...(block.content || {}),
        mediaType: 'image',
        mediaSource: 'library',
        mediaId: item.id,
        mediaUrl: item.url,
        imageUrl: item.url,
        videoUrl: undefined,
        altText: item.altText || item.title || block.title,
        caption: item.credit || item.description || '',
      },
    } : block));
    setSelectedBlockId(blockId);
    setMediaPickerBlockId(null);
    showToast('Imagem aplicada ao bloco. Salve o rascunho para persistir.', 'success');
  };

  const applyVideoToBlock = (blockId: string, item: any) => {
    setDraftBlocks((prev) => prev.map((block) => block.id === blockId ? {
      ...block,
      content: {
        ...(block.content || {}),
        mediaType: 'video',
        mediaSource: 'library',
        mediaId: item.id,
        mediaUrl: item.url,
        imageUrl: undefined,
        videoUrl: item.url,
        altText: item.title || block.title,
      },
    } : block));
    setSelectedBlockId(blockId);
    setMediaPickerBlockId(null);
    showToast('Vídeo aplicado ao bloco. Salve o rascunho para persistir.', 'success');
  };

  const removeMediaFromBlock = (blockId: string) => {
    setDraftBlocks((prev) => prev.map((block) => block.id === blockId ? {
      ...block,
      content: {
        ...(block.content || {}),
        mediaType: 'none',
        mediaSource: undefined,
        mediaId: undefined,
        mediaUrl: undefined,
        imageUrl: undefined,
        videoUrl: undefined,
      },
    } : block));
    setMediaPickerBlockId(null);
    showToast('Mídia removida do bloco. Salve o rascunho para persistir.', 'success');
  };

  const updateBlockMediaField = (blockId: string, field: string, value: string) => {
    setDraftBlocks((prev) => prev.map((block) => block.id === blockId ? {
      ...block,
      content: { ...(block.content || {}), [field]: value, ...(field === 'mediaUrl' ? { imageUrl: value, mediaSource: 'external', mediaId: undefined } : {}) },
    } : block));
  };

  const handleBlockCanvasClick = (event: React.MouseEvent, block: PageBlock) => {
    const target = event.target as HTMLElement;
    if (selectedBlockId === block.id && isMediaEditable(block) && target.closest('img')) {
      setMediaPickerBlockId(block.id);
      return;
    }
    setSelectedBlockId(block.id);
  };

  const getBlockMedia = (block: PageBlock) => {
    const content = block.content || {};
    if (content.mediaType === 'video' || content.videoUrl) {
      const video = videos.find((item) => item.id === content.mediaId);
      return { kind: 'video' as const, url: content.videoUrl || content.mediaUrl || video?.url || '', label: video?.title || 'Vídeo' };
    }
    const item = media.find((entry) => entry.id === content.mediaId);
    return { kind: 'image' as const, url: content.imageUrl || content.mediaUrl || item?.url || '', label: item?.title || item?.name || 'Imagem' };
  };

  const uploadOg = async (file: File) => {
    setUploadingOg(true);
    try {
      const client = await getSupabaseClient();
      const { data } = await client.auth.getSession();
      if (!data.session?.access_token) throw new Error('Sessão não autenticada');
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/og-image', { method: 'POST', headers: { Authorization: `Bearer ${data.session.access_token}` }, body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Falha ao enviar imagem');
      setMetadata((current) => ({ ...current, ogImageUrl: json.url }));
      showToast('Imagem Open Graph enviada. Salve a página para vincular a imagem.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Falha ao enviar imagem Open Graph', 'error');
    } finally { setUploadingOg(false); }
  };

  const save = async (publish: boolean) => {
    if (!selectedPage) return;
    setSaving(true);
    await updatePage(selectedPage.id, {
      title: metadata.title,
      slug: metadata.slug,
      description: metadata.description,
      seoTitle: metadata.seoTitle,
      seoDescription: metadata.seoDescription,
      ogImageUrl: metadata.ogImageUrl,
      status: publish ? 'publicado' : 'rascunho',
      publish,
      blocks: draftBlocks,
      note: publish ? `Publicado por ${currentUser.name}` : `Rascunho salvo por ${currentUser.name}`,
    });
    setSaving(false);
  };

  const create = async () => {
    if (!newPage.title.trim() || !newPage.slug.trim()) {
      showToast('Informe título e slug da página.', 'error');
      return;
    }
    const result = await createPage({
      title: newPage.title,
      slug: newPage.slug,
      description: newPage.description,
      seoTitle: '',
      seoDescription: '',
      ogImageUrl: '',
      status: 'rascunho',
      blocks: [newBlock('hero', 1)],
      note: `Landing criada por ${currentUser.name}`,
    });
    if (result.success && result.data) {
      setSelectedPageId(result.data.id);
      setShowCreate(false);
      setNewPage({ title: '', slug: '', description: '' });
    }
  };

  const restore = async (versionId: string) => {
    if (!selectedPage) return;
    const result = await rollbackPage(selectedPage.id, versionId);
    if (result.success) setShowHistory(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2"><Layout className="w-6 h-6 text-[#00A550]" /> Páginas e Landing Pages</h2>
          <p className="text-sm text-stone-500 mt-1">Um único Page Builder para Home, campanha e futuras páginas do mandato.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 bg-[#00A550] text-white px-4 py-2.5 rounded-xl text-xs font-bold"><FilePlus2 className="w-4 h-4" /> Nova página / landing</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <aside className="bg-white border border-stone-200 rounded-2xl p-3 space-y-2">
          <div className="px-2 pb-2 text-[10px] uppercase tracking-wider font-black text-stone-400">Páginas ({adminPages.length})</div>
          {adminPages.map((page) => (
            <button key={page.id} onClick={() => selectPage(page.id)} className={`w-full text-left rounded-xl px-3 py-3 border transition-colors ${selectedPage?.id === page.id ? 'border-emerald-300 bg-emerald-50' : 'border-transparent hover:bg-stone-50'}`}>
              <div className="flex items-center justify-between gap-2"><span className="font-bold text-sm text-stone-900 truncate">{page.title}</span><span className={`text-[9px] font-black uppercase ${page.status === 'publicado' ? 'text-emerald-700' : 'text-amber-700'}`}>{page.status}</span></div>
              <span className="text-[10px] text-stone-400">/{page.slug}</span>
            </button>
          ))}
          {!adminPages.length && <div className="p-4 text-xs text-stone-500">Nenhuma página persistida ainda. Crie a primeira.</div>}
        </aside>

        <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          {!selectedPage ? (
            <div className="p-10 text-center text-stone-500">Crie uma página para começar.</div>
          ) : (
            <>
              <div className="p-5 border-b border-stone-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5"><label className="label">Título</label><input value={metadata.title} onChange={(e) => setMetadata({ ...metadata, title: e.target.value })} className="field" /></div>
                  <div className="md:col-span-4"><label className="label">Slug</label><input value={metadata.slug} onChange={(e) => setMetadata({ ...metadata, slug: e.target.value })} className="field" placeholder="campanha/educacao" /></div>
                  <div className="md:col-span-3"><label className="label">Status</label><select value={metadata.status} onChange={(e) => setMetadata({ ...metadata, status: e.target.value as any })} className="field"><option value="rascunho">Rascunho</option><option value="publicado">Publicado</option></select></div>
                </div>
                <div><label className="label">Descrição / contexto</label><textarea value={metadata.description} onChange={(e) => setMetadata({ ...metadata, description: e.target.value })} className="field" rows={2} placeholder="Ex.: Landing da campanha sobre educação." /></div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => openBlockPicker()} className="action"><Plus className="w-4 h-4" /> Adicionar bloco</button>
                  <button onClick={() => setShowHistory(true)} className="action"><History className="w-4 h-4" /> Versões ({selectedPage.versions?.length || 0})</button>
                  <a href={`/${selectedPage.slug}`} target="_blank" rel="noreferrer" className="action"><Eye className="w-4 h-4" /> Abrir página</a>
                  <button disabled={saving} onClick={() => save(false)} className="action"><Save className="w-4 h-4" /> Salvar rascunho</button>
                  <button disabled={saving} onClick={() => save(true)} className="action action-primary"><Send className="w-4 h-4" /> Publicar</button>
                </div>
              </div>

              <div className="p-5 bg-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <div><div className="text-[10px] uppercase tracking-wider font-black text-emerald-700">Editor visual</div><p className="text-xs text-stone-500">Arraste os blocos para reordenar. Clique em um bloco para editar.</p></div>
                  <span className="text-[10px] font-bold text-stone-400">{draftBlocks.length} blocos</span>
                </div>
                <div className="mx-auto max-w-4xl bg-white min-h-[520px] rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                  {draftBlocks.map((block, index) => {
                    const selected = selectedBlockId === block.id;
                    const editing = inlineEditing?.blockId === block.id;
                    const editingField = editing ? inlineEditing?.field : null;
                    const renderedBlock = renderBlock(block);
                    const textValue = getInlineText(block, 'text');

                    return (
                      <>
                        {index > 0 && (
                          <div className="flex justify-center py-1 bg-stone-100 group">
                            <button type="button" onClick={(event) => { event.stopPropagation(); openBlockPicker(index); }} className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 rounded-full border border-dashed border-stone-300 bg-white px-2.5 py-1 text-[9px] font-black text-stone-400 hover:text-emerald-700 hover:border-emerald-400 transition-opacity">
                              <Plus className="w-3 h-3" /> Inserir seção
                            </button>
                          </div>
                        )}
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => setDraggedBlockId(block.id)}
                        onDragEnd={() => setDraggedBlockId(null)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => draggedBlockId && moveBlockByDrag(draggedBlockId, block.id)}
                        onClick={(event) => handleBlockCanvasClick(event, block)}
                        className={`relative group border-2 border-transparent hover:border-emerald-300 ${selected ? 'border-emerald-500 ring-1 ring-emerald-200' : ''} ${block.visible === false ? 'opacity-50' : ''}`}
                      >
                        <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-md bg-white/95 border border-stone-200 px-2 py-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-3.5 h-3.5 text-stone-400 cursor-grab" />
                          <span className="text-[9px] font-black uppercase text-stone-500">{index + 1} · {block.type}</span>
                        </div>

                        <div className="relative">
                          {renderedBlock}
                          {selected && isMediaEditable(block) && getBlockMedia(block).url && !editing && (
                            <button type="button" onClick={(event) => { event.stopPropagation(); setMediaPickerBlockId(block.id); }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 border border-stone-200 shadow-lg rounded-lg px-3 py-2 text-[10px] font-black text-stone-700">
                              <ImageIcon className="inline w-3.5 h-3.5 mr-1" /> Alterar mídia
                            </button>
                          )}
                        </div>

                        {selected && (
                          <div className="absolute right-3 top-3 z-20 flex gap-1">
                            {isTextEditable(block) && !editing && (
                              <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); beginInlineEdit(block.id, 'title'); }}
                                className="action shadow-sm bg-white"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Editar no canvas
                              </button>
                            )}
                            {isMediaEditable(block) && !editing && (
                              <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); setMediaPickerBlockId(block.id); }}
                                className="action shadow-sm bg-white"
                              >
                                <ImageIcon className="w-3.5 h-3.5" /> Mídia
                              </button>
                            )}
                            <button type="button" onClick={(event) => { event.stopPropagation(); setEditingBlock(block); }} className="action shadow-sm bg-white">
                              <Pencil className="w-3.5 h-3.5" /> Avançado
                            </button>
                            <button type="button" title={block.visible === false ? 'Mostrar bloco' : 'Ocultar bloco'} onClick={(event) => { event.stopPropagation(); toggleBlockVisibility(block.id); }} className="icon-btn bg-white shadow-sm">{block.visible === false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
                            <button type="button" title="Duplicar bloco" onClick={(event) => { event.stopPropagation(); duplicateBlock(block.id); }} className="icon-btn bg-white shadow-sm"><Copy className="w-3.5 h-3.5" /></button>
                            <button type="button" title="Mover para cima" disabled={index === 0} onClick={(event) => { event.stopPropagation(); moveBlock(index, -1); }} className="icon-btn bg-white shadow-sm"><ChevronUp className="w-3.5 h-3.5" /></button>
                            <button type="button" title="Mover para baixo" disabled={index === draftBlocks.length - 1} onClick={(event) => { event.stopPropagation(); moveBlock(index, 1); }} className="icon-btn bg-white shadow-sm"><ChevronDown className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={(event) => { event.stopPropagation(); removeBlock(block.id); }} className="icon-btn text-rose-600 bg-white shadow-sm">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {selected && isMediaEditable(block) && mediaPickerBlockId === block.id && (
                          <div className="absolute left-3 right-3 top-14 z-30 bg-white border border-stone-200 rounded-xl shadow-xl p-3" onClick={(event) => event.stopPropagation()}>
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div><div className="text-[10px] uppercase tracking-wider font-black text-emerald-700">Mídia do bloco</div><div className="text-xs text-stone-500">Escolha do acervo, vídeo ou remova a mídia atual.</div></div>
                              <button type="button" onClick={() => setMediaPickerBlockId(null)} className="icon-btn"><X className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-auto">
                              {media.filter((item) => item.mimeType?.startsWith('image/')).map((item) => (
                                <button key={item.id} type="button" title={item.title || item.name} onClick={() => applyMediaToBlock(block.id, item)} className="group rounded-lg overflow-hidden border border-stone-200 hover:border-emerald-500 bg-stone-50">
                                  <img src={item.url} alt={item.altText || item.title} className="w-full aspect-square object-cover" />
                                  <span className="block truncate px-1 py-1 text-[9px] font-bold text-stone-600">{item.title || item.name}</span>
                                </button>
                              ))}
                            </div>
                            {!media.some((item) => item.mimeType?.startsWith('image/')) && <div className="text-xs text-stone-500 py-4">Nenhuma imagem disponível na biblioteca.</div>}
                            <div className="mt-3 border-t border-stone-100 pt-3">
                              <label className="label">URL externa</label>
                              <div className="flex gap-2">
                                <input value={block.content?.mediaUrl || block.content?.imageUrl || ''} onChange={(event) => updateBlockMediaField(block.id, 'mediaUrl', event.target.value)} className="field" placeholder="https://..." />
                                <button type="button" onClick={() => updateBlockMediaField(block.id, 'mediaUrl', '')} className="action">Limpar</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                              <div><label className="label">Texto alternativo</label><input value={block.content?.altText || ''} onChange={(event) => updateBlockMediaField(block.id, 'altText', event.target.value)} className="field" placeholder="Descrição acessível" /></div>
                              <div><label className="label">Legenda / crédito</label><input value={block.content?.caption || ''} onChange={(event) => updateBlockMediaField(block.id, 'caption', event.target.value)} className="field" placeholder="Crédito ou legenda" /></div>
                            </div>
                            {videos.length > 0 && block.type !== 'image' && (
                              <div className="mt-3 pt-3 border-t border-stone-100"><div className="text-[10px] uppercase font-black text-stone-400 mb-2">Vídeos do acervo</div><div className="flex flex-wrap gap-2">
                                {videos.slice(0, 8).map((item) => <button key={item.id} type="button" onClick={() => applyVideoToBlock(block.id, item)} className="action">{item.title}</button>)}
                              </div></div>
                            )}
                            {getBlockMedia(block).url && <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-100 pt-3"><span className="text-[10px] text-stone-500 truncate">Atual: {getBlockMedia(block).label}</span><button type="button" onClick={() => removeMediaFromBlock(block.id)} className="action text-rose-600">Remover mídia</button></div>}
                          </div>
                        )}

                        {editing && (
                          <div
                            className="absolute inset-0 z-30 bg-white/95 p-5 overflow-auto"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="text-[10px] uppercase tracking-wider font-black text-emerald-700">Edição inline</div>
                                <div className="text-xs text-stone-500">A alteração fica no rascunho até você salvar ou publicar.</div>
                              </div>
                              <button type="button" onClick={cancelInlineEdit} className="icon-btn"><X className="w-4 h-4" /></button>
                            </div>

                            <div className="space-y-3 max-w-2xl">
                              <div>
                                <label className="label">Título</label>
                                <input
                                  autoFocus={editingField === 'title'}
                                  value={getInlineText(block, 'title')}
                                  onChange={(event) => setInlineText(block.id, 'title', event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') finishInlineEdit();
                                    if (event.key === 'Escape') cancelInlineEdit();
                                  }}
                                  className="field text-base font-bold"
                                />
                              </div>
                              <div>
                                <label className="label">Subtítulo</label>
                                <input
                                  autoFocus={editingField === 'subtitle'}
                                  value={getInlineText(block, 'subtitle')}
                                  onChange={(event) => setInlineText(block.id, 'subtitle', event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') finishInlineEdit();
                                    if (event.key === 'Escape') cancelInlineEdit();
                                  }}
                                  className="field"
                                />
                              </div>
                              {isTextEditable(block) && (
                                <div>
                                  <label className="label">Texto</label>
                                  <textarea
                                    autoFocus={editingField === 'text'}
                                    value={textValue}
                                    onChange={(event) => setInlineText(block.id, 'text', event.target.value)}
                                    className="field min-h-32 resize-y"
                                  />
                                </div>
                              )}
                              <div className="flex justify-end gap-2 pt-1">
                                <button type="button" onClick={cancelInlineEdit} className="action">
                                  <X className="w-3.5 h-3.5" /> Cancelar
                                </button>
                                <button type="button" onClick={finishInlineEdit} className="action action-primary">
                                  <Check className="w-3.5 h-3.5" /> Concluir
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                      </>
                    );
                  })}
                  {draftBlocks.length > 0 && (
                    <div className="flex justify-center py-2 bg-stone-100">
                      <button type="button" onClick={() => openBlockPicker()} className="inline-flex items-center gap-1 rounded-full border border-dashed border-stone-300 bg-white px-3 py-1.5 text-[10px] font-black text-stone-500 hover:text-emerald-700 hover:border-emerald-400">
                        <Plus className="w-3 h-3" /> Adicionar seção
                      </button>
                    </div>
                  )}
                  {!draftBlocks.length && <div className="border-2 border-dashed border-stone-300 m-5 rounded-xl p-16 text-center text-sm text-stone-500">Adicione um bloco para começar a montar esta página.</div>}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {showCreate && <div className="modal"><div className="modal-card"><h3 className="text-lg font-black">Criar página / landing</h3><p className="text-xs text-stone-500 mt-1">A mesma estrutura serve para campanha e mandato.</p><label className="label mt-4">Título</label><input value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} className="field" placeholder="Landing — Educação" /><label className="label mt-3">Slug</label><input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} className="field" placeholder="campanha/educacao" /><label className="label mt-3">Descrição</label><textarea value={newPage.description} onChange={(e) => setNewPage({ ...newPage, description: e.target.value })} className="field" rows={3} /><div className="flex justify-end gap-2 mt-5"><button onClick={() => setShowCreate(false)} className="action">Cancelar</button><button onClick={create} className="action action-primary">Criar</button></div></div></div>}

      {showBlocks && <div className="modal"><div className="modal-card max-w-2xl"><h3 className="text-lg font-black">Adicionar bloco</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">{BLOCK_TYPES.map((item) => <button key={item.type} onClick={() => addBlock(item.type)} className="text-left border border-stone-200 rounded-xl p-3 hover:border-emerald-300 hover:bg-emerald-50"><div className="font-bold text-sm">{item.label}</div><div className="text-[10px] text-stone-500 mt-1">{item.description}</div></button>)}</div><button onClick={() => setShowBlocks(false)} className="action mt-4">Cancelar</button></div></div>}

      {showHistory && selectedPage && <div className="modal"><div className="modal-card max-w-2xl"><h3 className="text-lg font-black">Histórico da página</h3><div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto">{(selectedPage.versions || []).map((version) => <div key={version.id} className="border border-stone-200 rounded-xl p-3 flex items-center justify-between gap-3"><div><div className="font-bold text-sm">Versão #{version.versionNumber}</div><div className="text-[10px] text-stone-500">{new Date(version.savedAt).toLocaleString('pt-BR')}</div></div><button onClick={() => restore(version.id)} className="action">Restaurar</button></div>)}{!selectedPage.versions?.length && <div className="text-sm text-stone-500">Nenhuma versão registrada.</div>}</div><button onClick={() => setShowHistory(false)} className="action mt-4">Fechar</button></div></div>}

      {editingBlock && selectedPage && <BlockEditorForm block={editingBlock} pageId={selectedPage.id} totalBlocksCount={draftBlocks.length} onCancel={() => setEditingBlock(null)} onSave={async (updatedBlock, commitToBackend = false) => {
        const nextBlocks = draftBlocks.map((item) => item.id === updatedBlock.id ? updatedBlock : item);
        setDraftBlocks(nextBlocks);
        if (!commitToBackend) {
          setEditingBlock(null);
          showToast('Bloco atualizado no rascunho. Use Salvar ou Publicar para persistir.', 'success');
          return { success: true };
        }
        const result = await updatePage(selectedPage.id, {
          title: metadata.title,
          slug: metadata.slug,
          description: metadata.description,
          seoTitle: metadata.seoTitle,
          seoDescription: metadata.seoDescription,
          ogImageUrl: metadata.ogImageUrl,
          status: metadata.status,
          publish: metadata.status === 'publicado',
          blocks: nextBlocks,
          note: `Bloco atualizado por ${currentUser.name}`,
        });
        if (result.success) {
          setDraftBlocks([...(result.data?.blocks || nextBlocks)].sort((a, b) => a.order - b.order));
          setEditingBlock(null);
        }
        return result;
      }} />}

      <style>{`.label{display:block;font-size:10px;font-weight:800;text-transform:uppercase;color:#57534e;margin-bottom:4px}.field{width:100%;border:1px solid #e7e5e4;border-radius:12px;padding:9px 10px;font-size:12px;outline:none;background:#fff}.field:focus{border-color:#00A550}.action{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid #d6d3d1;background:#fff;color:#44403c;border-radius:10px;padding:8px 11px;font-size:11px;font-weight:800}.action:hover{background:#fafaf9}.action:disabled{opacity:.5}.action-primary{background:#00A550;border-color:#00A550;color:#fff}.icon-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #e7e5e4;border-radius:8px;background:#fff;color:#57534e}.icon-btn:disabled{opacity:.35}.modal{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px}.modal-card{width:100%;max-width:520px;background:#fff;border-radius:18px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.2);max-height:90vh;overflow:auto}`}</style>
    </div>
  );
};
