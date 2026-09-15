import React, { useState } from 'react';
import {
  Save,
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  Eye,
  ImageIcon,
  Layout,
  FileText,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
} from 'lucide-react';
import { PageBlock } from '../../types';
import { useApp } from '../../context/AppContext';

export interface BlockEditorFormProps {
  block: PageBlock;
  pageId: string;
  totalBlocksCount: number;
  onSave: (updatedBlock: PageBlock, commitToBackend?: boolean) => Promise<{ success: boolean; error?: string } | void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export const BlockEditorForm: React.FC<BlockEditorFormProps> = ({
  block,
  pageId,
  totalBlocksCount,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const { showToast } = useApp();

  // Core required fields
  const [title, setTitle] = useState(block.title || '');
  const [subtitle, setSubtitle] = useState(block.subtitle || '');
  const [order, setOrder] = useState<number | string>(block.order ?? 1);
  const [visible, setVisible] = useState<boolean>(block.visible !== false && (block as any).active !== false);

  // Block-specific content state
  const initialContent = block.content || {};
  const [headline, setHeadline] = useState(initialContent.headline || block.title || '');
  const [highlightPhrase, setHighlightPhrase] = useState(initialContent.highlightPhrase || block.subtitle || '');
  const [leadText, setLeadText] = useState(initialContent.leadText || initialContent.text || initialContent.description || '');
  const [badge, setBadge] = useState(initialContent.badge || '');
  const [text, setText] = useState(initialContent.text || initialContent.description || '');
  const [imageUrl, setImageUrl] = useState(initialContent.imageUrl || '');
  const [altText, setAltText] = useState(initialContent.altText || '');
  const [caption, setCaption] = useState(initialContent.caption || '');
  const [buttonText, setButtonText] = useState(initialContent.buttonText || initialContent.ctaText || '');
  const [buttonLink, setButtonLink] = useState(initialContent.buttonLink || '');
  const [secondaryButtonText, setSecondaryButtonText] = useState(initialContent.secondaryButtonText || '');
  const [secondaryButtonLink, setSecondaryButtonLink] = useState(initialContent.secondaryButtonLink || '');
  const [imagePosition, setImagePosition] = useState<'left' | 'right'>(initialContent.imagePosition || 'right');
  const [alignment, setAlignment] = useState<'left' | 'center'>(initialContent.alignment || 'left');

  // Validation & feedback state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};

    // 1. Required field: title
    if (!title.trim()) {
      errs.title = 'O título do bloco é obrigatório.';
    } else if (title.trim().length < 2) {
      errs.title = 'O título deve conter pelo menos 2 caracteres.';
    }

    // 2. Required field: order
    const orderNum = Number(order);
    if (order === '' || isNaN(orderNum)) {
      errs.order = 'A ordem de exibição é obrigatória e deve ser um número.';
    } else if (orderNum < 1) {
      errs.order = 'A ordem de exibição deve ser maior ou igual a 1.';
    }

    // 3. Type-specific validations
    if (block.type === 'image') {
      if (!imageUrl.trim()) {
        errs.imageUrl = 'A URL da imagem é obrigatória para blocos de imagem / banner.';
      }
    }

    if (block.type === 'text') {
      if (!text.trim()) {
        errs.text = 'O texto editorial da seção não pode estar em branco.';
      }
    }

    if (block.type === 'hero') {
      if (!headline.trim()) {
        errs.headline = 'O nome principal / manchete do Hero é obrigatório.';
      }
    }

    return errs;
  };

  const buildUpdatedBlock = (): PageBlock => {
    // Preserve existing extra keys in content while updating the specific ones
    const mergedContent: Record<string, any> = {
      ...(block.content || {}),
    };

    if (block.type === 'hero') {
      mergedContent.headline = headline.trim();
      mergedContent.highlightPhrase = highlightPhrase.trim();
      mergedContent.leadText = leadText.trim();
      mergedContent.badge = badge.trim();
      if (imageUrl.trim()) mergedContent.imageUrl = imageUrl.trim();
      if (buttonText.trim()) mergedContent.buttonText = buttonText.trim();
      if (buttonLink.trim()) mergedContent.buttonLink = buttonLink.trim();
      if (secondaryButtonText.trim()) mergedContent.secondaryButtonText = secondaryButtonText.trim();
      if (secondaryButtonLink.trim()) mergedContent.secondaryButtonLink = secondaryButtonLink.trim();
    } else if (block.type === 'text') {
      mergedContent.badge = badge.trim();
      mergedContent.text = text.trim();
      mergedContent.description = text.trim();
      mergedContent.alignment = alignment;
    } else if (block.type === 'image') {
      mergedContent.imageUrl = imageUrl.trim();
      mergedContent.altText = altText.trim() || title.trim();
      mergedContent.caption = caption.trim();
      if (buttonLink.trim()) mergedContent.link = buttonLink.trim();
    } else if (block.type === 'text_image') {
      mergedContent.badge = badge.trim();
      mergedContent.text = text.trim();
      mergedContent.description = text.trim();
      mergedContent.imageUrl = imageUrl.trim();
      mergedContent.imagePosition = imagePosition;
      mergedContent.buttonText = buttonText.trim();
      mergedContent.buttonLink = buttonLink.trim();
    } else {
      // General blocks (trajectory, projects, results, news, agenda, municipalities, videos, etc.)
      if (badge.trim()) mergedContent.badge = badge.trim();
      if (text.trim()) {
        mergedContent.text = text.trim();
        mergedContent.description = text.trim();
      }
      if (imageUrl.trim()) mergedContent.imageUrl = imageUrl.trim();
      if (buttonText.trim()) {
        mergedContent.buttonText = buttonText.trim();
        mergedContent.ctaText = buttonText.trim();
      }
      if (buttonLink.trim()) mergedContent.buttonLink = buttonLink.trim();
    }

    return {
      ...block,
      title: title.trim(),
      subtitle: subtitle.trim(),
      order: Number(order),
      visible,
      active: visible,
      content: mergedContent,
    };
  };

  const handleSubmit = async (e: React.FormEvent, commitToBackend = false) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.warn('[BlockEditorForm] Validation failed:', validationErrors);
      setErrors(validationErrors);
      showToast('Por favor, preencha os campos obrigatórios destacados em vermelho.', 'error');
      return;
    }

    setErrors({});
    const updatedBlock = buildUpdatedBlock();
    console.log('[BlockEditorForm] Submitting valid block update:', {
      blockId: updatedBlock.id,
      type: updatedBlock.type,
      title: updatedBlock.title,
      order: updatedBlock.order,
      visible: updatedBlock.visible,
      commitToBackend,
    });

    try {
      const result = await onSave(updatedBlock, commitToBackend);
      if (result && !result.success) {
        setServerError(result.error || 'Falha ao salvar o bloco.');
      }
    } catch (err: any) {
      console.error('[BlockEditorForm] Unexpected error while saving block:', err);
      const msg = err?.message || 'Erro inesperado ao salvar alterações do bloco.';
      setServerError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div
      id={`block-editor-modal-${block.id}`}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[#00A550] shadow-xs">
              {block.type === 'hero' ? (
                <Layout className="w-5 h-5" />
              ) : block.type === 'image' ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00A550] bg-white border border-emerald-200 px-2 py-0.5 rounded-md">
                  Bloco: {block.type}
                </span>
                <span className="text-xs text-stone-400 font-mono">#{block.id}</span>
              </div>
              <h3 className="text-lg font-black text-stone-900 leading-tight mt-0.5">
                Editar {block.type === 'hero' ? 'Hero Principal' : block.type === 'image' ? 'Imagem / Banner' : 'Bloco de Conteúdo'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch between Editor and Live Preview */}
            <div className="bg-stone-200 p-1 rounded-xl flex items-center text-xs font-bold text-stone-600">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'form' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                Formulário
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-white text-[#00A550] shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Prévia</span>
              </button>
            </div>

            <button
              onClick={onCancel}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
              title="Fechar editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Server Error Alert Banner */}
        {serverError && (
          <div className="bg-rose-50 border-b border-rose-200 p-3.5 px-5 flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-900">Não foi possível salvar as alterações no servidor:</p>
              <p className="mt-0.5">{serverError}</p>
            </div>
            <button onClick={() => setServerError(null)} className="text-rose-500 hover:text-rose-800 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="flex-1 overflow-y-auto max-h-[70vh] p-5 sm:p-6 space-y-6">
          {activeTab === 'form' ? (
            <div className="space-y-5">
              {/* Common Required Section: Title, Order & Visibility */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                <div className="text-[11px] font-black uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00A550]" />
                  <span>Configurações Estruturais do Bloco</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Title (Required) */}
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      Título da Seção <span className="text-rose-600 font-black">*</span>
                    </label>
                    <input
                      id="input-block-title"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                      }}
                      placeholder="Ex.: Projetos e Leis com Impacto Real"
                      className={`w-full bg-white border ${
                        errors.title ? 'border-rose-500 ring-2 ring-rose-200' : 'border-stone-200'
                      } rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550] transition-all`}
                    />
                    {errors.title && (
                      <p className="text-rose-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Order (Required) */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      Ordem de Exibição <span className="text-rose-600 font-black">*</span>
                    </label>
                    <input
                      id="input-block-order"
                      type="number"
                      min={1}
                      max={99}
                      value={order}
                      onChange={(e) => {
                        setOrder(e.target.value);
                        if (errors.order) setErrors((prev) => ({ ...prev, order: '' }));
                      }}
                      className={`w-full bg-white border ${
                        errors.order ? 'border-rose-500 ring-2 ring-rose-200' : 'border-stone-200'
                      } rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550] transition-all`}
                    />
                    {errors.order && (
                      <p className="text-rose-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.order}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subtitle & Visibility */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      Subtítulo / Linha de Apoio (Opcional)
                    </label>
                    <input
                      id="input-block-subtitle"
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Linha de apoio explicativa abaixo do título"
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                    />
                  </div>

                  <div className="sm:col-span-4 pt-1 sm:pt-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-white border border-stone-200 p-2.5 rounded-xl hover:border-stone-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={(e) => setVisible(e.target.checked)}
                        className="w-4 h-4 text-[#00A550] rounded focus:ring-emerald-500 accent-[#00A550]"
                      />
                      <span className="text-xs font-bold text-stone-800">
                        {visible ? 'Visível no Site' : 'Oculto'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SPECIFIC BLOCK EDITOR: HERO */}
              {block.type === 'hero' && (
                <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 space-y-4">
                  <div className="text-[11px] font-black uppercase text-[#00A550] tracking-wider flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-[#00A550]" />
                    <span>Conteúdo Específico do Hero Principal</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      Nome em Destaque / Manchete Principal <span className="text-rose-600 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => {
                        setHeadline(e.target.value);
                        if (errors.headline) setErrors((prev) => ({ ...prev, headline: '' }));
                      }}
                      placeholder="Ex.: CARLOS BÚRIGO"
                      className={`w-full bg-white border ${
                        errors.headline ? 'border-rose-500 ring-2 ring-rose-200' : 'border-stone-200'
                      } rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-[#00A550]`}
                    />
                    {errors.headline && (
                      <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.headline}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      Frase de Destaque / Slogan Principal
                    </label>
                    <input
                      type="text"
                      value={highlightPhrase}
                      onChange={(e) => setHighlightPhrase(e.target.value)}
                      placeholder="Ex.: Trabalho sério, presença e resultados para o Rio Grande"
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      Texto de Apresentação / Lead Institucional
                    </label>
                    <textarea
                      rows={3}
                      value={leadText}
                      onChange={(e) => setLeadText(e.target.value)}
                      placeholder="Apresentação com trajetória, cargos ocupados e foco da atuação..."
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      URL da Foto Oficial de Retrato (Hero)
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                        Texto do Botão Principal (CTA)
                      </label>
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Ex.: Conheça a Atuação e Projetos"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                        Link do Botão Principal
                      </label>
                      <input
                        type="text"
                        value={buttonLink}
                        onChange={(e) => setButtonLink(e.target.value)}
                        placeholder="Ex.: /?view=atuacao"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC BLOCK EDITOR: TEXT */}
              {block.type === 'text' && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                  <div className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#00A550]" />
                    <span>Conteúdo Editorial / Texto Livre</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                        Tag / Badge Superior (Ex.: Editorial, Opinião, Artigo)
                      </label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="Ex.: Mensagem do Parlamentar"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                        Alinhamento do Texto
                      </label>
                      <div className="flex border border-stone-200 rounded-xl bg-white p-1">
                        <button
                          type="button"
                          onClick={() => setAlignment('left')}
                          className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-bold ${
                            alignment === 'left' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          <AlignLeft className="w-3.5 h-3.5 mr-1" /> Esquerda
                        </button>
                        <button
                          type="button"
                          onClick={() => setAlignment('center')}
                          className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-bold ${
                            alignment === 'center' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          <AlignCenter className="w-3.5 h-3.5 mr-1" /> Centro
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      Texto Principal <span className="text-rose-600 font-black">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        if (errors.text) setErrors((prev) => ({ ...prev, text: '' }));
                      }}
                      placeholder="Escreva os parágrafos informativos..."
                      className={`w-full bg-white border ${
                        errors.text ? 'border-rose-500 ring-2 ring-rose-200' : 'border-stone-200'
                      } rounded-xl p-3 text-xs text-stone-900 leading-relaxed focus:outline-none focus:border-[#00A550]`}
                    />
                    {errors.text && (
                      <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.text}</p>
                    )}
                  </div>
                </div>
              )}

              {/* SPECIFIC BLOCK EDITOR: IMAGE / BANNER */}
              {block.type === 'image' && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                  <div className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#00A550]" />
                    <span>Configurações do Banner / Imagem</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                      URL da Imagem <span className="text-rose-600 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: '' }));
                      }}
                      placeholder="https://images.unsplash.com/... ou /uploads/..."
                      className={`w-full bg-white border ${
                        errors.imageUrl ? 'border-rose-500 ring-2 ring-rose-200' : 'border-stone-200'
                      } rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]`}
                    />
                    {errors.imageUrl && (
                      <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.imageUrl}</p>
                    )}
                  </div>

                  {imageUrl && (
                    <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-100 max-h-48 relative">
                      <img
                        src={imageUrl}
                        alt="Prévia da Imagem"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="absolute bottom-2 right-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        Prévia ao vivo
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                        Texto Alternativo (Acessibilidade)
                      </label>
                      <input
                        type="text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Descrição da imagem para leitores de tela"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">
                        Link ao Clicar (Opcional)
                      </label>
                      <input
                        type="text"
                        value={buttonLink}
                        onChange={(e) => setButtonLink(e.target.value)}
                        placeholder="Ex.: /?view=noticias ou https://..."
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC BLOCK EDITOR: TEXT + IMAGE */}
              {block.type === 'text_image' && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                  <div className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#00A550]" />
                    <span>Texto com Imagem Lateral</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Badge / Categoria</label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="Ex.: Trajetória"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Posição da Imagem</label>
                      <select
                        value={imagePosition}
                        onChange={(e) => setImagePosition(e.target.value as any)}
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      >
                        <option value="right">Direita</option>
                        <option value="left">Esquerda</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Texto Descritivo</label>
                    <textarea
                      rows={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Insira o texto descritivo..."
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">URL da Imagem Lateral</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Texto do Botão CTA</label>
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Ex.: Saiba Mais"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Link do Botão CTA</label>
                      <input
                        type="text"
                        value={buttonLink}
                        onChange={(e) => setButtonLink(e.target.value)}
                        placeholder="Ex.: /?view=atuacao"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* OTHER DEFAULT BLOCK TYPES (trajectory, projects, results, news, agenda, municipalities, videos, citizen_cta, contact) */}
              {!['hero', 'text', 'image', 'text_image'].includes(block.type) && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                  <div className="text-[11px] font-black uppercase text-stone-600 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00A550]" />
                    <span>Personalização da Seção Dinâmica ({block.type})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Badge / Tag Superior</label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="Ex.: Na Assembleia, Prestação de Contas, etc."
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Texto do Botão CTA</label>
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Ex.: Ver Todos"
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase mb-1">Texto Descritivo ou Instruções</label>
                    <textarea
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Texto institucional de apoio da seção..."
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#00A550]"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live Preview Tab */
            <div className="space-y-4">
              <div className="text-xs text-stone-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#00A550]" />
                <span>Esta é a simulação de como o bloco será exibido na página inicial:</span>
              </div>

              <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-[#00A550] px-2 py-0.5 rounded">
                    {block.type} • Ordem #{order}
                  </span>
                  <span className={`text-[11px] font-bold ${visible ? 'text-emerald-700' : 'text-stone-400'}`}>
                    {visible ? '● Ativo no Site' : '○ Oculto'}
                  </span>
                </div>

                {badge && (
                  <span className="inline-block text-[11px] font-black uppercase text-[#00A550] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}

                <h4 className="text-xl font-black text-stone-900">{title || 'Título da Seção'}</h4>
                {subtitle && <p className="text-xs text-stone-600 font-medium">{subtitle}</p>}

                {block.type === 'hero' && (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mt-2 space-y-2">
                    <p className="text-sm font-black text-stone-950 uppercase">{headline || 'CARLOS BÚRIGO'}</p>
                    <p className="text-xs text-stone-600 italic">"{highlightPhrase || 'Slogan principal...'}"</p>
                    {leadText && <p className="text-xs text-stone-700 mt-1">{leadText}</p>}
                    {buttonText && (
                      <div className="pt-2">
                        <span className="inline-block bg-[#00A550] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs">
                          {buttonText}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'text' && text && (
                  <p
                    className={`text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100 whitespace-pre-line ${
                      alignment === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {text}
                  </p>
                )}

                {(block.type === 'image' || block.type === 'text_image') && imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-stone-200 max-h-48 mt-2">
                    <img src={imageUrl} alt="" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 order-2 sm:order-1">
            {Object.keys(errors).length > 0 ? (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Corrija os erros antes de salvar
              </span>
            ) : (
              <span>Campos com * são obrigatórios para gravação.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end order-1 sm:order-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200/60 font-bold text-xs transition-colors"
            >
              Cancelar
            </button>

            {/* Save to Local Draft Button */}
            <button
              type="button"
              disabled={isSaving}
              onClick={(e) => handleSubmit(e, false)}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-[#E1F200]" />
              <span>Salvar no Rascunho</span>
            </button>

            {/* Direct Save & Commit to Server Button */}
            <button
              type="button"
              disabled={isSaving}
              onClick={(e) => handleSubmit(e, true)}
              className="px-5 py-2.5 rounded-xl bg-[#00A550] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#E1F200]" />
              <span>{isSaving ? 'Gravando...' : 'Gravar no Servidor'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
