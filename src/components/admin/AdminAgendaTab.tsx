import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Save, X, Tag } from 'lucide-react';
import { EventItem } from '../../types';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { AgendaCalendar } from '../shared/AgendaCalendar';
import { getAgendaTagColor } from '../shared/agendaTags';

const TAG_SUGGESTIONS = [
  'Reunião',
  'Audiência',
  'Assembleia',
  'Município',
  'Saúde',
  'Infraestrutura',
  'Educação',
  'Agricultura',
  'Institucional',
  'Imprensa',
];

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const AdminAgendaTab: React.FC = () => {
  const { events, refreshAllData, showToast } = useApp();
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [municipality, setMunicipality] = useState('Caxias do Sul');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'publico' | 'interno'>('publico');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('09:00');
    setLocation('');
    setMunicipality('Caxias do Sul');
    setDescription('');
    setVisibility('publico');
    setTags([]);
    setTagInput('');
  };

  const startCreate = (selectedDate?: Date) => {
    const target = selectedDate ?? new Date();
    resetForm();
    setDate(toDateKey(target));
    setEditingEvent(null);
    setIsCreating(true);
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
    setTags(item.tags ?? []);
    setTagInput('');
  };

  const closeModal = () => {
    setEditingEvent(null);
    setIsCreating(false);
    resetForm();
  };

  const addTag = (value: string) => {
    const tag = value.trim();
    if (!tag || tags.includes(tag) || tags.length >= 12) return;
    setTags((current) => [...current, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((current) => current.filter((item) => item !== tag));
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
      const body = {
        title,
        ...(editingEvent ? {} : { date, time }),
        location,
        municipality,
        description,
        visibility,
        tags,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Erro ao salvar evento');
      }

      showToast(
        editingEvent ? 'Compromisso atualizado!' : 'Compromisso criado com sucesso!',
        'success'
      );
      await refreshAllData();
      closeModal();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro de conexão.', 'error');
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
      if (!res.ok) throw new Error('Erro ao excluir compromisso');
      showToast('Compromisso excluído com sucesso.', 'success');
      await refreshAllData();
      closeModal();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro de conexão.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">Gestão de Agenda & Compromissos</h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Clique em uma data para criar um compromisso ou em um evento para editar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => startCreate()}
          className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Novo Compromisso
        </button>
      </div>

      <AgendaCalendar
        events={events}
        adminMode
        onEventClick={startEdit}
        onDateClick={startCreate}
      />

      {(isCreating || editingEvent) && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 p-4 sm:p-6 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agenda-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 sticky top-0 bg-white">
              <div>
                <h3 id="agenda-modal-title" className="font-black text-stone-900">
                  {editingEvent ? 'Editar Compromisso' : 'Novo Compromisso'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {editingEvent ? 'Data e horário ficam bloqueados após a criação.' : 'A data foi definida pelo dia selecionado no calendário.'}
                </p>
              </div>
              <button type="button" onClick={closeModal} className="min-h-10 min-w-10 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50" aria-label="Fechar">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3"
                  placeholder="Ex.: Reunião com a Diretoria do Hospital Geral"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    disabled
                    className="w-full text-sm bg-stone-100 border border-stone-300 rounded-lg p-3 text-stone-600 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    disabled={Boolean(editingEvent)}
                    onChange={(event) => setTime(event.target.value)}
                    className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3 disabled:bg-stone-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <button key={tag} type="button" onClick={() => removeTag(tag)} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold hover:opacity-80 ${getAgendaTagColor(tag)}`}>
                      <Tag className="w-3 h-3" /> {tag} <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                    className="flex-1 text-sm bg-stone-50 border border-stone-300 rounded-lg p-3"
                    placeholder="Digite uma tag e pressione Enter"
                  />
                  <button type="button" onClick={() => addTag(tagInput)} className="px-4 rounded-lg border border-stone-300 text-xs font-bold hover:bg-stone-50">
                    Adicionar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {TAG_SUGGESTIONS.filter((tag) => !tags.includes(tag)).map((tag) => (
                    <button key={tag} type="button" onClick={() => addTag(tag)} className="rounded-full border border-stone-200 px-2 py-1 text-[10px] font-bold text-stone-600 hover:bg-stone-50">
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Local / Endereço *</label>
                  <input type="text" required value={location} onChange={(event) => setLocation(event.target.value)} className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Município *</label>
                  <input type="text" required value={municipality} onChange={(event) => setMunicipality(event.target.value)} className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Visibilidade *</label>
                <select value={visibility} onChange={(event) => setVisibility(event.target.value as 'publico' | 'interno')} className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3 font-bold">
                  <option value="publico">Público (Exibido no site)</option>
                  <option value="interno">Interno do Gabinete (Privado)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pauta / Descrição *</label>
                <textarea rows={3} required value={description} onChange={(event) => setDescription(event.target.value)} className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3" placeholder="Objetivo da agenda, participantes e assuntos tratados..." />
              </div>

              <div className="flex justify-between gap-3 pt-2">
                {editingEvent ? (
                  <button type="button" onClick={() => handleDelete(editingEvent.id)} className="px-4 py-2.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50">
                    Excluir
                  </button>
                ) : <span />}
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-60">
                    <Save className="w-4 h-4" />
                    {saving ? 'Gravando...' : editingEvent ? 'Salvar alterações' : 'Criar compromisso'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
