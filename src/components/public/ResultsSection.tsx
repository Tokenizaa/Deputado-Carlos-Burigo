import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp } from 'lucide-react';

export const ResultsSection: React.FC = () => {
  const { results } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-[#00A550] uppercase tracking-wider block mb-2">
            Prestação de Contas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Resultados documentados
          </h2>
          <p className="mt-3 text-stone-600 text-base max-w-[65ch]">
            Esta seção apresenta somente resultados registrados e disponibilizados no acervo público da plataforma.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="border border-dashed border-stone-300 rounded-sm p-8 sm:p-10 bg-stone-50 text-stone-600">
            <p className="font-semibold text-stone-900">Nenhum resultado publicado no acervo.</p>
            <p className="mt-2 text-sm">Novos registros aparecerão aqui após validação e publicação pela equipe responsável.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((res) => (
              <div
                key={res.id}
                className="border border-stone-200 rounded-sm p-6 sm:p-8 flex flex-col justify-between bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-[#00A550]">{res.category}</span>
                    {res.date && <span>{res.date}</span>}
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 leading-snug">{res.title}</h3>

                  <p className="text-stone-600 text-sm leading-relaxed editorial-prose">{res.description}</p>
                </div>

                {res.metrics && (
                  <div className="pt-4 border-t border-stone-200 flex items-center gap-2 text-xs font-semibold text-stone-900">
                    <TrendingUp className="w-4 h-4 text-[#00A550] shrink-0" />
                    <span>{res.metrics}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
