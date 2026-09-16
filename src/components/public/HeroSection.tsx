import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, PhoneCall, ShieldCheck, Award, Landmark } from 'lucide-react';

interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customContent?: Record<string, any>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  customTitle,
  customSubtitle,
  customContent,
}) => {
  const { setCurrentView } = useApp();

  const heroImage =
    customContent?.imageUrl || '/assets/carlos_burigo_portrait.png';

  return (
    <section className="relative bg-[#0A0A0A] text-white border-b border-stone-850 overflow-hidden min-h-[80vh] lg:min-h-[85vh] flex items-center">
      {/* Background Architectural Grid Accent - Discrete & High-End */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f0a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Editorial Content: 40% Desktop Weight */}
          <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1 space-y-8">
            {/* Eyebrow / Institutional Label */}
            <div className="inline-flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#00A550] shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">
                ATUAÇÃO PÚBLICA
              </span>
              <span className="text-stone-700">•</span>
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                RIO GRANDE DO SUL
              </span>
            </div>

            {/* Headline with Strong Weight Contrast (500 vs 800) and Large Scale */}
            <div className="space-y-1">
              <h1 className="tracking-tight text-white leading-none">
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-medium text-stone-300 tracking-normal mb-1">
                  Carlos
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] text-white uppercase">
                  BÚRIGO
                </span>
              </h1>
              <p className="text-sm font-semibold text-[#00A550] uppercase tracking-[0.08em] pt-1">
                Deputado Estadual • Líder da Bancada do MDB
              </p>
            </div>

            {/* Subtitle / Lead phrase */}
            <p className="text-lg sm:text-xl text-stone-300 font-normal leading-relaxed max-w-[50ch]">
              Trajetória, presença e atuação no Rio Grande do Sul. Defesa firme da liberdade econômica, rigor na gestão pública e representação ativa de cada região gaúcha.
            </p>

            {/* Action CTAs with presence: >= 48px height, strong contrast, straight corners */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('atuacao')}
                className="h-[50px] min-h-[48px] px-8 py-3.5 bg-[#00A550] hover:bg-emerald-600 text-white font-bold text-sm sm:text-base uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-[0.98] group"
                aria-label="Conheça a atuação do Deputado Carlos Búrigo"
              >
                <span>CONHEÇA A ATUAÇÃO</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('cidadao')}
                className="h-[50px] min-h-[48px] px-6 py-3.5 glass-card-dark text-white hover:bg-white/10 font-semibold text-sm sm:text-base uppercase tracking-wider rounded-[2px] transition-colors inline-flex items-center justify-center gap-2.5 cursor-pointer"
                aria-label="Fale com o gabinete parlamentar"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>FALE COM O GABINETE</span>
              </button>
            </div>

            {/* Controlled Glassmorphism Institutional Badge on Dark Canvas */}
            <div className="glass-card-dark p-4 sm:p-5 rounded-[4px] border-l-2 border-l-[#00A550]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#00A550] shrink-0" />
                  <span>Autor da Lei da Silvicultura (Lei 16.445/2025)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00A550] shrink-0" />
                  <span>Líder da Bancada do MDB na ALRS</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2 text-stone-400 border-t border-white/10 pt-2 mt-1">
                  <Landmark className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>9 anos Secretário da Fazenda • Ex-Secretário de Governo do RS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photographic Dominance: 60% Visual Presence with Noble Composition */}
          <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Photo Frame with subtle dark border and contrast backing */}
              <div className="relative aspect-4/5 sm:aspect-11/12 lg:aspect-4/5 bg-[#141414] rounded-[2px] overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Carlos Búrigo - Deputado Estadual pelo Rio Grande do Sul"
                  className="w-full h-full object-cover object-top filter contrast-[1.03]"
                  fetchPriority="high"
                  loading="eager"
                  width={900}
                  height={1125}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://upload.wikimedia.org/wikipedia/commons/8/8c/Secret%C3%A1rio_Carlos_B%C3%BArigo_durante_uma_entrevista.png';
                  }}
                />

                {/* Subtle bottom shadow vignette for seamless integration, no colored gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

                {/* Controlled Glassmorphism Tag on Bottom of Photo */}
                <div className="absolute bottom-4 left-4 right-4 glass-card-dark px-4 py-3 rounded-[2px] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white uppercase tracking-wider block">Carlos Búrigo</span>
                    <span className="text-stone-300">Assembleia Legislativa do RS • Gabinete Parlamentar</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#00A550] uppercase tracking-wider bg-emerald-950/60 px-2 py-0.5 border border-emerald-500/30">
                    Bancada MDB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


