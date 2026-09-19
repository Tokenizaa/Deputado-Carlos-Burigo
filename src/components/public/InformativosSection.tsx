import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InformativosSection: React.FC = () => {
  const { documents, media, setCurrentView } = useApp();

  const capas = useMemo(() => (
    media
      .filter((item) => String(item.category).toLowerCase() === 'documento/capa_informativo' && Boolean(item.url))
      .slice(0, 3)
  ), [media]);

  if (capas.length === 0) return null;

  return (
    <section id="informativos" className="scroll-mt-28 border-t border-stone-200 bg-stone-50 py-16 sm:py-20" aria-labelledby="informativos-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008C45]">Publicações</p>
            <h2 id="informativos-title" className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">Informativos</h2>
            <p className="mt-3 text-base leading-7 text-stone-600">Publicações do gabinete.</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('informativos')}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-stone-900 hover:text-[#008C45] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008C45]"
          >
            Veja mais
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {capas.map((capa) => (
            <article key={capa.id} className="overflow-hidden border border-stone-200 bg-white">
              <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                  src={capa.url}
                  alt={capa.altText || 'Capa de informativo do gabinete'}
                  className="h-full w-full object-contain"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
