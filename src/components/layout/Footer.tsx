import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, openProtocolModal } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-400 text-sm border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Identification */}
          <div className="space-y-4">
            <div>
              <span className="text-white font-bold text-lg block tracking-tight">
                Carlos Búrigo
              </span>
              <span className="text-stone-400 text-xs block mt-0.5">
                Deputado Estadual • Rio Grande do Sul
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed editorial-prose">
              Atuação parlamentar pautada pelo rigor na gestão fiscal, presença permanente nos municípios e leis que destravam o desenvolvimento produtivo gaúcho.
            </p>

            <div className="pt-2">
              <span className="inline-block text-[11px] font-semibold text-stone-300 bg-stone-800 px-2.5 py-1 rounded">
                Assembleia Legislativa do RS • Bancada do MDB
              </span>
            </div>
          </div>

          {/* Col 2: Gabinete Central */}
          <div className="space-y-3 text-xs">
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-xs">
              Gabinete Parlamentar
            </h4>
            <div className="space-y-1.5 text-stone-300">
              <p className="font-semibold text-white">Assembleia Legislativa do RS</p>
              <p>Praça Marechal Deodoro, 130</p>
              <p>Centro Histórico • Porto Alegre — RS</p>
              <p className="text-stone-400">10º andar — Sala 1002</p>
              <p className="pt-1 text-stone-400">Telefone: (51) 3210-2000</p>
            </div>
          </div>

          {/* Col 3: Navegação Rápida */}
          <div className="space-y-3 text-xs">
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-xs">
              Navegação Institucional
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('sobre')}
                  className="hover:text-white transition-colors"
                >
                  Sobre & Trajetória
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('atuacao')}
                  className="hover:text-white transition-colors"
                >
                  Atuação & Projetos de Lei
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('noticias')}
                  className="hover:text-white transition-colors"
                >
                  Notícias e Comunicação
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('videos')}
                  className="hover:text-white transition-colors"
                >
                  Vídeos e Pronunciamentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contato')}
                  className="hover:text-white transition-colors"
                >
                  Contato do Gabinete
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('campanha')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Campanha 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparência & Protocolo */}
          <div className="space-y-3 text-xs">
            <h4 className="text-stone-200 font-bold uppercase tracking-wider text-xs">
              Atendimento e Transparência
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Consulte o andamento de solicitações ou registre novas demandas de seu município diretamente com nossa equipe técnica.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setCurrentView('cidadao')}
                className="w-full bg-[#00A550] hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded text-xs transition-colors text-center block"
              >
                Fale com o Gabinete
              </button>

              <button
                onClick={() => openProtocolModal()}
                className="w-full border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-medium py-2 px-3 rounded text-xs transition-colors text-center block"
              >
                Consultar Protocolo
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} Deputado Estadual Carlos Búrigo • Assembleia Legislativa do Estado do Rio Grande do Sul.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('acessibilidade')}
              className="hover:text-stone-300 transition-colors"
            >
              Acessibilidade
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('privacidade')}
              className="hover:text-stone-300 transition-colors"
            >
              Privacidade & LGPD
            </button>
            <span>•</span>
            <a
              href="https://ww4.al.rs.gov.br/legislativo"
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-300 transition-colors inline-flex items-center gap-1"
            >
              ALRS Oficial <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]" aria-label="Navegação principal móvel">
        <div className="grid grid-cols-6 max-w-2xl mx-auto">
          {[
            ['home', 'Início'],
            ['atuacao', 'Atuação'],
            ['noticias', 'Notícias'],
            ['agenda', 'Agenda'],
            ['municipios', 'Municípios'],
            ['contato', 'Contato'],
          ].map(([view, label]) => (
            <button
              key={view}
              type="button"
              onClick={() => setCurrentView(view)}
              className="min-h-[64px] px-1 flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-stone-600 hover:text-[#00A550] active:bg-stone-50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

  </footer>
  );
};
