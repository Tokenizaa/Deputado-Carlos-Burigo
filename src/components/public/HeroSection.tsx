import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Building2, FileText, PhoneCall, PlayCircle } from 'lucide-react';

interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customContent?: Record<string, any>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ customTitle, customSubtitle, customContent }) => {
  const { settings, media, videos, setCurrentView } = useApp();

  const headline = customContent?.headline || customTitle || settings?.institutional_title || 'Carlos Búrigo';
  const subtitle = customContent?.subtitle || customSubtitle || 'Trajetória, atuação pública e informação para o cidadão.';

  const heroImage =
    customContent?.imageUrl ||
    media.find((item) => item.category === 'fotos' && item.mimeType.startsWith('image/') && item.url)?.url;

  const featuredVideo = videos.find((video) => video.featured && video.status === 'ativo') || videos.find((video) => video.status === 'ativo');

  return (
    <section className="bg-stone-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="relative min-h-[620px] rounded-[2rem] overflow-hidden bg-stone-900">
          {heroImage ? (
            <img
              src={heroImage}
              alt={customContent?.imageAlt || 'Carlos Búrigo'}
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 bg-stone-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          <div className="relative z-10 min-h-[620px] flex items-end p-7 sm:p-10 lg:p-14">
            <div className="max-w-3xl">
              <p className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.18em]">
                Portal institucional
              </p>

              <h1 className="mt-5 text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.9]">
                {headline}
              </h1>

              <p className="mt-5 text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed font-medium">
                {subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentView('trajetoria')}
                  className="inline-flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white font-black px-5 py-3.5 rounded-xl transition-colors"
                >
                  Conheça a trajetória
                  <ArrowRight className="w-4 h-4 text-[#E1F200]" />
                </button>
                <button
                  onClick={() => setCurrentView('atuacao')}
                  className="inline-flex items-center gap-2 bg-white text-stone-950 hover:bg-stone-100 font-black px-5 py-3.5 rounded-xl transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#00A550]" />
                  Ver atuação
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white text-stone-950 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentView('atuacao')}
            className="group flex items-center gap-4 p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#00A550]" />
            </span>
            <span>
              <strong className="block text-sm font-black">Projetos e atuação</strong>
              <span className="text-xs text-stone-500">Informações legislativas e documentação</span>
            </span>
          </button>

          <button
            onClick={() => setCurrentView('videos')}
            className="group flex items-center gap-4 p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <PlayCircle className="w-5 h-5 text-[#00A550]" />
            </span>
            <span>
              <strong className="block text-sm font-black">Vídeos</strong>
              <span className="text-xs text-stone-500">{featuredVideo ? 'Conteúdos em destaque' : 'Conteúdos audiovisuais'}</span>
            </span>
          </button>

          <button
            onClick={() => setCurrentView('contato')}
            className="group flex items-center gap-4 p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-[#00A550]" />
            </span>
            <span>
              <strong className="block text-sm font-black">Gabinete</strong>
              <span className="text-xs text-stone-500">Canais de contato e atendimento</span>
            </span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-7 flex items-start gap-3">
          <Building2 className="w-5 h-5 text-[#00A550] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-wider font-black text-stone-500">Gabinete</p>
            <p className="mt-1 text-sm font-semibold text-stone-800">{settings?.gabinete_address_poa || 'Assembleia Legislativa do Rio Grande do Sul'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
