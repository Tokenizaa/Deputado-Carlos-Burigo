import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, FileCode2, Save } from 'lucide-react';
import { ProjectItem } from '../../types';

export const AdminProjectsTab: React.FC = () => {
  const { projects, currentUser, refreshAllData, showToast } = useApp();
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [status, setStatus] = useState('');
  const [year, setYear] = useState(2025);
  const [summary, setSummary] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [linkAlrs, setLinkAlrs] = useState('');
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setIsCreating(true);
    setEditingProject(null);
    setCode('PL 000/2026');
    setTitle('');
    setTheme('Desenvolvimento Econômico');
    setStatus('Em tramitação na ALRS');
    setYear(2026);
    setSummary('');
    setDetailedDescription('');
    setLinkAlrs('');
  };

  const startEdit = (p: ProjectItem) => {
    setEditingProject(p);
    setIsCreating(false);
    setCode(p.code);
    setTitle(p.title);
    setTheme(p.theme);
    setStatus(p.status);
    setYear(p.year);
    setSummary(p.summary);
    setDetailedDescription(p.detailedDescription);
    setLinkAlrs(p.linkAlrs || '');
  };

  const cancel = () => {
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          code,
          title,
          theme,
          status,
          year,
          summary,
          detailedDescription,
          linkAlrs: linkAlrs || undefined,
        }),
      });

      if (res.ok) {
        showToast('Projeto de lei salvo com sucesso!', 'success');
        await refreshAllData();
        cancel();
      } else {
        showToast('Erro ao salvar projeto.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este projeto de lei?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id },
      });
      if (res.ok) {
        showToast('Projeto removido com sucesso.', 'success');
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
            Gestão de Projetos de Lei & Bandeiras
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Atualize o status de tramitação dos projetos de lei de autoria de Carlos Búrigo na Assembleia.
          </p>
        </div>

        {!isCreating && !editingProject && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto de Lei</span>
          </button>
        )}
      </div>

      {(isCreating || editingProject) && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-stone-900 text-base">
              {editingProject ? 'Editar Projeto de Lei' : 'Cadastrar Novo Projeto'}
            </h3>
            <button onClick={cancel} className="text-xs text-stone-500 font-bold">
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Código / Número *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-mono"
                  placeholder="Ex: PL 332/2025"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Eixo Temático *</label>
                <input
                  type="text"
                  required
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Status de Tramitação *</label>
                <input
                  type="text"
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-semibold text-emerald-800"
                  placeholder="Ex: Aprovado por Unanimidade"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Título do Projeto *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Resumo Rápido *</label>
              <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Detalhamento e Impactos *</label>
              <textarea
                rows={4}
                required
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Link de Tramitação na ALRS</label>
              <input
                type="url"
                value={linkAlrs}
                onChange={(e) => setLinkAlrs(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                placeholder="https://al.rs.gov.br/..."
              />
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
                <span>{saving ? 'Gravando...' : 'Salvar Projeto'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <table className="min-w-full divide-y divide-stone-200 text-xs">
          <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Código</th>
              <th className="px-6 py-3 text-left">Título / Eixo</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Ano</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-[#00A550] whitespace-nowrap">
                  {p.code}
                </td>
                <td className="px-6 py-4">
                  <h4 className="font-bold text-stone-900 text-sm">{p.title}</h4>
                  <span className="text-[11px] text-stone-500">{p.theme}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-stone-500 whitespace-nowrap">{p.year}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
