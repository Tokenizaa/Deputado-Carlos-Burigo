import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle, TrendingUp, HeartHandshake, Shield, Sparkles } from 'lucide-react';

export const ResultsSection: React.FC = () => {
  const { results } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Prestação de Contas
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Resultados Reais Entregues ao Rio Grande
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            A política que vale a pena é aquela que sai do papel e transforma a vida das pessoas com recursos garantidos e leis eficazes.
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00A550] bg-emerald-50 px-2.5 py-1 rounded">
                    {res.category}
                  </span>
                  {res.date && (
                    <span className="text-xs text-stone-400 font-medium">
                      {res.date}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-stone-900 leading-snug">
                  {res.title}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed">
                  {res.description}
                </p>
              </div>

              {res.metrics && (
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-stone-800 bg-stone-50 p-3 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-[#00A550] shrink-0" />
                  <span>{res.metrics}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
