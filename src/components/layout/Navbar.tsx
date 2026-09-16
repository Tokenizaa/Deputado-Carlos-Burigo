import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, currentView, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mode = settings?.site_mode || 'institutional';

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'trajetoria', label: 'Sobre' },
    { id: 'atuacao', label: 'Atuação' },
    { id: 'noticias', label: 'Notícias' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'contato', label: 'Contato' },
  ];

  const navigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-20 gap-6">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 text-left shrink-0"
            aria-label="Ir para a página inicial"
          >
            <div className="w-11 h-11 rounded-xl bg-[#00A550] text-white flex flex-col items-center justify-center font-black leading-none">
              <span className="text-[10px] tracking-tight">RS</span>
              <span className="text-base text-[#E1F200]">15</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight">CARLOS BÚRIGO</div>
              <p className="text-[11px] sm:text-xs font-medium text-stone-500">
                {mode === 'campaign'
                  ? 'Candidato a Deputado Estadual • MDB'
                  : 'Deputado Estadual • MDB'}
              </p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? 'text-[#00A550] bg-emerald-50'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center shrink-0">
            <button
              onClick={() => navigate('cidadao')}
              className="inline-flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#E1F200]" />
              Fale com o gabinete
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => navigate('cidadao')}
              className="inline-flex items-center gap-1.5 bg-[#00A550] text-white text-xs font-bold px-3 py-2.5 rounded-lg"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E1F200]" />
              Gabinete
            </button>
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-2.5 rounded-lg text-stone-700 hover:bg-stone-100"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 gap-2" aria-label="Navegação móvel">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-left px-3 py-3 rounded-lg text-sm font-semibold ${
                  currentView === item.id
                    ? 'bg-emerald-50 text-[#00A550]'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
            <button
              onClick={() => navigate('cidadao')}
              className="w-full flex items-center justify-center gap-2 bg-[#00A550] text-white py-3 rounded-lg font-bold text-sm"
            >
              <PhoneCall className="w-4 h-4 text-[#E1F200]" />
              Fale com o gabinete
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
