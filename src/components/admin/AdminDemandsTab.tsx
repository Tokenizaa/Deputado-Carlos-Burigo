import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Inbox,
  User,
  MapPin,
  Calendar,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Building,
} from 'lucide-react';
import { Demand, DemandStatus, PriorityLevel } from '../../types';

export const AdminDemandsTab: React.FC = () => {
  const { demands, currentUser, allUsers, refreshAllData, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(demands[0] || null);

  // Form states for dispatching updates
  const [statusDraft, setStatusDraft] = useState<DemandStatus>(
    selectedDemand?.status || 'recebida'
  );
  const [priorityDraft, setPriorityDraft] = useState<PriorityLevel>(
    selectedDemand?.priority || 'média'
  );
  const [assignedDraft, setAssignedDraft] = useState(selectedDemand?.assignedTo || '');
  const [internalNoteDraft, setInternalNoteDraft] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [saving, setSaving] = useState(false);

  // Synchronize drafts on selection
  const selectDemand = (d: Demand) => {
    setSelectedDemand(d);
    setStatusDraft(d.status);
    setPriorityDraft(d.priority);
    setAssignedDraft(d.assignedTo || '');
    setInternalNoteDraft('');
    setReplyDraft('');
  };

  const filteredDemands = demands.filter((d) => {
    const matchesSearch =
      d.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.municipality.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'todos' || d.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateDemand = async () => {
    if (!selectedDemand) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/demands/${selectedDemand.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          status: statusDraft,
          priority: priorityDraft,
          assignedTo: assignedDraft || undefined,
          internalNote: internalNoteDraft || undefined,
          officialReply: replyDraft || undefined,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        showToast('Demanda atualizada com sucesso no gabinete!', 'success');
        await refreshAllData();
        setSelectedDemand(updated);
        setInternalNoteDraft('');
        setReplyDraft('');
      } else {
        showToast('Erro ao atualizar demanda.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Gestão de Atendimento e Demandas do Cidadão
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm">
          Acompanhe protocolos, despache solicitações aos órgãos públicos e envie respostas oficiais aos cidadãos.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-stone-200">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por protocolo, nome, cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 font-medium"
          >
            <option value="todos">Todos ({demands.length})</option>
            <option value="recebida">Recebidas</option>
            <option value="em análise">Em análise</option>
            <option value="em atendimento">Em atendimento</option>
            <option value="encaminhada">Encaminhadas</option>
            <option value="aguardando retorno">Aguardando retorno</option>
            <option value="respondida">Respondidas</option>
            <option value="concluída">Concluídas</option>
            <option value="arquivada">Arquivadas</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: List & Detail/Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Demands List */}
        <div className="lg:col-span-5 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {filteredDemands.map((d) => {
            const isSelected = selectedDemand?.id === d.id;
            return (
              <div
                key={d.id}
                onClick={() => selectDemand(d)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-50/70 border-[#00A550] shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-[#00A550]">
                    {d.protocol}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      d.priority === 'urgente'
                        ? 'bg-rose-100 text-rose-800'
                        : d.priority === 'alta'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {d.priority}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
                  {d.subject}
                </h4>

                <div className="flex items-center justify-between text-xs text-stone-500 mt-2">
                  <span>{d.citizenName}</span>
                  <span>{d.municipality}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-stone-700">{d.category}</span>
                  <span className="capitalize font-bold text-stone-600">{d.status}</span>
                </div>
              </div>
            );
          })}

          {filteredDemands.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
              Nenhuma demanda encontrada com os filtros atuais.
            </div>
          )}
        </div>

        {/* Demand Detail and Action Panel */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
          {selectedDemand ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-[#00A550]">
                      {selectedDemand.protocol}
                    </span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-500 font-medium">
                      Criada em {new Date(selectedDemand.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">
                    {selectedDemand.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500 uppercase">Status:</span>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value as DemandStatus)}
                    className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 font-bold uppercase text-stone-800"
                  >
                    <option value="recebida">Recebida</option>
                    <option value="em análise">Em análise</option>
                    <option value="em atendimento">Em atendimento</option>
                    <option value="encaminhada">Encaminhada</option>
                    <option value="aguardando retorno">Aguardando retorno</option>
                    <option value="respondida">Respondida</option>
                    <option value="concluída">Concluída</option>
                    <option value="arquivada">Arquivada</option>
                  </select>
                </div>
              </div>

              {/* Citizen Details */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-stone-500 block">Cidadão Solicitante:</span>
                    <span className="font-semibold text-stone-900">{selectedDemand.citizenName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500 block">Município / Bairro:</span>
                    <span className="text-stone-800">
                      {selectedDemand.municipality}
                      {selectedDemand.neighborhood ? ` (${selectedDemand.neighborhood})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500 block">E-mail:</span>
                    <span className="text-stone-800">{selectedDemand.citizenEmail}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-500 block">Telefone / WhatsApp:</span>
                    <span className="text-stone-800">{selectedDemand.citizenPhone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-500 block mb-1">Descrição:</span>
                  <p className="text-stone-700 leading-relaxed bg-white p-3 rounded-lg border border-stone-200">
                    {selectedDemand.description}
                  </p>
                </div>
              </div>

              {/* Cabinet Internal Dispatching Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Prioridade de Atendimento:
                  </label>
                  <select
                    value={priorityDraft}
                    onChange={(e) => setPriorityDraft(e.target.value as PriorityLevel)}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Assessor Responsável:
                  </label>
                  <select
                    value={assignedDraft}
                    onChange={(e) => setAssignedDraft(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium"
                  >
                    <option value="">Não atribuído</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Notes & Official Reply */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Adicionar Nota Interna (Não visível ao cidadão):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Anotações de despacho, contato com órgãos, números de processos internos..."
                    value={internalNoteDraft}
                    onChange={(e) => setInternalNoteDraft(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Enviar Resposta Oficial ao Cidadão (Visível no Portal do Protocolo):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escreva a resposta formal do gabinete para este cidadão..."
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg p-2.5"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateDemand}
                    disabled={saving}
                    className="bg-[#00A550] hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{saving ? 'Gravando Despacho...' : 'Salvar e Despachar'}</span>
                  </button>
                </div>
              </div>

              {/* Message Feed & History */}
              <div className="pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Histórico de Mensagens Registradas
                </h4>
                <div className="space-y-2">
                  {selectedDemand.messages && selectedDemand.messages.length > 0 ? (
                    selectedDemand.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-lg text-xs ${
                          m.senderType === 'cabinet'
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-stone-100 border border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-0.5">
                          <span className={m.senderType === 'cabinet' ? 'text-[#00A550]' : 'text-stone-800'}>
                            {m.senderName} ({m.senderType === 'cabinet' ? 'Gabinete' : 'Cidadão'})
                          </span>
                          <span className="text-stone-400 font-normal">
                            {new Date(m.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-stone-700">{m.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-400 italic">Nenhuma mensagem registrada.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400 text-xs">
              Selecione uma demanda na lista ao lado para ver detalhes e despachar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
