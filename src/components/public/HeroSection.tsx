import React from 'react';
import { ArrowRight, Landmark, PhoneCall } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customContent?: Record<string, any>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ customTitle, customSubtitle, customContent }) => {
  const { settings, setCurrentView } = useApp();
  const name = settings?.candidate_name || 'Carlos Búrigo';
  const image = customContent?.imageUrl || '/assets/carlos_burigo_portrait.png';
  const role = settings?.institutional_title || 'Deputado Estadual';
  const description = customTitle || settings?.seo_default_description || 'Informações institucionais, atuação parlamentar e acervo público.';

  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:col-span-7 lg:px-12 lg:py-20">
          <div className="mb-7 flex items-center gap-3 text-sm font-semibold text-[#006b32]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#008740]" aria-hidden="true" />
            <span>Atuação pública · Rio Grande do Sul</span>
          </div>

          <p className="mb-3 text-base font-semibold text-stone-600">{customSubtitle || role}</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.035em] text-stone-950 sm:text-5xl lg:text-6xl">
            Carlos Búrigo
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('trajetoria')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#008740] px-5 text-base font-semibold text-white hover:bg-[#006b32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006b32]"
            >
              Conheça a trajetória
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('contato')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-5 text-base font-semibold text-stone-900 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006b32]"
            >
              <PhoneCall className="h-4 w-4 text-[#006b32]" aria-hidden="true" />
              Fale com o Gabinete
            </button>
          </div>

          <div className="mt-10 flex items-start gap-3 border-t border-stone-200 pt-5 text-sm text-stone-600">
            <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-[#008740]" aria-hidden="true" />
            <span>Portal institucional com informações públicas, atuação parlamentar e documentos de interesse do cidadão.</span>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-stone-100 lg:col-span-5 lg:min-h-[620px]">
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover object-top"
            fetchPriority="high"
            loading="eager"
            width={900}
            height={1125}
            referrerPolicy="no-referrer"
            onError={(event) => { (event.target as HTMLImageElement).src = '/assets/carlos_burigo_portrait.png'; }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/70 p-6 text-white">
            <p className="text-sm font-semibold">{name}</p>
            <p className="mt-1 text-sm text-white/90">{role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
