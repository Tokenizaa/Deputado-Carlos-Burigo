import React from 'react';
import { ChevronDown } from 'lucide-react';

const timeline = [
  ['1964–1982', 'Origem e formação', 'Bom Jesus e São José dos Ausentes · RS', 'Nascimento em Bom Jesus/RS e mudança para São Leopoldo aos 18 anos para cursar a faculdade.'],
  ['1982–1992', 'Formação e início profissional', 'São Leopoldo · RS', 'Formação em Ciências Contábeis pela Unisinos e atuação profissional no setor privado.'],
  ['1993–2004', 'Administração municipal', 'São José dos Ausentes · RS', 'Atuação como chefe de gabinete e secretário de Administração; prefeito por dois mandatos entre 1997 e 2004.'],
  ['2005–2014', 'Gestão pública em Caxias do Sul', 'Caxias do Sul · RS', 'Atuação como secretário da Fazenda e depois secretário de Gestão e Finanças.'],
  ['2015–2018', 'Governo do Estado', 'Porto Alegre · RS', 'Atuação na Secretaria-Geral de Governo e na Secretaria de Planejamento, Governança e Gestão.'],
  ['2018–2022', 'Primeiro período na Assembleia', 'Porto Alegre · RS', 'Assumiu mandato na Assembleia Legislativa do Rio Grande do Sul em 2019 e exerceu a função até 2022.'],
  ['2023–atual', 'Segundo período parlamentar', 'Porto Alegre · RS', 'Retornou ao mandato parlamentar em 2023. O acervo público registra sua participação legislativa.'],
] as const;

export const TrajectorySection: React.FC = () => (
  <section id="trajetoria" aria-labelledby="trajetoria-titulo" className="scroll-mt-28 border-b border-stone-200 bg-white py-16 sm:py-20 lg:py-24">
    <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#00863f]">Histórico público</p>
        <h2 id="trajetoria-titulo" className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          Trajetória
        </h2>
        <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
          Selecione um período para consultar os principais registros dessa etapa da trajetória pública.
        </p>
      </div>

      <div className="mt-10 border-y border-stone-200">
        {timeline.map(([period, title, place, description], index) => (
          <details key={period} className="group border-b border-stone-200 last:border-b-0" open={index === 0}>
            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-1 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#006b32] [&::-webkit-details-marker]:hidden">
              <span className="w-24 shrink-0 text-sm font-bold text-[#00863f] sm:w-28">{period}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-stone-950 sm:text-lg">{title}</span>
                <span className="mt-1 block text-sm text-stone-500">{place}</span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="pb-6 pl-24 pr-8 sm:pl-28">
              <p className="max-w-3xl text-base leading-7 text-stone-700">{description}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);