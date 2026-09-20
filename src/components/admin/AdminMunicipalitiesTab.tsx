import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, MapPin, Save, Check } from 'lucide-react';
import { Municipality } from '../../types';
import { getSupabaseClient } from '../../lib/supabaseClient';

export const AdminMunicipalitiesTab: React.FC = () => {
  const { municipalities, refreshAllData, showToast } = useApp();
  const [editingMun, setEditingMun] = useState<Municipality | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [region, setRegion] = useState('Serra Gaúcha');
  const [population, setPopulation] = useState('');
  const [deliveriesText, setDeliveriesText] = useState('');
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setIsCreating(true);
    setEditingMun(null);
    setName('');
    setRegion('Serra Gaúcha');
    setPopulation('');
    setDeliveriesText('');
  };

  const startEdit = (m: Municipality) => {
    setEditingMun(m);
    setIsCreating(false);
    setName(m.name);
    setRegion(m.region);
    setPopulation(m.population || '');
    setDeliveriesText(m.keyDeliveries.join('\n'));
  };

  const cancel = () => {
    setEditingMun(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: sessionData } = await (await getSupabaseClient()).auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) { showToast('Sessão expirada. Entre novamente.', 'error'); return; }
      const deliveries = deliveriesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const url = editingMun ? `/api/municipalities/${editingMun.id}` : '/api/municipalities';
      const method = editingMun ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          region,
          population: population || undefined,
          keyDeliveries: deliveries,
        }),
      });

      if (res.ok) {
        showToast('Município salvo com sucesso!', 'success');
        await refreshAllData();
        cancel();
      } else {
        showToast('Erro ao salvar município', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este município?')) return;
    try {
      const { data: sessionData } = await (await getSupabaseClient()).auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) { showToast('Sessão expirada. Entre novamente.', 'error'); return; }
      const res = await fetch(`/api/municipalities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        showToast('Município excluído.', 'success');
        await refreshAllData();
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Gestão de Municípios Atendidos
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Cadastre municípios e registre as entregas, emendas e ofícios de apoio a cada localidade.
          </p>
        </div>

        {!isCreating && !editingMun && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Município</span>
          </button>
        )}
      </div>

      {(isCreating || editingMun) && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-stone-900 text-base">
              {editingMun ? 'Editar Município' : 'Cadastrar Novo Município'}
            </h3>
            <button onClick={cancel} className="text-xs text-stone-500 font-bold">
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nome da Cidade *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: Flores da Cunha"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Região *</label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: Serra Gaúcha"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">População Estimada</label>
                <input
                  type="text"
                  value={population}
                  onChange={(e) => setPopulation(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: 31.000 hab."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Entregas e Ações Realizadas (uma por linha) *
              </label>
              <textarea
                rows={4}
                required
                value={deliveriesText}
                onChange={(e) => setDeliveriesText(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 leading-relaxed"
                placeholder="Destinação de R$ 500 mil para saúde básica&#10;Apoio à pavimentação de acesso asfáltico rural..."
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
                <span>{saving ? 'Gravando...' : 'Salvar Município'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Municipalities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {municipalities.map((m) => (
          <div
            key={m.id}
            className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase text-[#00A550] bg-emerald-50 px-2 py-0.5 rounded">
                  {m.region}
                </span>
                {m.population && (
                  <span className="text-xs text-stone-400 font-medium">{m.population}</span>
                )}
              </div>

              <h4 className="font-black text-stone-900 text-base">{m.name}</h4>

              <div className="mt-3 space-y-1.5">
                {m.keyDeliveries.slice(0, 3).map((del, i) => (
                  <div key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                    <span className="text-[#00A550] font-bold">•</span>
                    <span className="line-clamp-2">{del}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => startEdit(m)}
                className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
