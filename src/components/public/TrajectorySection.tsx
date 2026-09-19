import React from 'react';

const timeline = [
  ['1964–1982', 'Origem e formação inicial', 'Bom Jesus / São José dos Ausentes · RS', 'Carlos Antônio Búrigo nasceu em 5 de julho de 1964, em Bom Jesus/RS. Aos 18 anos mudou-se para São Leopoldo para cursar a faculdade.'],
  ['1982–1992', 'Formação e início profissional', 'São Leopoldo · RS', 'Formou-se bacharel em Ciências Contábeis pela Unisinos e construiu sua carreira profissional em São Leopoldo, com passagem pelo Banco Bradesco e atuação como gerente financeiro nas empresas Calçados Glória e Calçados Platina.'],
  ['1993–2004', 'Administração municipal em São José dos Ausentes', 'São José dos Ausentes · RS', 'Retornou ao município em 1993, onde exerceu as funções de chefe de gabinete e secretário de Administração. Em 1996 foi eleito prefeito e exerceu dois mandatos, de 1997 a 2000 e de 2001 a 2004.'],
  ['2005–2014', 'Gestão pública em Caxias do Sul', 'Caxias do Sul · RS', 'Atuou como secretário da Fazenda entre 2005 e 2008 e, de 2009 a abril de 2014, como secretário de Gestão e Finanças. A passagem abrangeu as administrações de José Ivo Sartori e Alceu Barbosa Velho.'],
  ['2015–2018', 'Governo do Estado do Rio Grande do Sul', 'Porto Alegre · RS', 'Em 2015 foi nomeado secretário-geral de Governo. Entre 2016 e abril de 2018, ocupou a Secretaria de Planejamento, Governança e Gestão. No fim de 2018, exerceu a função de chefe de gabinete do governador.'],
  ['2018–2022', 'Primeiro período na Assembleia Legislativa', 'Porto Alegre · RS', 'Na eleição estadual de 2018, obteve mais de 34 mil votos e ficou na primeira suplência do MDB. Assumiu o mandato na Assembleia Legislativa do Rio Grande do Sul em 2019 e exerceu a função até 2022.'],
  ['2023–atual', 'Segundo período parlamentar', 'Porto Alegre · RS', 'Nas eleições de 2022, obteve mais de 33 mil votos e ficou na segunda suplência do MDB. Assumiu novamente o mandato parlamentar em 2023. Os registros públicos consultados também documentam sua participação em comissões e frentes parlamentares.'],
] as const;

export const TrajectorySection: React.FC = () => (
  <section id="trajetoria" aria-labelledby="trajetoria-titulo" className="scroll-mt-28 border-b border-stone-200 bg-white py-16 sm:py-20 lg:py-24">
    <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#00863f]">Histórico público</p>
        <h2 id="trajetoria-titulo" className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          Linha do tempo
        </h2>
        <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
          Do início da formação profissional ao mandato parlamentar.
        </p>
      </div>

      <ol className="mt-10 border-y border-stone-200">
        {timeline.map(([period, title, place, description]) => (
          <li key={period} className="border-b border-stone-200 py-7 last:border-b-0 sm:py-8">
            <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
              <div className="text-sm font-bold text-[#00863f]">{period}</div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-stone-950">{title}</h3>
                <p className="mt-1 text-sm font-medium text-stone-500">{place}</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">{description}</p>
                <p className="mt-4 text-sm text-stone-500">
                  <span className="font-semibold text-stone-700">Fonte:</span>{' '}
                  Câmara Municipal de Caxias do Sul · biografia publicada em 2024
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
