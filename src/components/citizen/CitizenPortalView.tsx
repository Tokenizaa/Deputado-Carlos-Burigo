import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  CheckCircle2,
  FileText,
  Search,
  Phone,
  Mail,
  Shield,
  Upload,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { DemandCategory } from '../../types';

export const CitizenPortalView: React.FC = () => {
  const { municipalities, openProtocolModal, showToast } = useApp();

  const [formData, setFormData] = useState({
    citizenName: '',
    citizenEmail: '',
    citizenPhone: '',
    municipality: 'Caxias do Sul',
    neighborhood: '',
    category: 'solicitar atendimento' as DemandCategory,
    subject: '',
    description: '',
    lgpdConsent: false,
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [generatedProtocol, setGeneratedProtocol] = useState<string | null>(null);

  const categories: DemandCategory[] = [
    'solicitar atendimento',
    'apresentar demanda',
    'enviar sugestão',
    'solicitar informação',
    'projeto de lei',
    'saúde e hospitalar',
    'infraestrutura e rodovias',
    'educação',
    'agricultura e silvicultura',
    'outro assunto',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((f: File) => f.name);
      setAttachments((prev) => [...prev, ...names]);
      showToast(`${files.length} anexo(s) adicionado(s)`, 'info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lgpdConsent) {
      showToast('Por favor, confirme a concordância com o tratamento dos dados conforme a LGPD.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/citizen/demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attachments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao registrar demanda', 'error');
      } else {
        setGeneratedProtocol(data.protocol);
        showToast(`Demanda protocolada com sucesso: ${data.protocol}`, 'success');
        // Reset form
        setFormData({
          citizenName: '',
          citizenEmail: '',
          citizenPhone: '',
          municipality: 'Caxias do Sul',
          neighborhood: '',
          category: 'solicitar atendimento',
          subject: '',
          description: '',
          lgpdConsent: false,
        });
        setAttachments([]);
      }
    } catch (err) {
      showToast('Falha na comunicação com o gabinete.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyProtocol = () => {
    if (generatedProtocol && navigator.clipboard) {
      navigator.clipboard.writeText(generatedProtocol);
      showToast('Número de protocolo copiado!', 'success');
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Canal Direto com o Gabinete
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Fale com o Gabinete de Carlos Búrigo
          </h1>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Envie sua demanda comunitária, solicitação de apoio parlamentar, sugestão de projeto de lei ou pedido de providência aos órgãos públicos. Cada manifestação recebe protocolo individual com acompanhamento transparente.
          </p>
        </div>

        {/* Existing Protocol Quick Search Card */}
        <div className="mb-10 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              Já possui uma demanda em andamento?
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Consulte despachos, ofícios expedidos e respostas da equipe técnica.
            </p>
          </div>
          <button
            onClick={() => openProtocolModal()}
            className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-[#E1F200]" />
            <span>Consultar Protocolo</span>
          </button>
        </div>

        {/* Success Protocol Generated Card */}
        {generatedProtocol && (
          <div className="mb-10 bg-emerald-50 border-2 border-[#00A550] rounded-2xl p-6 sm:p-8 text-stone-900 shadow-md animate-fade-in">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-[#00A550] shrink-0 mt-1" />
              <div className="space-y-3 flex-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00A550]">
                    Manifestação Registrada com Sucesso!
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                    Seu Protocolo: <span className="font-mono text-[#00A550]">{generatedProtocol}</span>
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Sua solicitação foi inserida na fila de triagem da assessoria parlamentar do deputado Carlos Búrigo. Guarde este número para acompanhar as atualizações, respostas e envio de documentos adicionais.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={copyProtocol}
                    className="inline-flex items-center gap-2 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#00A550]" />
                    <span>Copiar Número</span>
                  </button>

                  <button
                    onClick={() => openProtocolModal(generatedProtocol)}
                    className="inline-flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-[#E1F200]" />
                    <span>Visualizar Acompanhamento</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demand Form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-black text-stone-900 border-b border-stone-200 pb-3">
              Formulário de Atendimento e Demanda
            </h3>

            {/* Citizen Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={formData.citizenName}
                  onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  E-mail de Contato *
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  value={formData.citizenEmail}
                  onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(54) 99999-9999"
                  value={formData.citizenPhone}
                  onChange={(e) => setFormData({ ...formData, citizenPhone: e.target.value })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
                />
              </div>

              <div>
                <label htmlFor="citizen-municipality" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Município de Residência *
                </label>
                <select
                  id="citizen-municipality"
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
                >
                  {municipalities.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.region})
                    </option>
                  ))}
                  <option value="Outro Município do RS">Outro Município do RS</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Bairro ou Localidade Rural
                </label>
                <input
                  type="text"
                  placeholder="Ex: Centro, Bairro São Pelegrino, Linha Silveira..."
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
                />
              </div>
            </div>

            {/* Demand Details */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div>
                <label htmlFor="citizen-category" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Categoria da Demanda *
                </label>
                <select
                  id="citizen-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as DemandCategory })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Assunto da Solicitação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Resuma o objetivo da sua mensagem em uma frase"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#00A550]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Descrição Detalhada dos Fatos *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Descreva detalhadamente a situação, rodovia ou serviço público envolvido, identificando locais e necessidades..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-lg p-3.5 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#00A550] leading-relaxed"
                />
              </div>

              {/* Attachments Upload */}
              <div>
                <label htmlFor="attachments-upload" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Anexar Documentos ou Fotos (Opcional)
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:bg-stone-50 transition-colors cursor-pointer relative">
                  <input
                    id="attachments-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                  <p className="text-xs text-stone-600 font-semibold">
                    Clique para selecionar arquivos ou arraste fotos/ofícios aqui
                  </p>
                  <p className="text-[11px] text-stone-400">PDF, JPEG, PNG até 10MB</p>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.map((file, i) => (
                      <div key={i} className="text-xs text-stone-600 flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded">
                        <FileText className="w-3.5 h-3.5 text-[#00A550]" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* LGPD Consent Checkbox */}
            <div className="pt-4 border-t border-stone-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.lgpdConsent}
                  onChange={(e) => setFormData({ ...formData, lgpdConsent: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-[#00A550] focus:ring-[#00A550] border-stone-300"
                />
                <span className="text-xs text-stone-600 leading-relaxed">
                  Autorizo o tratamento dos dados pessoais informados acima pelo gabinete do deputado Carlos Búrigo exclusivamente para fins de atendimento institucional, tramitação e contato sobre esta demanda, conforme os preceitos da Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#00A550] hover:bg-emerald-700 disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-xl text-base shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#E1F200]" />
                <span>{submitting ? 'Registrando Demanda...' : 'Protocolar Demanda no Gabinete'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
