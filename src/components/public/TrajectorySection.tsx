import React from 'react';
import { Briefcase, GraduationCap, MapPin, Landmark, Award, CheckCircle } from 'lucide-react';

export const TrajectorySection: React.FC = () => {
  const milestones = [
    {
      period: 'Origens & Formação',
      role: 'Campos de Cima da Serra & Formação em Contabilidade',
      location: 'São José dos Ausentes e São Leopoldo',
      description:
        'Nascido em 5 de julho de 1964 em São José dos Ausentes, viveu sua infância e juventude auxiliando os pais na lida do campo. Graduou-se em Ciências Contábeis pela Universidade do Vale do Rio dos Sinos (Unisinos). Antes da vida pública, atuou no setor bancário e no polo coureiro-calçadista do Vale dos Sinos.',
      icon: GraduationCap,
      accent: 'emerald',
    },
    {
      period: '1997 – 2004',
      role: 'Prefeito Municipal (Dois Mandatos Consecutivos)',
      location: 'São José dos Ausentes - RS',
      description:
        'Iniciou a trajetória política como Secretário de Administração em 1993 e foi eleito e reeleito prefeito de sua terra natal. Liderou a estruturação de serviços públicos básicos, postos de saúde, escolas rurais e a integração regional do município recém-emancipado.',
      icon: Landmark,
      accent: 'emerald',
    },
    {
      period: '2005 – 2014',
      role: 'Secretário Municipal da Fazenda por 9 Anos',
      location: 'Caxias do Sul - RS',
      description:
        'Convidado pelo prefeito José Ivo Sartori, comandou a Secretaria da Fazenda do segundo maior município do Rio Grande do Sul por quase uma década. Estabeleceu uma gestão de equilíbrio das contas públicas, controle rígido de gastos e captação de recursos para grandes obras viárias e saúde.',
      icon: Briefcase,
      accent: 'stone',
    },
    {
      period: '2015 – 2018',
      role: 'Secretário-Geral de Governo e Secretário de Planejamento do RS',
      location: 'Palácio Piratini • Porto Alegre - RS',
      description:
        'No Governo Sartori, assumiu a coordenação estratégica das ações estaduais, conduzindo medidas de modernização administrativa, renegociação da dívida pública com a União e o projeto de adesão ao Regime de Recuperação Fiscal.',
      icon: Landmark,
      accent: 'stone',
    },
    {
      period: '2019 – Presente',
      role: 'Deputado Estadual & Líder da Bancada do MDB',
      location: 'Assembleia Legislativa do Rio Grande do Sul (ALRS)',
      description:
        'Parlamentar atuante com votos firmes contra o aumento de impostos, presidente da Comissão de Educação, presidente da Frente Parlamentar de Logística e Transportes dos Campos de Cima da Serra e autor da Lei da Silvicultura (PL 332/2025), aprovada por unanimidade.',
      icon: Award,
      accent: 'emerald',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#00A550] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Histórico Comprovado
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Trajetória Pública de Trabalho e Firmeza
          </h2>
          <p className="mt-3 text-stone-600 leading-relaxed text-base sm:text-lg">
            Da lida no campo à liderança na Assembleia Legislativa: uma carreira construída com seriedade, conhecimento técnico em finanças e compromisso com o cidadão gaúcho.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative border-l-2 border-[#00A550]/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {milestones.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group">
                {/* Node Bullet */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-3 border-[#00A550] flex items-center justify-center shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A550]" />
                </div>

                {/* Content Card */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black text-[#00A550] tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded">
                      {item.period}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#00A550]" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {item.role}
                  </h3>

                  <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Family & Personal Note */}
        <div className="mt-16 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-[#00A550] flex items-center justify-center shrink-0">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-stone-900">Família e Valores</h4>
            <p className="text-stone-600 text-sm mt-1 leading-relaxed">
              Casado com Danusa Liége e pai de Larissa e Felipe. Carlos Búrigo mantém profunda ligação com as tradições do Rio Grande do Sul, com o homem do campo e com o desenvolvimento sustentável da Serra Gaúcha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
