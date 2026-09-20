import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, Plus, Edit2, Trash2, ExternalLink, Star, Play } from 'lucide-react';
import { VideoItem } from '../../types';
import { getSupabaseClient } from '../../lib/supabaseClient';

export const AdminVideosTab: React.FC = () => {
  const { videos, refreshAllData, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<'YouTube' | 'Instagram' | 'Facebook' | 'Externo'>('YouTube');
  const [category, setCategory] = useState('Discurso em Plenário');
  const [thumbnail, setThumbnail] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openNewModal = () => {
    setEditingVideo(null);
    setTitle('');
    setDescription('');
    setUrl('');
    setPlatform('YouTube');
    setCategory('Discurso em Plenário');
    setThumbnail('');
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (v: VideoItem) => {
    setEditingVideo(v);
    setTitle(v.title);
    setDescription(v.description);
    setUrl(v.url);
    setPlatform(v.platform);
    setCategory(v.category);
    setThumbnail(v.thumbnail);
    setFeatured(v.featured);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await (await getSupabaseClient()).auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) { showToast('Sessão expirada. Entre novamente.', 'error'); return; }
      const payload = {
        title,
        description,
        url,
        platform,
        category,
        thumbnail,
        featured,
        date: new Date().toISOString().split('T')[0],
        status: 'ativo',
      };

      const urlPath = editingVideo ? `/api/videos/${editingVideo.id}` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';

      const res = await fetch(urlPath, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingVideo ? 'Vídeo atualizado com sucesso!' : 'Vídeo cadastrado com sucesso!', 'success');
        await refreshAllData();
        setModalOpen(false);
      } else {
        const err = await res.json();
        showToast(err.error || 'Erro ao salvar vídeo', 'error');
      }
    } catch {
      showToast('Erro de conexão ao salvar vídeo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo?')) return;
    try {
      const { data: sessionData } = await (await getSupabaseClient()).auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) { showToast('Sessão expirada. Entre novamente.', 'error'); return; }
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        showToast('Vídeo removido.', 'success');
        await refreshAllData();
      } else {
        showToast('Erro ao remover vídeo.', 'error');
      }
    } catch {
      showToast('Erro de conexão.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Video className="w-6 h-6 text-[#00A550]" />
            Gestor de Vídeos & Pronunciamentos
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Adicione e organize vídeos do YouTube, Instagram e Facebook com miniaturas e status de destaque.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Vídeo</span>
        </button>
      </div>

      {/* Grid of Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
            <div className="relative aspect-video bg-stone-900">
              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#00A550]/90 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>
              <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {vid.platform}
              </span>
              {vid.featured && (
                <span className="absolute top-2 right-2 bg-[#E1F200] text-stone-950 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Destaque
                </span>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A550] bg-emerald-50 px-2 py-0.5 rounded">
                  {vid.category}
                </span>
                <h3 className="font-bold text-stone-900 text-sm mt-1.5 line-clamp-2 leading-snug">{vid.title}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">{vid.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Assistir</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(vid)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-black text-stone-900">
                {editingVideo ? 'Editar Vídeo' : 'Novo Vídeo'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Título do Vídeo</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:bg-white focus:border-[#00A550]"
                  placeholder="Ex.: Discurso em defesa da Silvicultura na ALRS"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">URL do Vídeo</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:bg-white focus:border-[#00A550]"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Plataforma</label>
                  <select
                    value={platform}
                    onChange={(e: any) => setPlatform(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Externo">Externo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">URL da Imagem / Thumbnail</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="feat-vid"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-stone-300 text-[#00A550] focus:ring-[#00A550]"
                />
                <label htmlFor="feat-vid" className="font-bold text-stone-700 cursor-pointer">
                  Destacar na página inicial do site
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#00A550] hover:bg-emerald-700 text-white font-bold"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
