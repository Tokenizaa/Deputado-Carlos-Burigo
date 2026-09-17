import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { MobileAccordion } from './MobileAccordion';

export const TrajectorySection: React.FC = () => {
  const { projects, setCurrentView } = useApp();
  const publishedProjects = projects
    .filter((project) => project.status === 'Concluído')
    .sort((a, b) => b.year - a.year)
    .slice(0, 4);

  return (
    <section className="bg-white border-b border-stone-200 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 bg-[#00A550]" />
            <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">TRAJETÓRIA PÚBLICA</span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">ACERVO DOCUMENTADO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.06]">Uma trajetória parlamentar que pode ser consultada pelo acervo.</h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-[65ch]">Em vez de reproduzir biografia ou avaliações sem fonte no frontend, esta área apresenta registros legislativos publicados e validados no acervo da plataforma.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-stone-50 border border-stone-200 rounded-[2px] overflow-hidden sticky top-28">
              <div className="aspect-4/5 bg-stone-100 overflow-hidden">
                <img src="/assets/alrs_parlamento.jpg" alt="Registro de atividade parlamentar" className="w-full h-full object-cover filter contrast-[1.02]" loading="lazy" width={800} height={1000} referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/carlos_burigo_portrait.png'; }} />
              </div>
              <div className="p-5 bg-white border-t border-stone-200">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-xs">Acervo público</span>
                <p className="text-xs text-stone-600 leading-normal mt-1">Imagem utilizada como registro visual institucional; detalhes documentais devem ser consultados nas respectivas fontes.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            {publishedProjects.length === 0 ? (
              <div className="border border-dashed border-stone-300 rounded-sm p-8 text-stone-600"><p className="font-semibold text-stone-900">Nenhum marco legislativo publicado no acervo.</p><p className="mt-2 text-sm">Novos registros aparecerão após validação e publicação.</p></div>
            ) : (
              publishedProjects.map((item) => (
                <MobileAccordion key={item.id} title={item.title} summary={`${item.year} · ${item.code}`}>
                  <article className="pt-6 first:pt-0 border-t border-stone-200 group">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                      <div className="sm:col-span-4">
                        <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 block leading-none group-hover:text-[#00A550] transition-colors">{item.year}</span>
                        <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.1em] block mt-1.5">{item.code}</span>
                      </div>
                      <div className="sm:col-span-8 space-y-1.5">
                        <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">{item.title}</h3>
                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{item.status}</p>
                        <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-1 max-w-[55ch]">{item.summary}</p>
                      </div>
                    </div>
                  </article>
                </MobileAccordion>
              ))
            )}

            <div className="pt-6 border-t border-stone-200">
              <button type="button" onClick={() => setCurrentView('atuacao')} className="h-[50px] min-h-[48px] px-8 py-3.5 bg-stone-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider rounded-[2px] transition-colors inline-flex items-center gap-3 cursor-pointer"><span>CONSULTAR ACERVO LEGISLATIVO</span><ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
