import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Check,
  Eye,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  Send,
  History,
  Sparkles,
  Plus,
  Trash2,
  Settings2,
  FileText,
  Image as ImageIcon,
  Layout,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Page, PageBlock, BlockType } from '../../types';
import { BlockEditorForm } from './BlockEditorForm';

export const AdminPagesTab: React.FC = () => {
  const { pages, currentUser, refreshAllData, showToast, updatePage } = useApp();

  // Find page-home or the first page
  const homePage = pages.find((p) => p.slug === 'home' || p.id === 'page-home') || pages[0];
  const [selectedPageId, setSelectedPageId] = useState<string>(homePage?.id || 'page-home');

  const currentPage = pages.find((p) => p.id === selectedPageId) || homePage;

  const [blocksDraft, setBlocksDraft] = useState<PageBlock[]>(currentPage?.blocks || []);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);

  // Keep draft in sync with page when selected page changes
  useEffect(() => {
    if (currentPage && currentPage.blocks) {
      console.log('[AdminPagesTab] Syncing blocksDraft with currentPage:', {
        pageId: currentPage.id,
        title: currentPage.title,
        blockCount: currentPage.blocks.length,
        updatedAt: currentPage.updatedAt,
      });
      setBlocksDraft(
        currentPage.blocks.map((b) => ({
          ...b,
          visible: b.visible !== false && (b as any).active !== false,
          active: b.visible !== false && (b as any).active !== false,
        }))
      );
    }
  }, [currentPage?.id, currentPage?.updatedAt]);

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocksDraft.length) return;

    const updated = [...blocksDraft];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Reassign order
    updated.forEach((b, i) => {
      b.order = i + 1;
    });

    setBlocksDraft(updated);
  };

  const toggleBlockActive = (id: string) => {
    setBlocksDraft((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextVal = !b.visible;
          return { ...b, visible: nextVal, active: nextVal };
        }
        return b;
      })
    );
  };

  const removeBlock = (id: string) => {
    if (blocksDraft.length <= 1) {
      showToast('A página precisa ter ao menos um bloco.', 'error');
      return;
    }
    const updated = blocksDraft.filter((b) => b.id !== id);
    updated.forEach((b, i) => {
      b.order = i + 1;
    });
    setBlocksDraft(updated);
    showToast('Bloco removido da lista.', 'info');
  };

  // Unified save handler for BlockEditorForm (draft or direct server commit)
  const handleSaveBlockFromForm = async (
    updatedBlock: PageBlock,
    commitToBackend = false
  ): Promise<{ success: boolean; error?: string } | void> => {
    console.log('[AdminPagesTab:handleSaveBlockFromForm] Processing block update:', {
      blockId: updatedBlock.id,
      title: updatedBlock.title,
      order: updatedBlock.order,
      type: updatedBlock.type,
      commitToBackend,
    });

    const updatedDraft = blocksDraft.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    updatedDraft.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    setBlocksDraft(updatedDraft);

    if (commitToBackend) {
      setIsSaving(true);
      const pageId = currentPage?.id || selectedPageId || 'page-home';
      console.log('[AdminPagesTab:handleSaveBlockFromForm] Direct committing block update to backend for page:', pageId);

      const result = await updatePage(pageId, {
        blocks: updatedDraft,
        publish: false,
        status: currentPage?.status || 'publicado',
        note: `Bloco "${updatedBlock.title}" editado e gravado no servidor por ${currentUser.name}`,
      });
      setIsSaving(false);

      if (result.success) {
        setEditingBlock(null);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } else {
      setEditingBlock(null);
      showToast('Conteúdo do bloco atualizado no rascunho.', 'success');
      return { success: true };
    }
  };

  const addBlock = (type: BlockType, label: string) => {
    const newId = `blk-${type}-${Date.now().toString().slice(-4)}`;
    const newBlock: PageBlock = {
      id: newId,
      type,
      title: label,
      subtitle: `Seção ${label} configurada no Page Builder`,
      visible: true,
      active: true,
      order: blocksDraft.length + 1,
      content: {
        title: label,
        badge: 'Em Destaque',
        text: 'Texto descritivo institucional da seção.',
        imageUrl: '',
        buttonText: 'Saiba Mais',
        buttonLink: '#',
      },
    };

    setBlocksDraft([...blocksDraft, newBlock]);
    setShowAddModal(false);
    showToast(`Bloco "${label}" adicionado à página.`, 'success');
  };

  const handleSave = async (publish: boolean) => {
    if (!currentPage) return;
    setIsSaving(true);
    const pageId = currentPage.id || 'page-home';
    console.log('[AdminPagesTab:handleSave] Committing page update via data provider:', {
      pageId,
      publish,
      totalBlocks: blocksDraft.length,
      blocks: blocksDraft.map((b) => ({ id: b.id, type: b.type, title: b.title, order: b.order, visible: b.visible })),
    });

    try {
      const result = await updatePage(pageId, {
        blocks: blocksDraft,
        publish,
        status: publish ? 'publicado' : 'rascunho',
        note: publish
          ? `Publicado por ${currentUser.name} com ${blocksDraft.length} blocos`
          : `Rascunho salvo por ${currentUser.name} com ${blocksDraft.length} blocos`,
      });

      if (result.success) {
        console.log('[AdminPagesTab:handleSave] Successfully committed page update.');
        await refreshAllData();
      } else {
        console.error('[AdminPagesTab:handleSave] Failed to commit page update:', result.error);
      }
    } catch (err) {
      console.error('[AdminPagesTab:handleSave] Unhandled exception during save:', err);
      showToast('Erro de conexão ao salvar página.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async (version: any) => {
    if (!currentPage) return;
    try {
      const pageId = currentPage.id || 'page-home';
      const res = await fetch(`/api/pages/${pageId}/rollback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          versionId: version.id,
          versionNumber: version.versionNumber,
        }),
      });

      if (res.ok) {
        showToast(`Versão #${version.versionNumber} restaurada com sucesso!`, 'success');
        await refreshAllData();
        setShowHistoryModal(false);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Erro ao restaurar versão.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao restaurar versão.', 'error');
    }
  };

  const blockTypePalette: { type: BlockType; name: string; desc: string; icon: any }[] = [
    { type: 'hero', name: 'Hero Principal', desc: 'Apresentação com foto, slogan e chamada', icon: Layout },
    { type: 'trajectory', name: 'Trajetória / Linha do Tempo', desc: 'Histórico pessoal, biografia e cargos públicos', icon: History },
    { type: 'projects', name: 'Projetos de Lei', desc: 'Atuação na Assembleia e leis aprovadas', icon: FileText },
    { type: 'results', name: 'Resultados & Entregas', desc: 'Prestação de contas e emendas para o RS', icon: Sparkles },
    { type: 'news', name: 'Notícias & Imprensa', desc: 'Artigos recentes com filtros de busca', icon: FileText },
    { type: 'agenda', name: 'Agenda Oficial', desc: 'Compromissos públicos e audiências', icon: Clock },
    { type: 'municipalities', name: 'Presença nos Municípios', desc: 'Ações e entregas regionalizadas', icon: Layers },
    { type: 'videos', name: 'Vídeos & Pronunciamentos', desc: 'Galeria com player integrado', icon: Layout },
    { type: 'citizen_cta', name: 'Portal do Cidadão (CTA)', desc: 'Canal de envio de demandas e protocolo', icon: UserCheck },
    { type: 'contact', name: 'Canais de Contato', desc: 'Endereços em Porto Alegre e Caxias do Sul', icon: FileText },
    { type: 'text', name: 'Texto Editorial', desc: 'Parágrafos de texto livre com título e subtítulo', icon: FileText },
    { type: 'text_image', name: 'Texto com Imagem', desc: 'Composição de texto acompanhado por foto lateral', icon: ImageIcon },
    { type: 'image', name: 'Banner em Destaque', desc: 'Imagem grande com legenda informativa', icon: ImageIcon },
    { type: 'social_feed', name: 'Redes Sociais', desc: 'Mural de acompanhamento dos canais oficiais', icon: Layout },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#00A550]" />
            Gestor de Páginas & Page Builder Modular
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Adicione blocos, reorganize seções, edite conteúdos, visualize o resultado e restaure versões com segurança.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-2xs"
            title="Ver prévia da página antes de salvar"
          >
            <Eye className="w-4 h-4 text-stone-500" />
            <span>Visualizar</span>
          </button>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-2xs"
          >
            <History className="w-4 h-4 text-stone-500" />
            <span>Versões ({currentPage?.versions?.length || 1})</span>
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Rascunho</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-[#E1F200]" />
            <span>Publicar no Site</span>
          </button>
        </div>
      </div>

      {/* Page Info Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00A550] shrink-0">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                Página Ativa
              </span>
              <span
                className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                  currentPage?.status === 'publicado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentPage?.status === 'publicado' ? '● Publicado ao Vivo' : '○ Rascunho'}
              </span>
            </div>
            <h3 className="text-lg font-black text-stone-900">{currentPage?.title || 'Página Inicial (Home)'}</h3>
            <p className="text-xs text-stone-500">
              Total de blocos: {blocksDraft.length} ({blocksDraft.filter((b) => b.visible).length} visíveis,{' '}
              {blocksDraft.filter((b) => !b.visible).length} ocultos)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Novo Bloco</span>
        </button>
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1 uppercase tracking-wider">
          <span>Composição Estrutural da Página</span>
          <span>Ordem & Ações</span>
        </div>

        <div className="space-y-3">
          {blocksDraft.map((block, idx) => {
            const isVisible = block.visible !== false && (block as any).active !== false;

            return (
              <div
                key={block.id}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isVisible
                    ? 'border-stone-200 shadow-xs hover:border-stone-300'
                    : 'border-dashed border-stone-300 opacity-60 bg-stone-50'
                }`}
              >
                {/* Left: Reorder arrows & metadata */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Order control */}
                  <div className="flex sm:flex-col gap-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveBlock(idx, 'up')}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-25 text-stone-700 transition-colors"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === blocksDraft.length - 1}
                      onClick={() => moveBlock(idx, 'down')}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-25 text-stone-700 transition-colors"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-stone-400">#{block.order}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {block.type}
                      </span>
                      {!isVisible && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded">
                          Oculto no Site
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm leading-tight truncate">
                      {block.title || 'Bloco sem título'}
                    </h4>
                    {block.subtitle && (
                      <p className="text-xs text-stone-500 truncate mt-0.5">{block.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Edit Content Button */}
                  <button
                    onClick={() => setEditingBlock(block)}
                    className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                    title="Editar textos, imagem e botões deste bloco"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Editar Conteúdo</span>
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => toggleBlockActive(block.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                      isVisible
                        ? 'bg-emerald-50 text-[#00A550] border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                    }`}
                    title={isVisible ? 'Clique para ocultar este bloco no site' : 'Clique para exibir este bloco no site'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isVisible ? 'Visível' : 'Oculto'}</span>
                  </button>

                  {/* Delete Block */}
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Excluir este bloco"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unified Block Editor Form Modal */}
      {editingBlock && (
        <BlockEditorForm
          block={editingBlock}
          pageId={currentPage?.id || selectedPageId || 'page-home'}
          totalBlocksCount={blocksDraft.length}
          isSaving={isSaving}
          onSave={handleSaveBlockFromForm}
          onCancel={() => setEditingBlock(null)}
        />
      )}

      {/* Modal: Add New Block Palette */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00A550]" />
                  Adicionar Bloco à Página
                </h3>
                <p className="text-xs text-stone-500">Escolha o tipo de seção controlada que deseja incluir</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600 font-bold text-lg">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {blockTypePalette.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => addBlock(item.type, item.name)}
                    className="p-3.5 rounded-xl border border-stone-200 hover:border-[#00A550] hover:bg-emerald-50/40 text-left transition-all group flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-[#00A550] group-hover:text-white flex items-center justify-center text-stone-600 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs group-hover:text-[#00A550] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Live Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#E1F200]" />
                <h3 className="font-bold text-sm">Prévia da Página Inicial (Home)</h3>
                <span className="bg-[#00A550] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Modo Pré-visualização
                </span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-stone-400 hover:text-white font-bold"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-stone-50">
              <div className="text-center text-xs text-stone-500 border-b border-stone-200 pb-3">
                Abaixo está a ordem e os blocos ativos que serão exibidos aos visitantes do site:
              </div>

              {blocksDraft
                .filter((b) => b.visible)
                .map((b, i) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-400">#{i + 1}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#00A550] px-2 py-0.5 rounded">
                          {b.type}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400">{b.id}</span>
                    </div>

                    <h4 className="text-lg font-black text-stone-900">{b.title}</h4>
                    {b.subtitle && <p className="text-xs text-stone-600 font-medium">{b.subtitle}</p>}
                    {b.content?.text && (
                      <p className="text-xs text-stone-700 whitespace-pre-line mt-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                        {b.content.text}
                      </p>
                    )}
                    {b.content?.imageUrl && (
                      <img
                        src={b.content.imageUrl}
                        alt=""
                        className="w-full h-48 object-cover rounded-xl mt-2 border border-stone-200"
                      />
                    )}
                  </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Gostou do resultado? Clique em "Publicar no Site" para gravar.
              </span>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSave(true);
                }}
                className="flex items-center gap-1.5 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#E1F200]" />
                <span>Confirmar e Publicar Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Version History & Rollback */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <History className="w-5 h-5 text-[#00A550]" />
                Histórico de Versões da Página
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {currentPage?.versions && currentPage.versions.length > 0 ? (
                currentPage.versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-4 text-xs hover:border-stone-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 font-mono">
                          Versão #{ver.versionNumber}
                        </span>
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-600 font-medium">{ver.savedBy || 'Editor'}</span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        {new Date(ver.savedAt).toLocaleString('pt-BR')} ({ver.blocks?.length || 0} blocos)
                      </p>
                      {ver.note && <p className="text-stone-600 text-[11px] italic mt-1">{ver.note}</p>}
                    </div>

                    <button
                      onClick={() => handleRollback(ver)}
                      className="flex items-center gap-1 bg-stone-900 hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0"
                    >
                      <RotateCcw className="w-3 h-3 text-[#E1F200]" />
                      <span>Restaurar</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-stone-400 text-xs">
                  Nenhuma versão histórica arquivada ainda. As versões são geradas automaticamente a cada publicação.
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
