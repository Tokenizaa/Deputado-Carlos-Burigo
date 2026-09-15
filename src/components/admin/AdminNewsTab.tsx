import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, Eye, Calendar, MapPin, Check, Save } from 'lucide-react';
import { News, NewsCategory } from '../../types';

export const AdminNewsTab: React.FC = () => {
  const { news, currentUser, refreshAllData, showToast } = useApp();
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsCategory>('Atuação Parlamentar');
  const [municipality, setMunicipality] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'rascunho' | 'publicado'>('publicado');
  const [saving, setSaving] = useState(false);

  const categories: NewsCategory[] = [
    'Atuação Parlamentar',
    'Projetos de Lei',
    'Recursos & Municípios',
    'Posicionamentos',
    'Agricultura & Silvicultura',
    'Educação',
    'Saúde',
    'Infraestrutura',
  ];

  const startCreate = () => {
    setIsCreating(true);
    setEditingNews(null);
    setTitle('');
    setCategory('Atuação Parlamentar');
    setMunicipality('');
    setSummary('');
    setContent('');
    setMainImage('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
    setFeatured(false);
    setStatus('publicado');
  };

  const startEdit = (item: News) => {
    setEditingNews(item);
    setIsCreating(false);
    setTitle(item.title);
    setCategory(item.category);
    setMunicipality(item.municipality || '');
    setSummary(item.summary);
    setContent(item.content);
    setMainImage(item.mainImage);
    setFeatured(item.featured);
    setStatus(item.status);
  };

  const cancelEdit = () => {
    setEditingNews(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingNews ? `/api/news/${editingNews.id}` : '/api/news';
      const method = editingNews ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          title,
          category,
          municipality: municipality || undefined,
          summary,
          content,
          mainImage,
          featured,
          status,
          author: currentUser.name,
        }),
      });

      if (res.ok) {
        showToast(
          editingNews ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!',
          'success'
        );
        await refreshAllData();
        cancelEdit();
      } else {
        const err = await res.json();
        showToast(err.error || 'Erro ao salvar notícia', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão com o servidor', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta notícia?')) return;
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id },
      });
      if (res.ok) {
        showToast('Notícia removida com sucesso.', 'success');
        await refreshAllData();
      } else {
        showToast('Erro ao remover notícia.', 'error');
      }
    } catch (err) {
      showToast('Erro de comunicação.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Gestão de Notícias & Imprensa
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Publique artigos, posicionamentos e comunicados oficiais do gabinete.
          </p>
        </div>

        {!isCreating && !editingNews && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Notícia</span>
          </button>
        )}
      </div>

      {/* Editor Form Modal or Block */}
      {(isCreating || editingNews) && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-stone-900 text-base">
              {editingNews ? 'Editar Notícia' : 'Cadastrar Nova Notícia'}
            </h3>
            <button
              onClick={cancelEdit}
              className="text-xs text-stone-500 hover:text-stone-800 font-bold"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Título da Notícia *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: Carlos Búrigo defende ampliação de recursos para hospitais da Serra"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NewsCategory)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Município Relacionado (Opcional)
                </label>
                <input
                  type="text"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: Caxias do Sul"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  URL da Imagem Principal
                </label>
                <input
                  type="url"
                  required
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Status de Publicação
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'rascunho' | 'publicado')}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-bold uppercase"
                >
                  <option value="publicado">Publicado</option>
                  <option value="rascunho">Rascunho</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Resumo / Subtítulo *
              </label>
              <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                placeholder="Breve resumo exibido nos cards e resultados de busca"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Conteúdo Completo do Artigo *
              </label>
              <textarea
                rows={7}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 leading-relaxed"
                placeholder="Texto integral da matéria..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured-check"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#00A550] focus:ring-[#00A550]"
              />
              <label htmlFor="featured-check" className="text-xs font-bold text-stone-700 cursor-pointer">
                Destacar no topo da página de notícias
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Gravando...' : 'Salvar Notícia'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News Table List */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <table className="min-w-full divide-y divide-stone-200 text-xs">
          <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Título / Resumo</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-12 h-10 object-cover rounded-md border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-stone-500 line-clamp-1 mt-0.5">{item.summary}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-stone-700">{item.category}</td>
                <td className="px-4 py-4 text-stone-500 whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                      item.status === 'publicado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
