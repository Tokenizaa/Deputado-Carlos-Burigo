import React, { useMemo } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAppUi } from '../../context/AppUiContext';

export const InformativosSection: React.FC = () => {
  const { documents, media, setCurrentView } = useApp();
  const { openDocumentViewer } = useAppUi();

  const informativos = useMemo(() => (
    documents
      .filter((document) => (
        document.title?.toLowerCase().includes('informativo') ||
        document.storagePath?.toLowerCase().startsWith('informativos/')
      ))
      .slice(0, 3)
  ), [documents]);

  const capas = useMemo(() => (
    media
      .filter((item) => (
        String(item.category).toLowerCase() === 'documento/capa_informativo' &&
        Boolean(item.url) &&
        String(item.mimeType || '').startsWith('image/')
      ))
      .slice(0, 3)
  ), [media]);

  if (informativos.length === 0) return null;

  return (
    <section id="informativos" className="scroll-mt-28 border-t border-stone-200 bg-stone-50 py-16 sm:py-20" aria-labelledby="informativos-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008C45]">Publicações</p>
            <h2 id="informativos-title" className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Informativos
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Publicações do gabinete.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('documentos')}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-stone-900 hover:text-[#008C45] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008C45]"
          >
            Veja mais
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {informativos.map((document, index) => {
            const url = document.publicUrl || document.originalUrl;
            const capa = capas[index];

            return (
              <article key={document.id} className="group overflow-hidden border border-stone-200 bg-white">
                <button
                  type="button"
                  disabled={!url}
                  onClick={() => url && openDocumentViewer(url, document.title || 'Informativo', 'pdf')}
                  className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#008C45] disabled:cursor-default"
                  aria-label={url ? `Abrir ${document.title || 'informativo'}` : undefined}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                    {capa ? (
                      <img
                        src={capa.url}
                        alt={capa.altText || document.title || 'Capa do informativo'}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-stone-500">
                        Capa do informativo
                      </div>
                    )}
                  </div>
                </button>

                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#008C45]">Informativo</p>
                    <h3 className="mt-1 truncate text-base font-bold text-stone-950">
                      {document.title || 'Informativo do Gabinete'}
                    </h3>
                  </div>

                  {url && (
                    <button
                      type="button"
                      onClick={() => openDocumentViewer(url, document.title || 'Informativo', 'pdf')}
                      className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-bold text-stone-900 hover:text-[#008C45] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008C45]"
                    >
                      Ler
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
