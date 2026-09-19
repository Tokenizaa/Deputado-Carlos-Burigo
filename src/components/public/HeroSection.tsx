import React from 'react';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  customTitle?: string;
  customSubtitle?: string;
  customContent?: Record<string, any>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ customTitle, customSubtitle, customContent }) => {
  const { settings } = useApp();
  const name = settings?.candidate_name || 'Carlos Búrigo';
  const image = customContent?.imageUrl || '/assets/carlos_burigo_portrait.png';
  const role = settings?.institutional_title || 'Deputado Estadual';

  return (
    <section id="inicio" className="scroll-mt-28 border-b border-stone-200 bg-white" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-12">
        <div className="relative min-h-[430px] overflow-hidden bg-stone-100 lg:col-span-6 lg:min-h-[620px]">
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
        </div>

        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:col-span-6 lg:px-12 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#006b32]">
            {customSubtitle || role}
          </p>
          <h1 id="hero-title" className="mt-3 text-4xl font-bold tracking-[-0.035em] text-stone-950 sm:text-5xl lg:text-6xl">
            {customTitle || name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
            Carlos Búrigo construiu sua trajetória entre a administração pública municipal, funções no Governo do Estado e a atuação parlamentar na Assembleia Legislativa do Rio Grande do Sul.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Neste portal, o cidadão pode consultar sua trajetória, atuação parlamentar, documentos, resultados, agenda, notícias, vídeos e canais de participação — todos organizados na mesma página.
          </p>
        </div>
      </div>
    </section>
  );
};