import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { setCurrentView, openCitizenModal } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-white min-h-screen border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 bg-[#00A550]" />
            <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">
              CANAL INSTITUCIONAL DIRETO
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Gabinete Parlamentar
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-[65ch] leading-relaxed">
            Atendimento oficial ao cidadão, lideranças municipais e entidades representativas na Assembleia Legislativa do Estado do Rio Grande do Sul.
          </p>
        </div>

        {/* Institutional Contact Card */}
        <div className="border border-stone-300 rounded-[2px] bg-stone-50 p-8 sm:p-12 mb-12 sm:mb-16 space-y-8 shadow-xs">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em]">
              SEDE DO PODER LEGISLATIVO GAÚCHO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              Palácio Farroupilha — Gabinete 1002
            </h2>
            <div className="text-stone-700 text-base leading-relaxed space-y-0.5 pt-1">
              <p className="font-semibold text-stone-900">Praça Marechal Deodoro, 130 • 10º andar • Sala 1002</p>
              <p>Centro Histórico • Porto Alegre — RS • CEP 90010-909</p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                TELEFONE INSTITUCIONAL
              </span>
              <p className="text-lg font-bold text-stone-900">(51) 3210-2000</p>
              <span className="text-xs text-stone-500">Atendimento de segunda a sexta, 8h30 às 18h</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                CORREIO ELETRÔNICO OFICIAL
              </span>
              <p className="text-lg font-bold text-stone-900">carlos.burigo@al.rs.gov.br</p>
              <span className="text-xs text-stone-500">Gabinete Deputado Estadual Carlos Búrigo</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openCitizenModal('geral')}
              className="h-[48px] px-7 bg-[#00A550] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>REGISTRAR DEMANDA OU PROJETO</span>
            </button>

            <a
              href="mailto:carlos.burigo@al.rs.gov.br"
              className="h-[48px] px-6 border border-stone-300 hover:border-stone-400 bg-white text-stone-900 font-bold text-xs uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-stone-500" />
              <span>ENVIAR E-MAIL AO GABINETE</span>
            </a>
          </div>
        </div>

        {/* Secondary: Direct Message Form with strict >=44px controls */}
        <div className="border-t border-stone-200 pt-10">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-stone-900 mb-2">Mensagem direta à equipe de gabinete</h3>
            <p className="text-sm text-stone-600 mb-6">
              Envie sua mensagem, proposta técnica ou manifestação regional. Responderemos com brevidade institucional.
            </p>

            {submitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-sm text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00A550] shrink-0" />
                <span className="font-semibold">Mensagem transmitida com sucesso ao gabinete parlamentar.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-[44px] bg-stone-50 border border-stone-300 rounded-[2px] px-3.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-[44px] bg-stone-50 border border-stone-300 rounded-[2px] px-3.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Município / Região
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Caxias do Sul, Vacaria..."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-[44px] bg-stone-50 border border-stone-300 rounded-[2px] px-3.5 text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full min-h-[100px] p-3.5 bg-stone-50 border border-stone-300 rounded-[2px] text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="h-[48px] px-7 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                >
                  ENVIAR MENSAGEM
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
