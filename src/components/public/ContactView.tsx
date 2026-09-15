import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Shield } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { settings, setCurrentView } = useApp();

  return (
    <div className="py-12 sm:py-20 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Canais de Atendimento
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Entre em Contato com a Equipe
          </h1>
          <p className="mt-3 text-stone-600 text-base">
            O gabinete de Carlos Búrigo mantém portas abertas em Porto Alegre e Caxias do Sul para acolher prefeitos, vereadores, entidades e todo cidadão gaúcho.
          </p>
        </div>

        {/* Office Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Porto Alegre Office */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A550]">
                Sede Parlamentar
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                Gabinete na Assembleia Legislativa
              </h2>
            </div>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00A550] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Endereço:</strong>
                  <span>{settings?.gabinete_address_poa}</span>
                  <span className="block text-xs text-stone-500 mt-0.5">Praça Marechal Deodoro, 101 • Centro Histórico, Porto Alegre - RS</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00A550] shrink-0" />
                <div>
                  <strong className="block text-stone-900">Telefone Fixo:</strong>
                  <span>{settings?.gabinete_phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#00A550] shrink-0" />
                <div>
                  <strong className="block text-stone-900">Horário de Atendimento:</strong>
                  <span>Segunda a sexta-feira, das 08h30 às 12h e das 13h30 às 18h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Caxias do Sul Regional Office */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A550]">
                Escritório Regional
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                Gabinete Regional da Serra Gaúcha
              </h2>
            </div>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00A550] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Endereço:</strong>
                  <span>{settings?.gabinete_address_caxias}</span>
                  <span className="block text-xs text-stone-500 mt-0.5">Caxias do Sul - RS</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#00A550] shrink-0" />
                <div>
                  <strong className="block text-stone-900">WhatsApp Gabinete Regional:</strong>
                  <a
                    href={settings?.social_whatsapp || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00A550] font-bold hover:underline"
                  >
                    {settings?.gabinete_whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00A550] shrink-0" />
                <div>
                  <strong className="block text-stone-900">E-mail Institucional:</strong>
                  <span>{settings?.gabinete_email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Citizen Portal */}
        <div className="bg-[#111827] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-black">
              Quer enviar uma demanda ou documento oficial?
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Utilize nosso Portal do Cidadão online para registrar sua solicitação com protocolo digital auditável.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('cidadao')}
            className="bg-[#00A550] hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors shrink-0 flex items-center gap-2"
          >
            <span>Acessar Portal do Cidadão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
