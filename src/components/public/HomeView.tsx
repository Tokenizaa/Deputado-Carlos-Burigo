import React from 'react';
import { ArrowRight, Landmark, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { TrajectorySection } from './TrajectorySection';
import { ActionsAndProjectsSection } from './ActionsAndProjectsSection';
import { ResultsSection } from './ResultsSection';
import { AgendaSection } from './AgendaSection';
import { NewsSection } from './NewsSection';
import { VideosSection } from './VideosSection';

const QUICK_LINKS = [
  { view: 'trajetoria', label: 'Trajetória pública', detail: 'História e registros da atuação pública', icon: Landmark },
  { view: 'contato', label: 'Fale com o Gabinete', detail: 'Envie uma solicitação ao canal do portal', icon: MessageSquare },
] as const;

export const HomeView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="w-full bg-white text-stone-950">
      <HeroSection />

      <section className="border-b border-stone-200 bg-stone-50" aria-labelledby="home-acesso">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#006b32]">Portal institucional</p>
            <h2 id="home-acesso" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Informação pública em um só lugar.
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Consulte a trajetória pública e os canais de participação.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
            {QUICK_LINKS.map(({ view, label, detail, icon: Icon }) => (
              <button
                key={view}
                type="button"
                onClick={() => setCurrentView(view)}
                className="group min-h-32 border-b border-stone-200 bg-white p-5 text-left last:border-b-0 hover:bg-[#f7fbf8] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#006b32] sm:border-r sm:last:border-r-0 lg:border-b-0"
              >
                <span className="flex items-center justify-between gap-4">
                  <Icon className="h-5 w-5 text-[#008740]" aria-hidden="true" />
                  <ArrowRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-[#006b32]" aria-hidden="true" />
                </span>
                <span className="mt-5 block text-base font-bold group-hover:text-[#006b32]">{label}</span>
                <span className="mt-1 block text-sm leading-5 text-stone-600">{detail}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

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
