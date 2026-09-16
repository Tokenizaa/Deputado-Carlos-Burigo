import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const TrajectorySection: React.FC = () => {
  const { setCurrentView } = useApp();

  const timelineMilestones = [
    {
      year: '1997',
      role: 'PREFEITO',
      place: 'São José dos Ausentes',
      period: 'Dois mandatos consecutivos (1997–2004)',
      summary:
        'Primeiro prefeito eleito após a emancipação. Estruturou os serviços básicos de saúde, transporte escolar rural e integrou a região dos Campos de Cima da Serra.',
    },
    {
      year: '2005',
      role: 'GESTÃO EM CAXIAS',
      place: 'Secretaria Municipal da Fazenda',
      period: '9 anos à frente das finanças (2005–2014)',
      summary:
        'A convite de José Ivo Sartori, liderou o equilíbrio fiscal do segundo maior PIB do RS, modernizou a arrecadação e viabilizou recursos para obras públicas estruturantes.',
    },
    {
      year: '2015',
      role: 'GOVERNO DO ESTADO',
      place: 'Palácio Piratini',
      period: 'Secretário-Geral e Secretário de Planejamento (2015–2018)',
      summary:
        'Coordenação central da administração estadual, renegociação da dívida pública com a União e desenho de reformas essenciais para a sustentabilidade fiscal do RS.',
    },
    {
      year: '2019',
      role: 'ASSEMBLEIA LEGISLATIVA',
      place: 'Deputado Estadual & Líder da Bancada MDB',
      period: 'Mandato Parlamentar (2019–presente)',
      summary:
        'Voz ativa contra o aumento de impostos (voto contrário ao aumento do ICMS), liderança da Bancada do MDB e autor da histórica Lei da Silvicultura (Lei 16.445/2025).',
    },
  ];

  return (
    <section className="bg-white border-b border-stone-200 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 bg-[#00A550]" />
            <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">
              TRAJETÓRIA PÚBLICA
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              LINHA DO TEMPO
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.06]">
            Uma vida pública construída entre gestão municipal, rigor fiscal e representação parlamentar.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-[65ch]">
            Contador de formação pela Unisinos com raízes nos Campos de Cima da Serra, Carlos Búrigo uniu conhecimento técnico contábil à experiência prática de quem governou prefeitura, secretaria municipal e secretarias de Estado.
          </p>
        </div>

        {/* Editorial Grid: Photo + Typography-driven Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Authentic Photographic Anchor */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-stone-50 border border-stone-200 rounded-[2px] overflow-hidden sticky top-28 shadow-xs">
              <div className="aspect-4/5 bg-stone-100 overflow-hidden">
                <img
                  src="/assets/alrs_parlamento.jpg"
                  alt="Carlos Búrigo em atividade no plenário da Assembleia Legislativa do Rio Grande do Sul"
                  className="w-full h-full object-cover filter contrast-[1.02]"
                  loading="lazy"
                  width={800}
                  height={1000}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/carlos_burigo_portrait.png';
                  }}
                />
              </div>
              <div className="p-5 bg-white border-t border-stone-200">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-bold text-stone-900 uppercase tracking-wider">Assembleia Legislativa do RS</span>
                  <span className="text-[#00A550] font-semibold">Palácio Farroupilha</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">
                  Carlos Búrigo em atividade parlamentar de plenário e comissões permanentes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Timeline with Big Numbers and Clean Horizontal Lines */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-12">
            <div className="space-y-10">
              {timelineMilestones.map((item, index) => (
                <div
                  key={item.year}
                  className="pt-6 first:pt-0 border-t border-stone-200 group transition-all"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                    {/* Big Graphic Year Number (Television / Infographic Scale) */}
                    <div className="sm:col-span-4">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 block leading-none group-hover:text-[#00A550] transition-colors">
                        {item.year}
                      </span>
                      <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.1em] block mt-1.5">
                        {item.role}
                      </span>
                    </div>

                    {/* Milestones Content with Strict Contrast and Hierarchy */}
                    <div className="sm:col-span-8 space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                        {item.place}
                      </h3>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        {item.period}
                      </p>
                      <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-1 max-w-[55ch]">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* High-Contrast Action Button */}
            <div className="pt-6 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setCurrentView('sobre')}
                className="h-[50px] min-h-[48px] px-8 py-3.5 bg-stone-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider rounded-[2px] transition-colors inline-flex items-center gap-3 cursor-pointer group"
              >
                <span>CONHECER BIOGRAFIA COMPLETA</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

