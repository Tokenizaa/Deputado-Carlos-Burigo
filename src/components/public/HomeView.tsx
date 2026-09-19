import React from 'react';
import { ArrowRight, FileText, Landmark, MessageSquare, Newspaper, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { TrajectorySection } from './TrajectorySection';
import { ActionsAndProjectsSection } from './ActionsAndProjectsSection';
import { ResultsSection } from './ResultsSection';
import { AgendaSection } from './AgendaSection';
import { NewsSection } from './NewsSection';
import { VideosSection } from './VideosSection';

const QUICK_LINKS = [
  { view: 'atuacao', label: 'Atuação parlamentar', detail: 'Proposições, votações, participações e documentos', icon: Scale },
  { view: 'trajetoria', label: 'Trajetória pública', detail: 'História e registros da atuação pública', icon: Landmark },
  { view: 'transparencia', label: 'Transparência', detail: 'Fontes, critérios e documentos públicos', icon: FileText },
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
              Consulte a atuação parlamentar, a trajetória pública, documentos, transparência e canais de participação.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
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

      <section id="atuacao" className="scroll-mt-28 border-b border-stone-200 bg-[#006b32] text-white" aria-labelledby="home-atuacao">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/75">Atuação parlamentar</p>
            <h2 id="home-atuacao" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Consulte os registros do mandato.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/90">
              Proposições, votações, participações e documentos permanecem vinculados ao acervo legislativo público.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('atuacao')}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 text-base font-bold text-[#006b32] hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Consultar atuação
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <div id="acervo" className="scroll-mt-28"><ActionsAndProjectsSection initialSubTab="visao-geral" /></div>
      <div id="resultados" className="scroll-mt-28"><ResultsSection /></div>

      <section id="transparencia" className="scroll-mt-28 border-b border-stone-200 bg-stone-50" aria-labelledby="home-transparencia">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#006b32]">Transparência</p>
            <h2 id="home-transparencia" className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Consulte a informação junto da sua fonte.
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              O portal reúne registros públicos e indica de onde cada informação vem. Não transforma rascunho em publicação, nem substitui documento oficial por texto editorial.
            </p>
          </div>

          <div className="mt-10 grid border border-stone-200 bg-white md:grid-cols-2 lg:grid-cols-4">
            {[
              ['O que é público', 'Atuação, trajetória, documentos, resultados, agenda, notícias e vídeos que estejam publicados no acervo.'],
              ['Dados pessoais', 'Quando uma informação contiver dado pessoal desnecessário, a publicação deve aplicar minimização ou anonimização.'],
              ['O que não aparece', 'Rascunhos, registros internos e itens sem publicação não são apresentados como informação pública.'],
              ['Fonte', 'Quando houver documento ou fonte oficial externa, o portal preserva o vínculo para permitir a conferência.'],
            ].map(([title, text]) => (
              <article key={title} className="border-b border-stone-200 p-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <h3 className="text-base font-bold text-stone-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-sm leading-6 text-stone-500">
            A referência temporal de cada registro é a data indicada no próprio acervo. A classificação do conteúdo não substitui a análise jurídica ou administrativa exigida para cada caso.
          </p>
        </div>
      </section>

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
    </main>
  );
};
