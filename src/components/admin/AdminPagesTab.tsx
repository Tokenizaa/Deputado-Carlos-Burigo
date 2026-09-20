import React, { useEffect, useMemo, useState } from 'react';
import { Eye, FilePlus2, GripVertical, History, Layout, Pencil, Plus, Save, Send, Trash2 } from 'lucide-react';
import { Page, PageBlock, BlockType } from '../../types';
import { useApp } from '../../context/AppContext';
import { BlockEditorForm } from './BlockEditorForm';
import { renderBlock } from '../public/DynamicPageView';

const BLOCK_TYPES: Array<{ type: BlockType; label: string; description: string }> = [
  { type: 'hero', label: 'Hero', description: 'Destaque principal com texto e mídia' },
  { type: 'text', label: 'Texto editorial', description: 'Texto livre com título e CTA' },
  { type: 'text_image', label: 'Texto + mídia', description: 'Texto acompanhado de imagem ou vídeo' },
  { type: 'image', label: 'Mídia em destaque', description: 'Imagem ou vídeo em destaque' },
  { type: 'gallery', label: 'Galeria', description: 'Conjunto de imagens do acervo' },
  { type: 'trajectory', label: 'Trajetória', description: 'Componente institucional existente' },
  { type: 'projects', label: 'Projetos', description: 'Projetos de lei do acervo' },
  { type: 'results', label: 'Resultados', description: 'Resultados e entregas do acervo' },
  { type: 'news', label: 'Notícias', description: 'Notícias publicadas' },
  { type: 'agenda', label: 'Agenda', description: 'Agenda pública' },
  { type: 'municipalities', label: 'Municípios', description: 'Presença territorial' },
  { type: 'videos', label: 'Vídeos', description: 'Vídeos publicados' },
  { type: 'citizen_cta', label: 'CTA Cidadão', description: 'Entrada para demandas' },
  { type: 'contact', label: 'Contato', description: 'Canais de contato' },
  { type: 'cta', label: 'CTA', description: 'Chamada para ação' },
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
  const { adminPages, currentUser, createPage, updatePage, rollbackPage, showToast } = useApp();
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [draftBlocks, setDraftBlocks] = useState<PageBlock[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({ title: '', slug: '', description: '', status: 'rascunho' as 'rascunho' | 'publicado' });
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
      status: selectedPage.status,
    });
  }, [selectedPage?.id, selectedPage?.updatedAt]);

  const selectPage = (id: string) => {
    const page = adminPages.find((item) => item.id === id);
    if (!page) return;
    setSelectedPageId(id);
    setDraftBlocks([...page.blocks].sort((a, b) => a.order - b.order));
    setMetadata({ title: page.title, slug: page.slug, description: page.description || '', status: page.status });
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
    setDraftBlocks((prev) => [...prev, newBlock(type, prev.length + 1)]);
    setShowBlocks(false);
  };

  const save = async (publish: boolean) => {
    if (!selectedPage) return;
    setSaving(true);
    await updatePage(selectedPage.id, {
      title: metadata.title,
      slug: metadata.slug,
      description: metadata.description,
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
                  <button onClick={() => setShowBlocks(true)} className="action"><Plus className="w-4 h-4" /> Adicionar bloco</button>
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
                    const content = block.content || {};
                    const renderedBlock = renderBlock(block);
                    );
                  })}
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
