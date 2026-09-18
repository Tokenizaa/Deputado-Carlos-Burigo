import React, { useMemo, useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAppUi } from '../../context/AppUiContext';
import { extractLegislativeCode } from '../../contracts/publicLegislative';

export const ResultsSection: React.FC = () => {
  const { results, legislativeItems } = useApp();
  const { openDocumentViewer } = useAppUi();
  const [category, setCategory] = useState('TODOS');
  const [municipality, setMunicipality] = useState('TODOS');

  const publishedItems = useMemo(
    () => new Map(legislativeItems.filter((item) => item.status === 'PUBLISHED').map((item) => [item.id, item])),
    [legislativeItems],
  );

  const categories = useMemo(() => [...new Set(results.map((result) => result.category).filter(Boolean))].sort(), [results]);
  const municipalities = useMemo(() => [...new Set(results.map((result) => result.municipality).filter(Boolean))].sort() as string[], [results]);

  const documentedResults = useMemo(() => results.map((result) => {
    const code = extractLegislativeCode(result.title);
    const item = [...publishedItems.values()].find((candidate) => candidate.code.toUpperCase() === code?.toUpperCase());
    return { result, item, code };
  }).filter(({ item }) => Boolean(item)), [results, publishedItems]);

  const filteredResults = documentedResults.filter(({ result }) =>
    (category === 'TODOS' || result.category === category)
    && (municipality === 'TODOS' || result.municipality === municipality)
  );

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-10">
          <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider block mb-2">Prestação de contas</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Resultados e pautas documentados</h2>
          <p className="mt-3 text-stone-600 text-base max-w-[65ch]">
            Cada registro exibido está vinculado a uma proposição legislativa publicada e verificada na fonte canônica.
            O portal não transforma uma frase de divulgação em resultado sem essa base documental.
          </p>
        </header>

        {results.length > 0 && (
          <div className="mb-10 border border-stone-200 bg-stone-50 p-4 sm:p-5 rounded-sm">
            <div className="flex flex-col lg:flex-row gap-3">
              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Categoria" className="min-h-11 bg-white border border-stone-300 rounded-md px-3 text-sm text-stone-900">
                <option value="TODOS">Todas as categorias</option>
                {categories.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <select value={municipality} onChange={(event) => setMunicipality(event.target.value)} aria-label="Município" className="min-h-11 bg-white border border-stone-300 rounded-md px-3 text-sm text-stone-900">
                <option value="TODOS">Todos os municípios</option>
                {municipalities.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <span className="self-center text-sm text-stone-600">{filteredResults.length} registro(s) documentado(s)</span>
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <EmptyState message="Nenhum resultado publicado no acervo." detail="Novos registros só aparecem depois de validação e publicação." />
        ) : documentedResults.length === 0 ? (
          <EmptyState message="Não há resultados com vínculo legislativo publicável." detail="Os registros sem base legislativa publicada não são apresentados como resultados factuais." />
        ) : filteredResults.length === 0 ? (
          <EmptyState message="Nenhum registro corresponde aos filtros." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResults.map(({ result, item, code }) => (
              <article key={result.id} className="border border-stone-200 rounded-sm p-6 sm:p-8 bg-stone-50/50 space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-semibold text-[#00A550]">{result.category}</span>
                    {result.date && <span>• {result.date}</span>}
                    {result.municipality && <span>• {result.municipality}</span>}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 leading-snug">{result.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed editorial-prose">{result.description}</p>
                </div>
                {result.metrics && <div className="border-t border-stone-200 pt-4 text-sm font-semibold text-stone-900">{result.metrics}</div>}
                <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
                  <p className="font-semibold text-stone-900">Base legislativa</p>
                  <p className="text-stone-600">{code || item?.code} · {item?.title || 'Proposição publicada'}</p>
                  <p className="text-xs text-stone-500">Situação: {item?.status} · verificação: {item?.verificationStatus}</p>
                  {item?.sourceUrl && (
                    <button type="button" onClick={() => openDocumentViewer(item.sourceUrl!, `Fonte oficial — ${item.code}`, 'pdf')} className="min-h-11 text-[#00863F] font-semibold inline-flex items-center gap-1.5">
                      <FileText className="w-4 h-4" aria-hidden="true" /> Ler fonte oficial <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const EmptyState: React.FC<{ message: string; detail?: string }> = ({ message, detail }) => (
  <div className="border border-dashed border-stone-300 rounded-sm p-8 sm:p-10 bg-stone-50 text-stone-600">
    <p className="font-semibold text-stone-900">{message}</p>
    {detail && <p className="mt-2 text-sm">{detail}</p>}
  </div>
);
