import React from 'react';
import { ArrowRight, CalendarDays, FileText, Landmark, MessageSquare, Newspaper, Scale, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { TrajectorySection } from './TrajectorySection';
import { ActionsAndProjectsSection } from './ActionsAndProjectsSection';
import { ResultsSection } from './ResultsSection';
import { AgendaSection } from './AgendaSection';
import { NewsSection } from './NewsSection';
import { VideosSection } from './VideosSection';

const QUICK_LINKS = [
  { view: 'trajetoria', label: 'Trajetória', detail: 'Conheça a história pública', icon: Landmark },
  { view: 'atuacao', label: 'Atuação parlamentar', detail: 'Proposições, votos e comissões', icon: Scale },
  { view: 'transparencia', label: 'Transparência', detail: 'Fontes, documentos e critérios', icon: FileText },
  { view: 'contato', label: 'Fale com o Gabinete', detail: 'Envie uma solicitação', icon: MessageSquare },
] as const;

export const HomeView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="w-full bg-white">
      <HeroSection />

      <section className="border-b border-stone-200 bg-stone-50" aria-labelledby="acesso-rapido">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#006b32]">Acesso rápido</p>
              <h2 id="acesso-rapido" className="mt-1 text-xl font-bold text-stone-950 sm:text-2xl">Encontre o que procura</h2>
            </div>
            <span className="hidden text-sm text-stone-500 sm:block">Informação pública em linguagem direta</span>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map(({ view, label, detail, icon: Icon }) => (
              <button
                key={view}
                type="button"
                onClick={() => setCurrentView(view)}
                className="group flex min-h-28 items-start gap-4 bg-white p-5 text-left hover:bg-[#f7fbf8] focus-visible:z-10"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#008740]" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-stone-950 group-hover:text-[#006b32]">{label}</span>
                  <span className="mt-1 block text-sm leading-5 text-stone-600">{detail}</span>
                </span>
                <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-stone-400 group-hover:text-[#006b32]" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <TrajectorySection />

      <section className="border-b border-stone-200 bg-white py-10 sm:py-14" aria-labelledby="atualizacoes">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
          <div className="border-l-4 border-[#008740] bg-stone-50 p-5">
            <Landmark className="h-5 w-5 text-[#008740]" aria-hidden="true" />
            <h2 id="atualizacoes" className="mt-3 text-lg font-bold text-stone-950">Mandato e atuação</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">Consulte o acervo parlamentar e a participação pública.</p>
          </div>
          <div className="border-l-4 border-stone-300 bg-stone-50 p-5">
            <CalendarDays className="h-5 w-5 text-stone-700" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-bold text-stone-950">Agenda pública</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">Acompanhe compromissos publicados pelo gabinete.</p>
          </div>
          <div className="border-l-4 border-stone-300 bg-stone-50 p-5">
            <Newspaper className="h-5 w-5 text-stone-700" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-bold text-stone-950">Notícias</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">Veja as publicações mais recentes do portal.</p>
          </div>
        </div>
      </section>

      <ActionsAndProjectsSection initialSubTab="visao-geral" />
      <ResultsSection />

      <section className="border-b border-stone-200 bg-stone-50 py-12 sm:py-16" aria-labelledby="transparencia-home">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#006b32]">Transparência</p>
            <h2 id="transparencia-home" className="mt-2 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              Informação pública com fonte e contexto.
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Consulte critérios de publicação, documentos públicos e a origem das informações disponibilizadas no portal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('transparencia')}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-stone-950 px-5 text-base font-semibold text-white hover:bg-stone-800"
          >
            Ver transparência
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <AgendaSection />
      <NewsSection limit={3} />
      <VideosSection />

      <section className="border-t border-stone-200 bg-[#006b32] text-white" aria-labelledby="fale-gabinete-home">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-white/80">Participação cidadã</p>
            <h2 id="fale-gabinete-home" className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Fale com o Gabinete
            </h2>
            <p className="mt-3 text-base leading-7 text-white/90">
              Envie uma solicitação, dúvida ou manifestação pelo canal de contato do portal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('contato')}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 text-base font-semibold text-[#006b32] hover:bg-stone-100"
          >
            Abrir contato
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};
