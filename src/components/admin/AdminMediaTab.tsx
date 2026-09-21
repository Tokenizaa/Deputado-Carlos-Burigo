import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Image as ImageIcon, Upload, Copy, Trash2, Check, User, Tag } from 'lucide-react';
import { MediaItem } from '../../types';
import { AdminAssetInput } from './AdminAssetInput';

export const AdminMediaTab: React.FC = () => {
  const { media, currentUser, refreshAllData, showToast } = useApp();

  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todas');

  // Form for new media item
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [photographer, setPhotographer] = useState('Comunicação Carlos Búrigo');
  const [category, setCategory] = useState('Gabinete');
  const [url, setUrl] = useState('');

  const categories = ['todas', 'Gabinete', 'Assembleia Legislativa', 'Eventos e Interior', 'Institucional'];

  const filtered = selectedCategory === 'todas'
    ? media
    : media.filter((m) => m.category === selectedCategory);

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setUploading(true);
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          title,
          altText,
          photographer,
          category,
          url,
        }),
      });

      if (res.ok) {
        showToast('Mídia adicionada com sucesso!', 'success');
        await refreshAllData();
        setTitle('');
        setAltText('');
        setUrl('');
      } else {
        showToast('Erro ao salvar mídia', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (mediaUrl: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mediaUrl);
      showToast('Link da imagem copiado!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Biblioteca de Mídia & Acervo Fotográfico
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          Gerencie fotografias oficiais de discursos, eventos na Serra Gaúcha e vistorias técnicas com metadados e acessibilidade.
        </p>
      </div>

      {/* Upload / Add Media Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#00A550]" />
          Cadastrar Nova Foto no Acervo
        </h3>

        <form onSubmit={handleCreateMedia} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Título da Imagem *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Discurso na tribuna sobre o PL da Silvicultura"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <AdminAssetInput
              value={url}
              onChange={setUrl}
              accept="image/jpeg,image/png,image/webp,image/gif"
              label="Imagem *"
              hint="Você pode fazer upload da foto ou usar uma URL externa."
            />

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Texto Alternativo de Acessibilidade (Alt Text) *
              </label>
              <input
                type="text"
                required
                placeholder="Descrição acessível para leitores de tela"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Créditos do Fotógrafo
              </label>
              <input
                type="text"
                placeholder="Nome do fotógrafo ou agência"
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">Categoria:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 font-medium"
              >
                <option value="Gabinete">Gabinete</option>
                <option value="Assembleia Legislativa">Assembleia Legislativa</option>
                <option value="Eventos e Interior">Eventos e Interior</option>
                <option value="Institucional">Institucional</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-[#00A550] hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Adicionando...' : 'Adicionar ao Acervo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === c
                ? 'bg-[#00A550] text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {c === 'todas' ? 'Todas as Categorias' : c}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:border-[#00A550] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="aspect-4/3 bg-stone-100 overflow-hidden relative group">
                <img
                  src={item.url}
                  alt={item.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => copyUrl(item.url)}
                  className="absolute bottom-2 right-2 bg-black/80 hover:bg-black text-white p-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold"
                  title="Copiar URL da imagem"
                >
                  <Copy className="w-3 h-3 text-[#E1F200]" />
                  <span>Copiar</span>
                </button>
              </div>

              <div className="p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#00A550] bg-emerald-50 px-1.5 py-0.5 rounded">
                  {item.category}
                </span>
                <h4 className="font-bold text-stone-900 text-xs line-clamp-1 mt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  Foto: {item.photographer || 'Acervo'}
                </p>
              </div>
            </div>

            <div className="p-3.5 pt-0 text-[11px] text-stone-400 border-t border-stone-100 mt-1 flex items-center justify-between">
              <span>{new Date(item.uploadedAt).toLocaleDateString('pt-BR')}</span>
              <button
                onClick={() => copyUrl(item.url)}
                className="text-[#00A550] font-bold hover:underline"
              >
                Copiar URL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
