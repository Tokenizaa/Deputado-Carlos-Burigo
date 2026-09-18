import React, { useMemo, useState } from 'react';
import { Eye, FileText, Image as ImageIcon, Layout, Save, Send, X } from 'lucide-react';
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

type MediaKind = 'none' | 'image' | 'video';

export const BlockEditorForm: React.FC<BlockEditorFormProps> = ({ block, onSave, onCancel, isSaving = false }) => {
  const { media, videos, showToast } = useApp();
  const initial = block.content || {};
  const [title, setTitle] = useState(block.title || '');
  const [subtitle, setSubtitle] = useState(block.subtitle || '');
  const [visible, setVisible] = useState(block.visible !== false && block.active !== false);
  const [badge, setBadge] = useState(initial.badge || '');
  const [headline, setHeadline] = useState(initial.headline || block.title || '');
  const [text, setText] = useState(initial.text || initial.description || initial.leadText || '');
  const [buttonText, setButtonText] = useState(initial.buttonText || initial.ctaText || '');
  const [buttonLink, setButtonLink] = useState(initial.buttonLink || '');
  const [alignment, setAlignment] = useState(initial.alignment || 'left');
  const [imagePosition, setImagePosition] = useState(initial.imagePosition || 'right');
  const [mediaKind, setMediaKind] = useState<MediaKind>(initial.mediaType || (initial.videoUrl ? 'video' : initial.imageUrl ? 'image' : 'none'));
  const [mediaSource, setMediaSource] = useState<'library' | 'external'>(initial.mediaSource || 'library');
  const [mediaId, setMediaId] = useState(initial.mediaId || '');
  const initialLibraryMedia = media.find((item) => item.id === (initial.mediaId || ''));
  const initialLibraryVideo = videos.find((item) => item.id === (initial.mediaId || ''));
  const [mediaUrl, setMediaUrl] = useState(initial.mediaUrl || initial.imageUrl || initial.videoUrl || initialLibraryMedia?.url || initialLibraryVideo?.url || '');
  const [altText, setAltText] = useState(initial.altText || '');
  const [caption, setCaption] = useState(initial.caption || '');
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');

  const selectedMedia = useMemo(() => media.find((item) => item.id === mediaId), [media, mediaId]);
  const selectedVideo = useMemo(() => videos.find((item) => item.id === mediaId), [videos, mediaId]);

  const buildBlock = (): PageBlock => {
    const content: Record<string, any> = { ...initial, badge: badge.trim(), buttonText: buttonText.trim(), buttonLink: buttonLink.trim(), alignment, imagePosition };
    if (block.type === 'hero') {
      content.headline = headline.trim();
      content.leadText = text.trim();
    } else if (text.trim()) {
      content.text = text.trim();
      content.description = text.trim();
    }
    content.mediaType = mediaKind;
    content.mediaSource = mediaSource;
    content.mediaId = mediaKind === 'none' ? undefined : mediaId || undefined;
    content.mediaUrl = mediaKind === 'none' ? undefined : mediaUrl.trim() || undefined;
    content.altText = altText.trim() || title.trim();
    content.caption = caption.trim();
    if (mediaKind === 'image') content.imageUrl = mediaUrl.trim();
    if (mediaKind === 'video') content.videoUrl = mediaUrl.trim();
    return { ...block, title: title.trim(), subtitle: subtitle.trim(), visible, active: visible, content };
  };

  const submit = async (commit: boolean) => {
    if (!title.trim()) { showToast('Informe o título do bloco.', 'error'); return; }
    const result = await onSave(buildBlock(), commit);
    if (result && !result.success) showToast(result.error || 'Falha ao salvar bloco.', 'error');
  };

  const icon = block.type === 'hero' ? <Layout className="w-5 h-5" /> : mediaKind === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        <header className="p-4 border-b flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00A550] flex items-center justify-center">{icon}</div><div><div className="text-[10px] uppercase font-black text-emerald-700">Bloco · {block.type}</div><h3 className="font-black text-lg">Editar componente</h3></div></div>
          <div className="flex items-center gap-2"><div className="bg-stone-200 p-1 rounded-lg"><button onClick={() => setTab('editor')} className={`px-3 py-1.5 text-xs font-bold rounded-md ${tab === 'editor' ? 'bg-white' : ''}`}>Editar</button><button onClick={() => setTab('preview')} className={`px-3 py-1.5 text-xs font-bold rounded-md ${tab === 'preview' ? 'bg-white' : ''}`}><Eye className="inline w-3 h-3 mr-1" />Prévia</button></div><button onClick={onCancel} className="p-2 hover:bg-stone-200 rounded-lg"><X className="w-5 h-5" /></button></div>
        </header>
        {tab === 'editor' ? (
          <div className="overflow-y-auto p-5 space-y-5">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label className="label">Título do bloco</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="field" /></div><div><label className="label">Subtítulo / linha de apoio</label><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="field" /></div></section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label className="label">Badge / etiqueta</label><input value={badge} onChange={(e) => setBadge(e.target.value)} className="field" placeholder="Ex.: Campanha, Editorial, Destaque" /></div><label className="flex items-center gap-2 border rounded-xl px-3 mt-5 md:mt-0"><input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /><span className="text-xs font-bold">Visível no site</span></label></section>
            {block.type === 'hero' && <div><label className="label">Manchete do Hero</label><input value={headline} onChange={(e) => setHeadline(e.target.value)} className="field" /></div>}
            <div><label className="label">Texto / conteúdo editorial</label><textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="field" placeholder="Todo o texto editável deste componente fica aqui." /></div>
            <section className="border border-stone-200 rounded-2xl p-4 space-y-4"><div><div className="font-black text-sm">Mídia do componente</div><div className="text-[10px] text-stone-500 mt-1">A mesma interface permite imagem, vídeo ou nenhuma mídia.</div></div><div className="grid grid-cols-3 gap-2">{(['none','image','video'] as MediaKind[]).map((kind) => <button key={kind} type="button" onClick={() => { setMediaKind(kind); setMediaId(''); setMediaUrl(''); }} className={`py-2 rounded-lg border text-xs font-bold ${mediaKind === kind ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-stone-200'}`}>{kind === 'none' ? 'Sem mídia' : kind === 'image' ? 'Imagem' : 'Vídeo'}</button>)}</div>{mediaKind !== 'none' && <><div className="flex gap-2"><button type="button" onClick={() => setMediaSource('library')} className={`px-3 py-2 rounded-lg text-xs font-bold ${mediaSource === 'library' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}>Biblioteca</button><button type="button" onClick={() => setMediaSource('external')} className={`px-3 py-2 rounded-lg text-xs font-bold ${mediaSource === 'external' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}>URL externa</button></div>{mediaSource === 'library' ? (mediaKind === 'image' ? <select value={mediaId} onChange={(e) => { const item = media.find((m) => m.id === e.target.value); setMediaId(e.target.value); setMediaUrl(item?.url || ''); setAltText(item?.altText || ''); }} className="field"><option value="">Selecione uma imagem da biblioteca</option>{media.filter((item) => item.mimeType?.startsWith('image/')).map((item) => <option key={item.id} value={item.id}>{item.title || item.name}</option>)}</select> : <select value={mediaId} onChange={(e) => { const item = videos.find((v) => v.id === e.target.value); setMediaId(e.target.value); setMediaUrl(item?.url || ''); }} className="field"><option value="">Selecione um vídeo do acervo</option>{videos.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select>) : <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="field" placeholder={mediaKind === 'image' ? 'https://...' : 'https://youtube.com/...'} />}{mediaKind === 'image' && <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label className="label">Texto alternativo</label><input value={altText} onChange={(e) => setAltText(e.target.value)} className="field" /></div><div><label className="label">Legenda / crédito</label><input value={caption} onChange={(e) => setCaption(e.target.value)} className="field" /></div></div>}{mediaKind === 'image' && mediaUrl && <div className="space-y-2"><img src={mediaUrl} alt={altText || title} className="w-full max-h-56 object-cover rounded-xl border" /><div className="text-[10px] text-stone-500 break-all">Fonte: {mediaId ? (selectedMedia?.title || selectedMedia?.name || 'Biblioteca de mídia') : 'URL externa'}</div></div>}{mediaKind === 'video' && mediaUrl && <div className="bg-stone-900 text-white rounded-xl p-4 text-xs break-all">Vídeo selecionado: {selectedVideo?.title || mediaUrl}</div>}{selectedMedia && mediaKind === 'image' && <div className="text-[10px] text-stone-500">Fonte: {selectedMedia.sourceName || selectedMedia.title}</div>}</>}</section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3"><div><label className="label">CTA</label><input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="field" placeholder="Saiba mais" /></div><div><label className="label">Link</label><input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} className="field" placeholder="/contato" /></div><div><label className="label">Alinhamento</label><select value={alignment} onChange={(e) => setAlignment(e.target.value)} className="field"><option value="left">Esquerda</option><option value="center">Centro</option></select></div></section>
            {block.type === 'text_image' && <div><label className="label">Posição da mídia</label><select value={imagePosition} onChange={(e) => setImagePosition(e.target.value)} className="field"><option value="left">Esquerda</option><option value="right">Direita</option></select></div>}
          </div>
        ) : (
          <div className="overflow-y-auto p-6"><div className="border rounded-2xl p-6 space-y-3"><div className="text-[10px] uppercase font-black text-emerald-700">Prévia do componente</div><h3 className="text-2xl font-black">{title || 'Título'}</h3>{subtitle && <p className="text-stone-500">{subtitle}</p>}{badge && <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">{badge}</span>}{block.type === 'hero' && headline && <div className="text-lg font-black">{headline}</div>}{text && <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700">{text}</p>}{mediaKind === 'image' && mediaUrl && <img src={mediaUrl} alt={altText || title} className="w-full max-h-72 object-cover rounded-xl" />}{mediaKind === 'video' && mediaUrl && <div className="aspect-video rounded-xl bg-stone-900 text-white flex items-center justify-center text-sm">Vídeo · {selectedVideo?.title || mediaUrl}</div>}{buttonText && <span className="inline-flex bg-[#00A550] text-white px-4 py-2 rounded-lg text-xs font-bold">{buttonText}</span>}</div></div>
        )}
        <footer className="p-4 border-t bg-stone-50 flex justify-end gap-2"><button type="button" onClick={onCancel} className="action">Cancelar</button><button type="button" disabled={isSaving} onClick={() => submit(false)} className="action"><Save className="w-4 h-4" /> Salvar no rascunho</button><button type="button" disabled={isSaving} onClick={() => submit(true)} className="action-primary"><Send className="w-4 h-4" /> Gravar no servidor</button></footer>
      </div>
      <style>{`.label{display:block;font-size:10px;font-weight:800;text-transform:uppercase;color:#57534e;margin-bottom:4px}.field{width:100%;border:1px solid #e7e5e4;border-radius:12px;padding:9px 10px;font-size:12px;outline:none;background:#fff}.field:focus{border-color:#00A550}.action,.action-primary{display:inline-flex;align-items:center;gap:6px;border-radius:10px;padding:9px 12px;font-size:11px;font-weight:800}.action{border:1px solid #d6d3d1;background:#fff;color:#44403c}.action-primary{border:1px solid #00A550;background:#00A550;color:#fff}`}</style>
    </div>
  );
};
