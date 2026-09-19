import React from 'react';

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
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#00863f]">Histórico público</p>
        <h2 id="trajetoria-titulo" className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          Trajetória em uma única página
        </h2>
        <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
          Uma linha do tempo objetiva, organizada por período e contexto. As informações abaixo são apresentadas a partir de registros públicos identificados no acervo.
        </p>
      </div>
      <ol className="mt-12 grid gap-0 border-t border-stone-200 lg:grid-cols-7 lg:border-l lg:border-t-0">
        {timeline.map(([period, title, place, description], index) => (
          <li key={period} className="relative border-b border-stone-200 py-7 lg:border-b-0 lg:border-r lg:p-6">
            <span className="text-sm font-bold text-[#00863f]">{period}</span>
            <h3 className="mt-3 text-lg font-bold leading-snug text-stone-950">{title}</h3>
            <p className="mt-1 text-sm font-semibold text-stone-500">{place}</p>
            <p className="mt-4 text-sm leading-6 text-stone-700">{description}</p>
            {index < timeline.length - 1 && <span className="hidden lg:block absolute -right-1 top-8 h-2 w-2 rounded-full bg-[#00863f]" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </div>
  </section>
);