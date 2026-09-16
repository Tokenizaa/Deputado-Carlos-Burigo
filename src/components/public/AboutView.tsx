import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrajectorySection } from './TrajectorySection';
import { ArrowRight, GraduationCap, Building2, Landmark, Award } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Profile Header */}
      <section className="border-b border-stone-200 py-16 sm:py-24 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Real Photograph with Noble Framing */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="aspect-4/5 bg-stone-900 rounded-[2px] overflow-hidden border border-white/15 shadow-2xl max-w-md mx-auto lg:max-w-none">
                <img
                  src="/assets/carlos_burigo_portrait.png"
                  alt="Carlos Búrigo - Deputado Estadual do Rio Grande do Sul"
                  className="w-full h-full object-cover object-top filter contrast-[1.03]"
                  loading="eager"
                  width={800}
                  height={1000}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://upload.wikimedia.org/wikipedia/commons/8/8c/Secret%C3%A1rio_Carlos_B%C3%BArigo_durante_uma_entrevista.png';
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
                <span className="font-bold text-white uppercase tracking-wider">Carlos Antônio Búrigo</span>
                <span className="text-[#00A550] font-semibold">Assembleia Legislativa do RS</span>
              </div>
            </div>

            {/* Editorial Bio with Strong Typography */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-[#00A550]" />
                  <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">
                    PERFIL PÚBLICO & BIOGRAFIA
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                  Carlos Búrigo
                </h1>
                <p className="text-sm font-semibold text-stone-300 uppercase tracking-wider pt-1">
                  Contador • Ex-Prefeito • Ex-Secretário de Estado • Líder da Bancada MDB
                </p>
              </div>

              <div className="space-y-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-[65ch]">
                <p>
                  Nascido em 5 de julho de 1964 nos Campos de Cima da Serra (São José dos Ausentes), Carlos Búrigo construiu sua trajetória na vida pública fundamentada no rigor orçamentário, no equilíbrio fiscal e no profundo conhecimento das demandas de cada município gaúcho.
                </p>
                <p>
                  Casado com Danusa Liége e pai de Larissa e Felipe, formou-se em Ciências Contábeis pela Unisinos. Atuou na iniciativa privada e na agricultura antes de ser convocado a liderar a emancipação e estruturação de sua terra natal como prefeito por dois mandatos.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentView('atuacao')}
                  className="h-[48px] px-7 bg-[#00A550] hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center gap-2.5 cursor-pointer"
                >
                  <span>CONHECER ATUAÇÃO NA ALRS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars: Formação, Gestão Pública e Atuação Parlamentar */}
      <section className="py-16 sm:py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-white p-8 border border-stone-200 rounded-[2px]">
              <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                01 • FORMAÇÃO TÉCNICA
              </span>
              <h3 className="text-xl font-bold text-stone-900">Ciências Contábeis (Unisinos)</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Visão técnica dos números públicos, planejamento contábil e auditoria orçamentária que norteia sua atuação parlamentar permanente contra déficits fiscais crônicos.
              </p>
            </div>

            <div className="space-y-3 bg-white p-8 border border-stone-200 rounded-[2px]">
              <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                02 • GESTÃO PÚBLICA
              </span>
              <h3 className="text-xl font-bold text-stone-900">9 Anos na Fazenda de Caxias</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Gestão financeira exemplar ao lado de José Ivo Sartori, equilibrando contas do segundo polo do estado e viabilizando recursos para obras de saúde e mobilidade urbana.
              </p>
            </div>

            <div className="space-y-3 bg-white p-8 border border-stone-200 rounded-[2px]">
              <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                03 • PIRATINI & PARLAMENTO
              </span>
              <h3 className="text-xl font-bold text-stone-900">Liderança na ALRS</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Secretário-Geral de Governo e de Planejamento do RS (2015–2018). Na Assembleia, é Líder da Bancada do MDB e autor da histórica Lei da Silvicultura (Lei 16.445/2025).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Editorial Trajectory Timeline */}
      <TrajectorySection />
    </div>
  );
};
