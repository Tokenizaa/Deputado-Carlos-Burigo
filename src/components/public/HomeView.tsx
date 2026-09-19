import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { TrajectorySection } from './TrajectorySection';
import { ActionsAndProjectsSection } from './ActionsAndProjectsSection';
import { ResultsSection } from './ResultsSection';
import { AgendaSection } from './AgendaSection';
import { NewsSection } from './NewsSection';
import { VideosSection } from './VideosSection';

export const HomeView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="w-full bg-white text-stone-950">
      <HeroSection />

      <TrajectorySection />

      <div id="acervo" className="scroll-mt-28"><ActionsAndProjectsSection initialSubTab="visao-geral" /></div>
      <div id="resultados" className="scroll-mt-28"><ResultsSection /></div>

      <div id="agenda" className="scroll-mt-28"><AgendaSection /></div>
      <div id="noticias" className="scroll-mt-28"><NewsSection limit={3} /></div>
      <div id="videos" className="scroll-mt-28"><VideosSection /></div>

      <section id="contato" className="scroll-mt-28 border-t border-stone-200 bg-stone-950 text-white" aria-labelledby="home-contato">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-stone-400">Participação cidadã</p>
            <h2 id="home-contato" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Fale com o Gabinete
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-300">
              Envie uma solicitação, dúvida ou manifestação pelo canal de contato do portal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('contato')}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 text-base font-bold text-stone-950 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Abrir contato
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};
