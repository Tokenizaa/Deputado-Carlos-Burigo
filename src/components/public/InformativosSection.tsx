import React, { useMemo } from 'react';
import { ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAppUi } from '../../context/AppUiContext';

export const InformativosSection: React.FC = () => {
  const { documents, setCurrentView } = useApp();
  const { openDocumentViewer } = useAppUi();

  const informativos = useMemo(() => (
    documents
      .filter((document) => (
        document.title?.toLowerCase().includes('informativo') ||
        document.storagePath?.toLowerCase().startsWith('informativos/')
      ))
      .slice(0, 3)
  ), [documents]);

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
              Publicações do gabinete reunidas no acervo documental.
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

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {informativos.map((document) => {
            const url = document.publicUrl || document.originalUrl;
            return (
              <article key={document.id} className="flex min-h-56 flex-col justify-between border border-stone-200 bg-white p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008C45]">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Informativo
                  </div>
                  <h3 className="mt-4 text-xl font-bold leading-snug text-stone-950">
                    {document.title || 'Informativo do Gabinete'}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    Publicação do gabinete disponível no acervo documental.
                  </p>
                </div>

                {url && (
                  <button
                    type="button"
                    onClick={() => openDocumentViewer(url, document.title || 'Informativo', 'pdf')}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-stone-900 hover:text-[#008C45]"
                  >
                    Ler informativo
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
