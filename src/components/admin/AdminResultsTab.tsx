import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, Award, Save } from 'lucide-react';
import { ResultItem } from '../../types';

export const AdminResultsTab: React.FC = () => {
  const { results, currentUser, refreshAllData, showToast } = useApp();
  const [editingItem, setEditingItem] = useState<ResultItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Infraestrutura & Obras');
  const [description, setDescription] = useState('');
  const [metrics, setMetrics] = useState('');
  const [date, setDate] = useState('2025/2026');
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setTitle('');
    setCategory('Infraestrutura & Obras');
    setDescription('');
    setMetrics('');
    setDate('2025/2026');
  };

  const startEdit = (r: ResultItem) => {
    setEditingItem(r);
    setIsCreating(false);
    setTitle(r.title);
    setCategory(r.category);
    setDescription(r.description);
    setMetrics(r.metrics || '');
    setDate(r.date || '');
  };

  const cancel = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingItem ? `/api/results/${editingItem.id}` : '/api/results';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          title,
          category,
          description,
          metrics: metrics || undefined,
          date,
        }),
      });

      if (res.ok) {
        showToast('Resultado salvo com sucesso!', 'success');
        await refreshAllData();
        cancel();
      } else {
        showToast('Erro ao salvar resultado', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este item de prestação de contas?')) return;
    try {
      const res = await fetch(`/api/results/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id },
      });
      if (res.ok) {
        showToast('Item removido com sucesso.', 'success');
        await refreshAllData();
      }
    } catch (err) {
      showToast('Erro ao remover.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Gestão de Resultados & Prestação de Contas
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Mantenha atualizadas as entregas tangíveis e recursos viabilizados para o Rio Grande.
          </p>
        </div>

        {!isCreating && !editingItem && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Resultado</span>
          </button>
        )}
      </div>

      {(isCreating || editingItem) && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-stone-900 text-base">
              {editingItem ? 'Editar Resultado' : 'Cadastrar Novo Resultado'}
            </h3>
            <button onClick={cancel} className="text-xs text-stone-500 font-bold">
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Título da Entrega *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Categoria *</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Descrição Detalhada *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Métricas em Destaque</label>
                <input
                  type="text"
                  value={metrics}
                  onChange={(e) => setMetrics(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-bold text-[#00A550]"
                  placeholder="Ex: R$ 18+ milhões em emendas e recursos"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Período / Ano</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={cancel}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Gravando...' : 'Salvar'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <table className="min-w-full divide-y divide-stone-200 text-xs">
          <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Entrega</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              <th className="px-4 py-3 text-left">Métrica</th>
              <th className="px-4 py-3 text-left">Período</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {results.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <h4 className="font-bold text-stone-900 text-sm">{r.title}</h4>
                  <p className="text-stone-500 line-clamp-1">{r.description}</p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded">
                    {r.category}
                  </span>
                </td>
                <td className="px-4 py-4 font-bold text-[#00A550] whitespace-nowrap">{r.metrics}</td>
                <td className="px-4 py-4 text-stone-500 whitespace-nowrap">{r.date}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => startEdit(r)}
                    className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700"
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
