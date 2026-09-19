import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { TrajectorySection } from './TrajectorySection';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="bg-white min-h-screen">
      <section className="border-b border-stone-200 py-16 sm:py-24 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="aspect-4/5 bg-stone-900 rounded-[2px] overflow-hidden border border-white/15 shadow-2xl max-w-md mx-auto lg:max-w-none">
                <img
                  src="/assets/carlos_burigo_portrait.png"
                  alt="Carlos Búrigo - Deputado Estadual do Rio Grande do Sul"
                  className="w-full h-full object-contain filter contrast-[1.03]"
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
                  Contador • Ex-Prefeito • Ex-Secretário de Estado
                </p>
              </div>

              <div className="space-y-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-[65ch]">
                <p>
                  Carlos Búrigo nasceu em 5 de julho de 1964. Fontes institucionais e eleitorais registram Bom Jesus/RS como local de nascimento; o site oficial de Búrigo apresenta São José dos Ausentes. O projeto mantém essa divergência documentada até sua resolução definitiva.
                </p>
                <p>
                  É formado em Ciências Contábeis pela Unisinos. Segundo registro biográfico da Câmara Municipal de Caxias do Sul, trabalhou no Banco Bradesco e como gerente financeiro das empresas Calçados Glória e Calçados Platina. Em 1993, retornou a São José dos Ausentes, onde foi chefe de gabinete e secretário de Administração até 1996.
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

      <section className="py-16 sm:py-20 border-b border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-white p-8 border border-stone-200 rounded-[2px]">
              <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                01 • FORMAÇÃO
              </span>
              <h3 className="text-xl font-bold text-stone-900">Ciências Contábeis (Unisinos)</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Formado em Ciências Contábeis pela Universidade do Vale do Rio dos Sinos (Unisinos).
              </p>
            </div>

            <div className="space-y-3 bg-white p-8 border border-stone-200 rounded-[2px]">
              <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                02 • GESTÃO PÚBLICA
              </span>
              <h3 className="text-xl font-bold text-stone-900">Atuação em Caxias do Sul</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Atuou na Prefeitura de Caxias do Sul entre 2005 e 2014, passando pela Secretaria da Fazenda e pela Secretaria de Gestão e Finanças.
              </p>
            </div>

            <div className="space-y-3 bg-white p-8 border border-stone-200 rounded-[2px]">
              <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                03 • PARLAMENTO
              </span>
              <h3 className="text-xl font-bold text-stone-900">Atuação na Assembleia Legislativa</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Exerceu mandato na Assembleia Legislativa do RS a partir de 2019 e voltou ao Parlamento em 2023. Entre as funções documentadas estão a presidência da Comissão de Educação e a vice-presidência da CCJ.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrajectorySection />
    </div>
  );
};
