import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, PhoneCall, Landmark } from 'lucide-react';

interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customContent?: Record<string, any>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ customTitle, customSubtitle, customContent }) => {
  const { settings, setCurrentView } = useApp();
  const heroImage = customContent?.imageUrl || '/assets/carlos_burigo_portrait.png';
  const name = settings?.candidate_name || 'Carlos Búrigo';
  const institutionalTitle = settings?.institutional_title || 'Atuação pública';

  return (
    <section className="relative bg-[#0A0A0A] text-white border-b border-stone-850 overflow-hidden min-h-[80vh] lg:min-h-[85vh] flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f0a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1 space-y-8">
            <div className="inline-flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#00A550] shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">ATUAÇÃO PÚBLICA</span>
              <span className="text-stone-700">•</span>
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">RIO GRANDE DO SUL</span>
            </div>

            <div className="space-y-1">
              <h1 className="tracking-tight text-white leading-none">
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-medium text-stone-300 tracking-normal mb-1">{name.split(' ')[0]}</span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] text-white uppercase">{name.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-sm font-semibold text-[#00A550] uppercase tracking-[0.08em] pt-1">{customSubtitle || institutionalTitle}</p>
            </div>

            <p className="text-lg sm:text-xl text-stone-300 font-normal leading-relaxed max-w-[50ch]">
              {customTitle || settings?.seo_default_description || 'Informações institucionais, atuação parlamentar e acervo público.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button type="button" onClick={() => setCurrentView('atuacao')} className="h-[50px] min-h-[48px] px-8 py-3.5 bg-[#00A550] hover:bg-emerald-600 text-white font-bold text-sm sm:text-base uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center justify-center gap-3 cursor-pointer" aria-label="Conheça a atuação pública">
                <span>CONHEÇA A ATUAÇÃO</span><ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setCurrentView('cidadao')} className="h-[50px] min-h-[48px] px-6 py-3.5 glass-card-dark text-white hover:bg-white/10 font-semibold text-sm sm:text-base uppercase tracking-wider rounded-[2px] transition-colors inline-flex items-center justify-center gap-2.5 cursor-pointer" aria-label="Fale com o gabinete parlamentar">
                <PhoneCall className="w-4 h-4 text-emerald-400" /><span>FALE COM O GABINETE</span>
              </button>
            </div>

            <div className="glass-card-dark p-4 sm:p-5 rounded-[4px] border-l-2 border-l-[#00A550]">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Landmark className="w-4 h-4 text-[#00A550] shrink-0" />
                <span>{institutionalTitle || 'Informações institucionais'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative aspect-4/5 sm:aspect-11/12 lg:aspect-4/5 bg-[#141414] rounded-[2px] overflow-hidden border border-white/15 shadow-2xl">
                <img src={heroImage} alt={name} className="w-full h-full object-cover object-top filter contrast-[1.03]" fetchPriority="high" loading="eager" width={900} height={1125} referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/carlos_burigo_portrait.png'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 glass-card-dark px-4 py-3 rounded-[2px] text-xs">
                  <span className="font-bold text-white uppercase tracking-wider block">{name}</span>
                  <span className="text-stone-300">{institutionalTitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
