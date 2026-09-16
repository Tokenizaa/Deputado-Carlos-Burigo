import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Building2, CalendarDays, FileText, PhoneCall, PlayCircle } from 'lucide-react';

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
  const { settings, media, videos, setCurrentView } = useApp();
  const mode = settings?.site_mode || 'institutional';

  const headline = customContent?.headline || customTitle || settings?.candidate_name || 'Carlos Búrigo';
  const slogan = customContent?.highlightPhrase || customSubtitle || settings?.campaign_slogan || 'Atuação pública, trajetória e informação em um só lugar.';

  const mediaImage =
    media.find((item) => item.category === 'campanha' && item.mimeType.startsWith('image/'))?.url ||
    media.find((item) => item.category === 'fotos' && item.mimeType.startsWith('image/'))?.url;

  const heroImage = customContent?.imageUrl || mediaImage;
  const featuredVideo = videos.find((video) => video.featured && video.status === 'ativo') || videos.find((video) => video.status === 'ativo');

  return (
    <section className="bg-stone-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px] rounded-3xl overflow-hidden bg-stone-900">
          <div className="lg:col-span-7 relative flex items-end">
            {heroImage ? (
              <img
                src={heroImage}
                alt={customContent?.imageAlt || 'Carlos Búrigo'}
                className="absolute inset-0 w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 bg-[#006f38] flex items-center justify-center">
                <span className="text-[clamp(8rem,22vw,18rem)] font-black text-white/10 leading-none select-none">CB</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 p-7 sm:p-10 lg:p-12 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#E1F200]" />
                {mode === 'campaign' ? 'Eleições 2026' : 'Atuação pública'}
              </div>

              <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.92]">
                {headline}
              </h1>

              <p className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
                {slogan}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentView('atuacao')}
                  className="inline-flex items-center gap-2 bg-[#00A550] hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
                >
                  Conheça a atuação
                  <ArrowRight className="w-4 h-4 text-[#E1F200]" />
                </button>
                <button
                  onClick={() => setCurrentView('cidadao')}
                  className="inline-flex items-center gap-2 bg-white text-stone-950 hover:bg-stone-100 font-bold px-5 py-3.5 rounded-xl transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#00A550]" />
                  Fale com o gabinete
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white text-stone-950 p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-black text-[#00A550]">Portal público</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                Informação, atuação e contato.
              </h2>
              <p className="mt-4 text-stone-600 leading-relaxed">
                Consulte projetos, notícias, vídeos, agenda e canais de atendimento em um único lugar.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <button
                onClick={() => setCurrentView('atuacao')}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left transition-colors"
              >
                <span className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#00A550]" />
                </span>
                <span>
                  <strong className="block text-sm font-black">Projetos e atuação</strong>
                  <span className="text-xs text-stone-500">Proposições e informações legislativas</span>
                </span>
              </button>

              <button
                onClick={() => setCurrentView('noticias')}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/60 text-left transition-colors"
              >
                <span className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-[#00A550]" />
                </span>
                <span>
                  <strong className="block text-sm font-black">Notícias e agenda</strong>
                  <span className="text-xs text-stone-500">Atualizações e compromissos públicos</span>
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
                  <span className="text-xs text-stone-500">
                    {featuredVideo ? 'Conteúdos em destaque' : 'Conteúdos audiovisuais'}
                  </span>
                </span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-[#00A550] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider font-black text-stone-500">Gabinete</p>
                <p className="mt-1 text-sm font-semibold text-stone-800">
                  {settings?.gabinete_address_poa || 'Porto Alegre • Assembleia Legislativa do RS'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
