import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Building,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Demand, DemandStatus } from '../../types';

export const CitizenProtocolModal: React.FC = () => {
  const { isProtocolModalOpen, closeProtocolModal, trackingProtocol, showToast } = useApp();
  const [searchInput, setSearchInput] = useState(trackingProtocol || '');
  const [demandData, setDemandData] = useState<Demand | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (trackingProtocol) {
      setSearchInput(trackingProtocol);
      performLookup(trackingProtocol);
    }
  }, [trackingProtocol]);

  const performLookup = async (protocol: string) => {
    if (!protocol.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/citizen/lookup?protocol=${encodeURIComponent(protocol.trim())}`);
      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.error || 'Protocolo não localizado no gabinete.');
        setDemandData(null);
      } else {
        const data = await res.json();
        setDemandData(data);
      }
    } catch (err) {
      setErrorMsg('Erro de conexão ao buscar protocolo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(searchInput);
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !demandData) return;
    setSendingReply(true);
    try {
      const res = await fetch('/api/citizen/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: demandData.protocol,
          text: replyText.trim(),
          citizenName: demandData.citizenName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDemandData(data.demand);
        setReplyText('');
        showToast('Mensagem complementar encaminhada ao gabinete!', 'success');
      } else {
        showToast('Falha ao enviar mensagem complementar.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão.', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  if (!isProtocolModalOpen) return null;

  const getStatusBadge = (status: DemandStatus) => {
    switch (status) {
      case 'recebida':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em análise':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'em atendimento':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'encaminhada':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'aguardando retorno':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'respondida':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'concluída':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'arquivada':
        return 'bg-stone-200 text-stone-700 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#E1F200] tracking-wider block">
              Portal do Cidadão • Transparência
            </span>
            <h3 className="text-lg font-black text-white">
              Acompanhamento de Demanda / Protocolo
            </h3>
          </div>
          <button
            onClick={closeProtocolModal}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Header Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Informe o protocolo (ex: #2026-004821)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00A550] hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              {loading ? 'Buscando...' : 'Consultar'}
            </button>
          </form>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Protocolo não encontrado</p>
                <p className="mt-0.5 text-rose-700">{errorMsg}</p>
                <p className="mt-2 text-xs text-stone-500">
                  Dica de teste: consulte o protocolo preenchido <strong className="text-stone-800">#2026-004821</strong> ou <strong className="text-stone-800">#2026-004815</strong>.
                </p>
              </div>
            </div>
          )}

          {demandData ? (
            <div className="space-y-6">
              {/* Demand Status Header */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">
                    Número de Protocolo
                  </span>
                  <p className="text-2xl font-black text-stone-900 font-mono">
                    {demandData.protocol}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block mb-1">
                    Situação Atual
                  </span>
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${getStatusBadge(
                      demandData.status
                    )}`}
                  >
                    {demandData.status}
                  </span>
                </div>
              </div>

              {/* Demand Overview */}
              <div className="space-y-2 text-sm text-stone-700">
                <div className="flex flex-wrap gap-4 text-xs text-stone-500 pb-2 border-b border-stone-200">
                  <span className="flex items-center gap-1 font-semibold text-stone-800">
                    <User className="w-3.5 h-3.5 text-[#00A550]" />
                    {demandData.citizenName}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {demandData.municipality}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {new Date(demandData.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                    {demandData.category}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-stone-900 pt-1">
                  {demandData.subject}
                </h4>
                <p className="text-stone-600 leading-relaxed bg-white border border-stone-200 p-4 rounded-xl text-xs sm:text-sm">
                  {demandData.description}
                </p>
              </div>

              {/* Cabinet Messages / Responses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#00A550]" />
                  Comunicações e Respostas Oficiais
                </h4>

                {demandData.messages && demandData.messages.length > 0 ? (
                  <div className="space-y-3">
                    {demandData.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl text-xs sm:text-sm border ${
                          msg.senderType === 'cabinet'
                            ? 'bg-emerald-50/80 border-emerald-200 ml-4'
                            : 'bg-stone-100 border-stone-300 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[11px] font-bold">
                          <span
                            className={
                              msg.senderType === 'cabinet'
                                ? 'text-[#00A550]'
                                : 'text-stone-700'
                            }
                          >
                            {msg.senderName}
                          </span>
                          <span className="text-stone-400 font-normal">
                            {new Date(msg.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-stone-800 leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-lg">
                    A demanda está em análise pela equipe técnica do gabinete. Nenhuma mensagem adicional registrada até o momento.
                  </p>
                )}

                {/* Follow-up Message Form for the citizen */}
                <form onSubmit={handleSendFollowUp} className="pt-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Enviar mensagem complementar ou esclarecimento:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escreva sua mensagem ou informação adicional..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550]"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="bg-[#00A550] hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingReply ? 'Enviando...' : 'Enviar'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* History Timeline */}
              {demandData.history && demandData.history.length > 0 && (
                <div className="pt-4 border-t border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-400" />
                    Histórico de Movimentações Internas
                  </h4>
                  <div className="space-y-3 pl-2 border-l-2 border-stone-200 ml-2 text-xs">
                    {demandData.history.map((hist) => (
                      <div key={hist.id} className="relative pl-4">
                        <span className="absolute -left-[13px] top-1 w-2 h-2 rounded-full bg-[#00A550]" />
                        <div className="flex items-center justify-between text-stone-500 text-[11px]">
                          <span className="font-semibold text-stone-700">
                            {hist.actorName} ({hist.actorRole})
                          </span>
                          <span>{new Date(hist.timestamp).toLocaleString('pt-BR')}</span>
                        </div>
                        <p className="text-stone-800 font-medium mt-0.5">{hist.action}</p>
                        {hist.note && (
                          <p className="text-stone-500 italic mt-0.5">{hist.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            !loading &&
            !errorMsg && (
              <div className="text-center py-10 space-y-3">
                <FileText className="w-12 h-12 text-stone-300 mx-auto" />
                <h4 className="font-bold text-stone-800 text-sm">
                  Consulte o andamento da sua solicitação
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Digite o número de protocolo recebido no momento do envio da sua demanda para verificar despachos, ofícios expedidos e respostas do gabinete.
                </p>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end">
          <button
            onClick={closeProtocolModal}
            className="text-xs font-bold text-stone-700 bg-white border border-stone-300 px-4 py-2 rounded-lg hover:bg-stone-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
