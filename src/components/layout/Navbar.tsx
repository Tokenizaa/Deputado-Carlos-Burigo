import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, PhoneCall, ChevronDown } from 'lucide-react';

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

const pathFor = (view: string) => view === 'home' ? '/' : `/${view}`;

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, openProtocolModal } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [lookupInput, setLookupInput] = useState('');

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const navigate = (view: string) => {
    setMoreOpen(false);
    setCurrentView(view);
  };

  const activeMore = MORE_ITEMS.some(([id]) => id === currentView);

  const handleLookupSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (lookupInput.trim()) {
      openProtocolModal(lookupInput.trim());
      setLookupInput('');
    }
  };

  const linkClass = (active: boolean) =>
    `inline-flex min-h-11 items-center px-3 border-b-2 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A550] ${
      active
        ? 'border-[#00863f] text-[#006b32] font-semibold'
        : 'border-transparent text-stone-700 hover:text-stone-950 hover:bg-stone-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <a
            href="/"
            onClick={(event) => { event.preventDefault(); navigate('home'); }}
            className="flex min-h-11 items-center gap-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A550]"
            aria-label="Carlos Búrigo — Início"
          >
            <span className="w-10 h-10 rounded-sm bg-[#00863f] text-white flex items-center justify-center font-bold text-sm shrink-0">CB</span>
            <span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 block leading-tight">Carlos Búrigo</span>
              <span className="text-sm font-medium text-stone-600 block">Deputado Estadual • Rio Grande do Sul</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className={linkClass(currentView === 'home')}>Início</a>
            <a href="/trajetoria" onClick={(e) => { e.preventDefault(); navigate('trajetoria'); }} className={linkClass(currentView === 'trajetoria' || currentView === 'sobre')}>Trajetória</a>
            <a href="/atuacao" onClick={(e) => { e.preventDefault(); navigate('atuacao'); }} className={linkClass(['atuacao','projetos','votacoes'].includes(currentView))}>Atuação</a>
            <a href="/noticias" onClick={(e) => { e.preventDefault(); navigate('noticias'); }} className={linkClass(currentView === 'noticias' || currentView === 'noticia-detalhe')}>Notícias</a>
            <a href="/agenda" onClick={(e) => { e.preventDefault(); navigate('agenda'); }} className={linkClass(currentView === 'agenda')}>Agenda</a>

            <div ref={moreRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((open) => !open)}
                className={linkClass(activeMore)}
              >
                Mais <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 rounded-md border border-stone-200 bg-white py-2 shadow-lg" role="menu" aria-label="Mais opções">
                  {MORE_ITEMS.map(([id, label]) => (
                    <a
                      key={id}
                      href={pathFor(id)}
                      role="menuitem"
                      onClick={(event) => { event.preventDefault(); navigate(id); }}
                      className={`flex min-h-11 items-center px-4 text-sm focus-visible:outline-2 focus-visible:outline-[#00A550] ${
                        currentView === id ? 'bg-stone-50 font-semibold text-[#006b32]' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/contato"
              onClick={(e) => { e.preventDefault(); navigate('contato'); }}
              className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#00863f] px-4 text-sm font-semibold text-white hover:bg-[#006b32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00863f]"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Fale com o Deputado
            </a>
          </nav>

          <div className="hidden md:flex lg:hidden items-center">
            <a href="/contato" onClick={(e) => { e.preventDefault(); navigate('contato'); }} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#00863f] px-3 text-sm font-semibold text-white">
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Fale com o Deputado
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-2 md:hidden">
            <a href="/contato" onClick={(e) => { e.preventDefault(); navigate('contato'); }} className="inline-flex min-h-11 items-center rounded-md bg-[#00863f] px-3 text-sm font-semibold text-white">
              Fale com o Deputado
            </a>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-end pb-3">
          <form onSubmit={handleLookupSubmit} className="relative w-44">
            <label htmlFor="protocol-search" className="sr-only">Consultar protocolo</label>
            <input id="protocol-search" type="text" placeholder="Consultar protocolo" value={lookupInput} onChange={(e) => setLookupInput(e.target.value)} className="h-11 w-full rounded-md border border-stone-300 bg-stone-50 pl-9 pr-3 text-sm text-stone-900 placeholder-stone-500 focus-visible:outline-2 focus-visible:outline-[#00863f]" />
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" aria-hidden="true" />
          </form>
        </div>
      </div>
    </header>
  );
};
