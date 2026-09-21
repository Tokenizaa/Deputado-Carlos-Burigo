import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus, Edit2, Trash2, Clock, MapPin, Lock, Globe, Save } from 'lucide-react';
import { EventItem } from '../../types';
import { getSupabaseClient } from '../../lib/supabaseClient';

export const AdminAgendaTab: React.FC = () => {
  const { events, refreshAllData, showToast } = useApp();
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-18');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [municipality, setMunicipality] = useState('Caxias do Sul');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'publico' | 'interno'>('publico');
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setIsCreating(true);
    setEditingEvent(null);
    setTitle('');
    setDate('2026-09-20');
    setTime('10:00');
    setLocation('Câmara de Vereadores');
    setMunicipality('Caxias do Sul');
    setDescription('');
    setVisibility('publico');
  };

  const startEdit = (item: EventItem) => {
    setEditingEvent(item);
    setIsCreating(false);
    setTitle(item.title);
    setDate(item.date);
    setTime(item.time);
    setLocation(item.location);
    setMunicipality(item.municipality);
    setDescription(item.description);
    setVisibility(item.visibility);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const client = await getSupabaseClient();
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData.session?.access_token) throw new Error('Sessão não autenticada');
      const url = editingEvent ? `/api/agenda/${editingEvent.id}` : '/api/agenda';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({
          title,
          date,
          time,
          location,
          municipality,
          description,
          visibility,
        }),
      });

      if (res.ok) {
        showToast(
          editingEvent ? 'Compromisso atualizado!' : 'Compromisso agendado com sucesso!',
          'success'
        );
        await refreshAllData();
        cancelEdit();
      } else {
        showToast('Erro ao salvar evento', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este compromisso?')) return;
    try {
      const client = await getSupabaseClient();
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData.session?.access_token) throw new Error('Sessão não autenticada');
      const res = await fetch(`/api/agenda/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });
      if (res.ok) {
        showToast('Compromisso excluído com sucesso.', 'success');
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
            Gestão de Agenda & Compromissos
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Agende audiências, vistorias e reuniões, definindo visibilidade pública ou interna.
          </p>
        </div>

        {!isCreating && !editingEvent && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Compromisso</span>
          </button>
        )}
      </div>

      {(isCreating || editingEvent) && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-stone-900 text-base">
              {editingEvent ? 'Editar Compromisso' : 'Agendar Novo Compromisso'}
            </h3>
            <button onClick={cancelEdit} className="text-xs text-stone-500 font-bold">
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Título do Compromisso *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                placeholder="Ex: Reunião com a Diretoria do Hospital Geral"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Data *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Horário *</label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: 14:00 ou 09h30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Visibilidade *
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'publico' | 'interno')}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-bold uppercase"
                >
                  <option value="publico">Público (Exibido no site)</option>
                  <option value="interno">Interno do Gabinete (Privado)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Local / Endereço *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: Sala de Reuniões da Prefeitura"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Município *</label>
                <input
                  type="text"
                  required
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  placeholder="Ex: Caxias do Sul"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Pauta / Descrição *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                placeholder="Objetivo da agenda, participantes e assuntos tratados..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={cancelEdit}
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
                <span>{saving ? 'Gravando...' : 'Salvar Compromisso'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* A agenda agora é exibida em calendário mensal; a edição continua sendo feita pelo formulário acima. */}

    </div>
  );
};
