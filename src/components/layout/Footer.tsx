import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Shield, ExternalLink, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, openProtocolModal } = useApp();
  const mode = settings?.site_mode || 'campaign';

  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-[#00A550] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Political Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#00A550] text-white flex flex-col items-center justify-center font-black">
                <span className="text-xs">RS</span>
                <span className="text-lg text-[#E1F200]">15</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">CARLOS BÚRIGO</h3>
                <p className="text-xs font-semibold text-[#00A550]">
                  {mode === 'campaign' ? 'MDB • Número 15140' : 'MDB • Rio Grande do Sul'}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Trabalho comprovado, presença constante nas comunidades e defesa intransigente do desenvolvimento econômico, da saúde pública e do equilíbrio fiscal do Rio Grande do Sul.
            </p>

            {/* Campaign disclosure box (Mandatory TSE regulation when in campaign mode) */}
            {mode === 'campaign' && (
              <div className="bg-stone-800/80 border border-stone-700 p-3 rounded-lg text-[11px] text-stone-300 space-y-1">
                <p className="font-bold text-[#E1F200]">INFORMAÇÕES ELEITORAIS OFICIAIS:</p>
                <p><strong>Candidato:</strong> Carlos Búrigo</p>
                <p><strong>Cargo:</strong> Deputado Estadual • Número 15140</p>
                <p><strong>CNPJ da Campanha:</strong> {settings?.campaign_cnpj || '56.789.123/0001-45'}</p>
                <p><strong>Coligação:</strong> {settings?.campaign_coalition || 'Coligação Pra Frente Rio Grande (MDB / Federação)'}</p>
                <p><strong>Eleições:</strong> 04 de Outubro de 2026</p>
              </div>
            )}
          </div>

          {/* Gabinete & Escritórios */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase border-b border-stone-800 pb-2">
              Endereços e Gabinete
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Porto Alegre (Assembleia Legislativa):</strong>
                  <span className="text-stone-400">{settings?.gabinete_address_poa}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00A550] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Caxias do Sul (Escritório Regional Serra):</strong>
                  <span className="text-stone-400">{settings?.gabinete_address_caxias}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canais de Atendimento */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase border-b border-stone-800 pb-2">
              Canais Diretos
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E1F200]" />
                <span>{settings?.gabinete_phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#00A550]" />
                <a
                  href={settings?.social_whatsapp || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  WhatsApp Gabinete: {settings?.gabinete_whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E1F200]" />
                <span>{settings?.gabinete_email}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('cidadao')}
                className="w-full bg-[#00A550] hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Fale com o Gabinete</span>
              </button>
            </div>
          </div>

          {/* Navegação Rápida & Cidadão */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase border-b border-stone-800 pb-2">
              Acesso Rápido
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('trajetoria')}
                  className="hover:text-[#E1F200] transition-colors"
                >
                  Biografia e Trajetória
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('atuacao')}
                  className="hover:text-[#E1F200] transition-colors"
                >
                  Atuação e Projetos de Lei
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('resultados')}
                  className="hover:text-[#E1F200] transition-colors"
                >
                  Prestação de Contas e Resultados
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('municipios')}
                  className="hover:text-[#E1F200] transition-colors"
                >
                  Municípios Atendidos
                </button>
              </li>
              <li>
                <button
                  onClick={() => openProtocolModal()}
                  className="text-[#E1F200] font-semibold hover:underline flex items-center gap-1"
                >
                  Consultar Protocolo de Demanda
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('privacidade')}
                  className="text-stone-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-[#00A550]" />
                  Privacidade & LGPD
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            © 2026 Carlos Búrigo. Todos os direitos reservados. Plataforma de comunicação institucional e relacionamento com a sociedade gaúcha.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('privacidade')}
              className="hover:text-stone-300 transition-colors"
            >
              Termos e Proteção de Dados (LGPD)
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('admin')}
              className="text-[#00A550] hover:text-emerald-400 font-semibold"
            >
              Área Administrativa
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
