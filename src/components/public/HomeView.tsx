import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { TrajectorySection } from './TrajectorySection';
import { ActionsAndProjectsSection } from './ActionsAndProjectsSection';
import { ResultsSection } from './ResultsSection';
import { AgendaSection } from './AgendaSection';
import { NewsSection } from './NewsSection';
import { VideosSection } from './VideosSection';
import { CitizenPortalView } from '../citizen/CitizenPortalView';

export const HomeView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="w-full">
      <HeroSection />

      <TrajectorySection />

      <ActionsAndProjectsSection initialSubTab="visao-geral" />

      <ResultsSection />

      <section className="border-y border-stone-200 bg-stone-50 py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#00863f]">Transparência</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              Consulte como as informações públicas são organizadas.
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Critérios de publicação, fontes, tratamento de dados e contexto do acervo estão reunidos em uma página própria.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('transparencia')}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-800 hover:bg-stone-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"
          >
            Ver transparência
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <AgendaSection />

      <NewsSection limit={3} />

      <VideosSection />

      <CitizenPortalView />
    </div>
  );
};
