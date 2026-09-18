import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Lock,
  Menu,
  X,
  PhoneCall,
  ChevronDown,
  FileText,
  FolderOpen,
  Vote,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, currentView, setCurrentView, openProtocolModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [actuationDropdownOpen, setActuationDropdownOpen] = useState(false);
  const [lookupInput, setLookupInput] = useState('');

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupInput.trim()) {
      openProtocolModal(lookupInput.trim());
      setLookupInput('');
    }
  };

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    {
      id: 'atuacao',
      label: 'Atuação',
      hasDropdown: true,
      subItems: [
        { id: 'projetos', label: 'Projetos de Lei', icon: FileText },
        { id: 'votacoes', label: 'Votações', icon: Vote },
        { id: 'documentos', label: 'Acervo Documental', icon: FolderOpen },
      ],
    },
    { id: 'noticias', label: 'Notícias' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      {/* Institutional Top Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Official Institutional Subtitle */}
          <div className="flex items-center gap-3">
            <span className="text-stone-400 font-medium tracking-wide">
              Assembleia Legislativa do Rio Grande do Sul
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="text-stone-400 hidden sm:inline">
              Gabinete do Deputado Estadual Carlos Búrigo
            </span>
          </div>

          {/* Right: Campanha Link & Gabinete Access */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('campanha')}
              className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                currentView === 'campanha'
                  ? 'bg-[#00A550] text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Campanha 2026
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-1.5 text-stone-400 hover:text-white text-xs transition-colors"
              title="Acesso Administrativo ao Gabinete"
            >
              <Lock className="w-3 h-3 text-stone-400" />
              <span>Gabinete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identification */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3.5 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-sm bg-[#00A550] text-white flex items-center justify-center font-bold text-sm tracking-tight shrink-0 shadow-xs">
              CB
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 block leading-tight group-hover:text-[#00A550] transition-colors">
                Carlos Búrigo
              </span>
              <span className="text-xs font-medium text-stone-600 tracking-normal block">
                Deputado Estadual • Rio Grande do Sul
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navegação Institucional">
            {navItems.map((item) => {
              const active =
                currentView === item.id ||
                (item.hasDropdown &&
                  ['atuacao', 'projetos', 'votacoes', 'documentos'].includes(currentView));

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActuationDropdownOpen(true)}
                    onMouseLeave={() => setActuationDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setCurrentView('atuacao')}
                      className={`flex items-center gap-1 px-3 py-2 text-[15px] font-medium transition-colors border-b-2 ${
                        active
                          ? 'border-[#00A550] text-[#00A550] font-semibold'
                          : 'border-transparent text-stone-700 hover:text-stone-950 hover:bg-stone-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    </button>

                    {/* Clean Editorial Dropdown */}
                    {actuationDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 bg-white border border-stone-200 shadow-lg rounded-md py-2 z-50 animate-in fade-in duration-150">
                        {item.subItems?.map((sub) => {
                          const Icon = sub.icon;
                          const isSubActive = currentView === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setCurrentView(sub.id);
                                setActuationDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                                isSubActive
                                  ? 'bg-stone-50 text-[#00A550] font-semibold'
                                  : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                              }`}
                            >
                              <Icon className="w-4 h-4 text-[#00A550] shrink-0" />
                              <span>{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-2 text-[15px] font-medium transition-colors border-b-2 ${
                    active
                      ? 'border-[#00A550] text-[#00A550] font-semibold'
                      : 'border-transparent text-stone-700 hover:text-stone-950 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Search & Gabinete CTA */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleLookupSubmit} className="relative">
              <input
                type="text"
                placeholder="Protocolo..."
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                className="w-36 focus:w-48 text-xs bg-stone-50 border border-stone-300 rounded-md pl-8 pr-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white text-stone-900 placeholder-stone-400 transition-all"
                aria-label="Consultar protocolo"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            <button
              onClick={() => setCurrentView('cidadao')}
              className="bg-[#00A550] hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gabinete</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setCurrentView('cidadao')}
              className="bg-[#00A550] text-white text-xs font-bold px-3 py-2 rounded-md"
            >
              Gabinete
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-stone-950 hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Abrir navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-4 pb-6 space-y-4">
          <form onSubmit={handleLookupSubmit} className="relative">
            <input
              type="text"
              placeholder="Consultar protocolo (ex: #2026-004821)..."
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              className="w-full text-sm bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2.5 text-stone-900"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </form>

          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-md text-base font-medium ${
                currentView === 'home' ? 'text-[#00A550] font-bold bg-emerald-50' : 'text-stone-800'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => {
                setCurrentView('sobre');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-md text-base font-medium ${
                currentView === 'sobre' || currentView === 'trajetoria'
                  ? 'text-[#00A550] font-bold bg-emerald-50'
                  : 'text-stone-800'
              }`}
            >
              Sobre
            </button>

            <div className="py-1">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-3">
                Atuação Parlamentar
              </span>
              <div className="mt-1 pl-2 space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('atuacao');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'atuacao' ? 'text-[#00A550] font-bold' : 'text-stone-700'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => {
                    setCurrentView('projetos');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'projetos' ? 'text-[#00A550] font-bold' : 'text-stone-700'
                  }`}
                >
                  Projetos de Lei
                </button>
                <button
                  onClick={() => {
                    setCurrentView('votacoes');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'votacoes' ? 'text-[#00A550] font-bold' : 'text-stone-700'
                  }`}
                >
                  Votações & Posicionamentos
                </button>
                <button
                  onClick={() => {
                    setCurrentView('resultados');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'resultados' ? 'text-[#00A550] font-bold' : 'text-stone-700'
                  }`}
                >
                  Resultados
                </button>
                <button
                  onClick={() => {
                    setCurrentView('documentos');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'documentos' ? 'text-[#00A550] font-bold' : 'text-stone-700'
                  }`}
                >
                  Documentos Oficiais
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentView('noticias');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-md text-base font-medium ${
                currentView === 'noticias' ? 'text-[#00A550] font-bold bg-emerald-50' : 'text-stone-800'
              }`}
            >
              Notícias
            </button>

            <button
              onClick={() => {
                setCurrentView('videos');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-md text-base font-medium ${
                currentView === 'videos' ? 'text-[#00A550] font-bold bg-emerald-50' : 'text-stone-800'
              }`}
            >
              Vídeos
            </button>

            <button
              onClick={() => {
                setCurrentView('contato');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2.5 rounded-md text-base font-medium ${
                currentView === 'contato' ? 'text-[#00A550] font-bold bg-emerald-50' : 'text-stone-800'
              }`}
            >
              Contato
            </button>

            <button
              onClick={() => {
                setCurrentView('campanha');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-md text-base font-semibold text-emerald-800 bg-emerald-50/50 mt-2"
            >
              Campanha 2026
            </button>
          </nav>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            <button
              onClick={() => {
                setCurrentView('cidadao');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#00A550] text-white py-3 rounded-md font-semibold text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Atendimento do Gabinete
            </button>

            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 border border-stone-200 text-stone-600 py-2 rounded-md text-xs font-medium hover:bg-stone-50"
            >
              <Lock className="w-3.5 h-3.5" />
              Acesso Administrativo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
