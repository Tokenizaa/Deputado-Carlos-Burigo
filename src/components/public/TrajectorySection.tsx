import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const TrajectorySection: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="bg-white border-b border-stone-200 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 bg-[#00A550]" />
            <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">TRAJETÓRIA PÚBLICA</span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">ACERVO DOCUMENTADO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.06]">
            Uma trajetória parlamentar que pode ser consultada pelo acervo.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-[65ch]">
            A trajetória pública é apresentada por registros documentados e fontes públicas. Projetos de lei, votações e documentos ficam concentrados na área de atuação parlamentar.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setCurrentView('atuacao')}
              className="min-h-12 px-6 py-3 bg-stone-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider rounded-[2px] transition-colors inline-flex items-center gap-3 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"
            >
              <span>Ver atuação parlamentar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
