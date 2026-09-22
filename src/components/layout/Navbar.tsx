import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, PhoneCall, ChevronDown, LayoutDashboard } from 'lucide-react';

const MORE_ITEMS = [
  ['projetos', 'Proposições'],
  ['votacoes', 'Votações'],
  ['resultados', 'Resultados'],
  ['municipios', 'Municípios'],
  ['videos', 'Vídeos'],
  ['documentos', 'Documentos'],
  ['contato', 'Contato'],
  ['acessibilidade', 'Acessibilidade'],
] as const;

const pathFor = (view: string) => {
  const anchors: Record<string, string> = {
    home: '#inicio',
    trajetoria: '#trajetoria',
    atuacao: '#atuacao',
    projetos: '#acervo',
    votacoes: '#acervo',
    resultados: '#resultados',
    agenda: '#agenda',
    noticias: '#noticias',
    videos: '#videos',
    documentos: '#acervo',
    transparencia: '#transparencia',
    contato: '#contato',
  };
  return anchors[view] ? `/${anchors[view]}` : `/${view}`;
};

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
    setCurrentView('home');
    const anchor = pathFor(view).replace('/#', '');
    if (anchor) window.setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
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
    `inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A550] ${
      active
        ? 'bg-stone-100 text-[#006b32] font-semibold'
        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center gap-5">
          <a
            href="/"
            onClick={(event) => { event.preventDefault(); navigate('home'); }}
            className="flex min-h-11 min-w-0 shrink-0 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A550]"
            aria-label="Carlos Búrigo — Início"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#00863f] text-xs font-bold text-white">CB</span>
            <span className="hidden xl:block">
              <span className="block text-lg font-bold leading-tight tracking-tight text-stone-900">Carlos Búrigo</span>
              <span className="block text-xs font-medium leading-tight text-stone-600">Deputado Estadual • RS</span>
            </span>
          </a>

          <nav id="menu-principal" className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Navegação principal">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className={linkClass(currentView === 'home')}>Início</a>
            <a href="/#trajetoria" onClick={(e) => { e.preventDefault(); navigate('trajetoria'); }} className={linkClass(currentView === 'trajetoria' || currentView === 'sobre')}>Trajetória</a>
            <a href="/#noticias" onClick={(e) => { e.preventDefault(); navigate('noticias'); }} className={linkClass(currentView === 'noticias' || currentView === 'noticia-detalhe')}>Notícias</a>
            <a href="/#agenda" onClick={(e) => { e.preventDefault(); navigate('agenda'); }} className={linkClass(currentView === 'agenda')}>Agenda</a>

            <div ref={moreRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((open) => !open)}
                className={linkClass(activeMore)}
              >
                Mais
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-stone-200 bg-white p-2 shadow-lg" role="menu" aria-label="Mais opções">
                  <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">Explorar</div>
                  {MORE_ITEMS.map(([id, label]) => (
                    <a
                      key={id}
                      href={pathFor(id)}
                      role="menuitem"
                      onClick={(event) => { event.preventDefault(); navigate(id); }}
                      className={`flex min-h-10 items-center rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-[#00A550] ${
                        currentView === id ? 'bg-stone-100 font-semibold text-[#006b32]' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {label}
                    </a>
                  ))}

                  <div className="my-2 border-t border-stone-200" />

                  <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">Serviços</div>
                  <form onSubmit={handleLookupSubmit} className="relative mb-1">
                    <label htmlFor="protocol-search" className="sr-only">Consultar protocolo</label>
                    <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-stone-500" aria-hidden="true" />
                    <input
                      id="protocol-search"
                      type="text"
                      placeholder="Consultar protocolo"
                      value={lookupInput}
                      onChange={(e) => setLookupInput(e.target.value)}
                      className="h-10 w-full rounded-md border border-stone-300 bg-stone-50 pl-9 pr-3 text-sm text-stone-900 placeholder-stone-500 focus-visible:outline-2 focus-visible:outline-[#00863f]"
                    />
                  </form>
                  <a href="/minhas-demandas" role="menuitem" className="flex min-h-10 items-center rounded-md px-3 text-sm text-stone-700 hover:bg-stone-50">Minhas demandas</a>
                  <a href="/admin" role="menuitem" className="flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-stone-700 hover:bg-stone-50">
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Acesso do gabinete
                  </a>
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            <a
              href="/admin"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00863f]"
              aria-label="Acessar dashboard"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">Dashboard</span>
            </a>
            <a
              href="/#contato"
              onClick={(e) => { e.preventDefault(); navigate('contato'); }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#00863f] px-4 text-sm font-semibold text-white hover:bg-[#006b32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00863f]"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">Fale com o Deputado</span>
              <span className="xl:hidden">Fale conosco</span>
            </a>
          </div>

          <div className="hidden items-center md:flex lg:hidden">
            <a href="/#contato" onClick={(e) => { e.preventDefault(); navigate('contato'); }} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#00863f] px-3 text-sm font-semibold text-white">
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Fale com o Deputado
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden lg:hidden">
            <a href="/contato" onClick={(e) => { e.preventDefault(); navigate('contato'); }} className="inline-flex min-h-11 items-center rounded-md bg-[#00863f] px-3 text-sm font-semibold text-white">
              Fale com o Deputado
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
