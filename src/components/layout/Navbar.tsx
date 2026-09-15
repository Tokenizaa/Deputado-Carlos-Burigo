import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Lock,
  Menu,
  X,
  PhoneCall,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, currentView, setCurrentView, openProtocolModal, updateSettings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lookupInput, setLookupInput] = useState('');

  const mode = settings?.site_mode || 'campaign';

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupInput.trim()) {
      openProtocolModal(lookupInput.trim());
      setLookupInput('');
    }
  };

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'trajetoria', label: 'Trajetória' },
    { id: 'atuacao', label: 'Atuação & Leis' },
    { id: 'resultados', label: 'Resultados' },
    { id: 'noticias', label: 'Notícias' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'municipios', label: 'Municípios' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Institutional Top Bar (MDB Identity & Mode Indicator) */}
      <div className="bg-[#111827] text-white text-xs px-4 py-1.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Identity and Mode */}
          <div className="flex items-center gap-3">
            {/* Official MDB Badge */}
            <div className="flex items-center gap-1.5 bg-[#00A550] text-white px-2 py-0.5 rounded font-bold tracking-wider text-[11px]">
              <span>MDB</span>
              <span className="text-[#E1F200] font-black">{settings?.party_number || '15'}</span>
            </div>

            {mode === 'campaign' && (
              <span className="flex items-center gap-1.5 text-stone-200 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E1F200] animate-pulse" />
                <strong className="text-white font-semibold">Eleições 2026:</strong> Candidato a Deputado Estadual • Número{' '}
                <span className="bg-[#E1F200] text-stone-900 font-extrabold px-1.5 py-0.2 rounded text-[11px]">
                  {settings?.electoral_number || '15140'}
                </span>
              </span>
            )}

            {mode === 'mandate' && (
              <span className="text-stone-300">
                <strong className="text-white font-semibold">Mandato Parlamentar:</strong> Líder da Bancada do MDB na Assembleia Legislativa do RS
              </span>
            )}

            {mode === 'institutional' && (
              <span className="text-stone-300">
                <strong className="text-white font-semibold">Atuação Pública:</strong> Compromisso e Responsabilidade com o Rio Grande
              </span>
            )}
          </div>

          {/* Right: Mode Switcher & Admin link */}
          <div className="flex items-center gap-3">
            {/* Quick Mode Preview Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-stone-800/80 px-2 py-0.5 rounded text-[11px] text-stone-300">
              <span className="text-stone-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E1F200]" /> Modo:
              </span>
              {(['campaign', 'mandate', 'institutional'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => updateSettings({ site_mode: m })}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    mode === m
                      ? 'bg-[#00A550] text-white font-bold'
                      : 'hover:text-white text-stone-400'
                  }`}
                  title={`Alternar para modo ${m}`}
                >
                  {m === 'campaign' ? 'Campanha' : m === 'mandate' ? 'Mandato' : 'Institucional'}
                </button>
              ))}
            </div>

            {/* Direct Admin Access Button */}
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors text-[11px] font-medium border border-stone-700 px-2 py-0.5 rounded"
              title="Área Administrativa do Gabinete"
            >
              <Lock className="w-3 h-3 text-[#E1F200]" />
              <span>Acesso Gabinete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Identification */}
          <div
            onClick={() => setCurrentView('home')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-lg bg-[#00A550] text-white flex flex-col items-center justify-center font-black leading-none shadow-sm group-hover:bg-emerald-700 transition-colors">
              <span className="text-xs tracking-tighter">RS</span>
              <span className="text-base text-[#E1F200]">15</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  CARLOS BÚRIGO
                </span>
                {mode === 'campaign' && (
                  <span className="bg-[#ED1C24] text-white font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded">
                    15140
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-stone-600">
                {mode === 'campaign'
                  ? 'Candidato a Deputado Estadual • MDB'
                  : mode === 'mandate'
                  ? 'Deputado Estadual • Assembleia Legislativa do RS'
                  : 'Liderança Pública e Gestão • Rio Grande do Sul'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Navegação Principal">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    active
                      ? 'text-[#00A550] bg-emerald-50/80 font-bold border-b-2 border-[#00A550]'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: Protocol Lookup & Citizen Portal CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Protocol Lookup Form */}
            <form onSubmit={handleLookupSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Consultar protocolo..."
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                className="w-44 focus:w-56 text-xs bg-stone-100 border border-stone-300 rounded-full pl-8 pr-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#00A550] focus:bg-white transition-all text-stone-800 placeholder-stone-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Primary Action Button: Fale com o Gabinete */}
            <button
              onClick={() => setCurrentView('cidadao')}
              className="flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-xs transition-all hover:shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-[#E1F200]" />
              <span>Fale com o Gabinete</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setCurrentView('cidadao')}
              className="bg-[#00A550] text-white text-xs font-bold px-3 py-2 rounded-md"
            >
              Gabinete
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleLookupSubmit} className="relative mb-2">
            <input
              type="text"
              placeholder="Digite o número de protocolo (ex: #2026-004821)..."
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              className="w-full text-xs bg-stone-100 border border-stone-300 rounded-lg pl-8 pr-3 py-2 text-stone-800"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === item.id
                    ? 'bg-emerald-50 text-[#00A550] font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView('cidadao');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#00A550] text-white py-2.5 rounded-lg font-bold text-sm"
            >
              <PhoneCall className="w-4 h-4 text-[#E1F200]" />
              Fale com o Gabinete (Portal do Cidadão)
            </button>

            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 border border-stone-300 text-stone-700 py-2 rounded-lg text-xs font-semibold hover:bg-stone-50"
            >
              <Lock className="w-3.5 h-3.5" />
              Área Administrativa do Gabinete
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
