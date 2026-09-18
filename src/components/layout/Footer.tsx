import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, MoreHorizontal } from 'lucide-react';

const MORE_ITEMS = [
  ['trajetoria', 'Trajetória'],
  ['projetos', 'Proposições'],
  ['votacoes', 'Votações'],
  ['atuacao', 'Comissões'],
  ['resultados', 'Resultados'],
  ['agenda', 'Agenda'],
  ['municipios', 'Municípios'],
  ['videos', 'Vídeos'],
  ['documentos', 'Documentos'],
  ['transparencia', 'Transparência'],
  ['contato', 'Contato'],
  ['acessibilidade', 'Acessibilidade'],
] as const;

export const Footer: React.FC = () => {
  const { currentView, setCurrentView, openProtocolModal } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = (view: string) => { setMoreOpen(false); setCurrentView(view); };

  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-28 lg:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-stone-800">
          <div className="space-y-4">
            <div>
              <span className="text-white font-bold text-lg block">Carlos Búrigo</span>
              <span className="text-stone-400 text-sm block mt-1">Deputado Estadual • Rio Grande do Sul</span>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed max-w-sm">Portal institucional de acompanhamento da atuação parlamentar, notícias, agenda, documentos e canais de participação cidadã.</p>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="text-stone-100 font-bold">Gabinete Parlamentar</h4>
            <div className="space-y-1.5 text-stone-300">
              <p className="font-semibold text-white">Assembleia Legislativa do RS</p>
              <p>Praça Marechal Deodoro, 130</p>
              <p>Centro Histórico • Porto Alegre — RS</p>
              <p>10º andar — Sala 1002</p>
              <p>Telefone: (51) 3210-2000</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="text-stone-100 font-bold">Navegação institucional</h4>
            <nav aria-label="Links institucionais" className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                ['home', 'Início'], ['trajetoria', 'Trajetória'], ['atuacao', 'Atuação'],
                ['noticias', 'Notícias'], ['agenda', 'Agenda'], ['documentos', 'Documentos'],
                ['acessibilidade', 'Acessibilidade'], ['contato', 'Fale com o Gabinete'],
              ].map(([id, label]) => (
                <a key={id} href={id === 'home' ? '/' : `/${id}`} onClick={(e) => { e.preventDefault(); navigate(id); }} className="min-h-11 inline-flex items-center text-stone-300 hover:text-white focus-visible:outline-2 focus-visible:outline-[#00A550]">{label}</a>
              ))}
            </nav>
          </div>

          <div className="space-y-3 text-sm">
            <h4 className="text-stone-100 font-bold">Atendimento e transparência</h4>
            <p className="text-stone-300 leading-relaxed">Acesse canais de participação cidadã, documentos públicos e informações institucionais.</p>
            <button type="button" onClick={() => navigate('contato')} className="w-full min-h-11 rounded-md bg-[#00863f] px-3 font-semibold text-white hover:bg-[#006b32] focus-visible:outline-2 focus-visible:outline-[#00863f]">Fale com o Gabinete</button>
            <button type="button" onClick={() => openProtocolModal()} className="w-full min-h-11 rounded-md border border-stone-600 px-3 font-medium text-stone-200 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-[#00A550]">Consultar Protocolo</button>
          </div>
        </div>

        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <p>© {new Date().getFullYear()} Deputado Estadual Carlos Búrigo • Assembleia Legislativa do Estado do Rio Grande do Sul.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/acessibilidade" onClick={(e) => { e.preventDefault(); navigate('acessibilidade'); }} className="hover:text-stone-300">Acessibilidade</a>
            <a href="/privacidade" onClick={(e) => { e.preventDefault(); navigate('privacidade'); }} className="hover:text-stone-300">Privacidade & LGPD</a>
            <a href="https://ww4.al.rs.gov.br/legislativo" target="_blank" rel="noreferrer" className="hover:text-stone-300 inline-flex items-center gap-1">ALRS Oficial <ExternalLink className="h-3 w-3" aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-stone-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]" aria-label="Navegação principal móvel">
        <nav className="grid grid-cols-4 max-w-2xl mx-auto" aria-label="Navegação principal">
          {[
            ['home', 'Início'], ['atuacao', 'Atuação'], ['noticias', 'Notícias'],
          ].map(([id, label]) => (
            <a key={id} href={id === 'home' ? '/' : `/${id}`} onClick={(e) => { e.preventDefault(); navigate(id); }} className={`min-h-14 px-2 flex items-center justify-center text-sm font-semibold border-t-2 focus-visible:outline-2 focus-visible:outline-[#00863f] ${currentView === id || (id === 'atuacao' && ['projetos','votacoes'].includes(currentView)) ? 'border-[#00863f] text-[#006b32]' : 'border-transparent text-stone-700'}`}>{label}</a>
          ))}
          <button type="button" aria-expanded={moreOpen} aria-haspopup="menu" onClick={() => setMoreOpen((open) => !open)} className={`min-h-14 px-2 flex items-center justify-center gap-1 text-sm font-semibold border-t-2 focus-visible:outline-2 focus-visible:outline-[#00863f] ${moreOpen ? 'border-[#00863f] text-[#006b32]' : 'border-transparent text-stone-700'}`}>
            Mais <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
        {moreOpen && (
          <div className="absolute bottom-full inset-x-0 max-h-[70vh] overflow-y-auto border-t border-stone-200 bg-white shadow-lg p-3" role="menu" aria-label="Mais opções">
            <div className="grid grid-cols-2 gap-1">
              {MORE_ITEMS.map(([id, label]) => (
                <a key={id} href={`/${id}`} role="menuitem" onClick={(e) => { e.preventDefault(); navigate(id); }} className="min-h-11 rounded-md px-3 flex items-center text-sm text-stone-800 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-[#00863f]">{label}</a>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
