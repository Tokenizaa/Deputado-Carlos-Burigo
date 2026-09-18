import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type TimelineItem = {
  period: string;
  title: string;
  place: string;
  description: string;
  source: string;
};

const timeline: TimelineItem[] = [
  {
    period: '1964–1982',
    title: 'Origem e formação inicial',
    place: 'Bom Jesus / São José dos Ausentes · RS',
    description:
      'Carlos Antônio Búrigo nasceu em 5 de julho de 1964, em Bom Jesus/RS. Aos 18 anos mudou-se para São Leopoldo para cursar a faculdade.',
    source: 'Câmara Municipal de Caxias do Sul · biografia publicada em 2024',
  },
  {
    period: '1982–1992',
    title: 'Formação e início profissional',
    place: 'São Leopoldo · RS',
    description:
      'Formou-se bacharel em Ciências Contábeis pela Unisinos e construiu sua carreira profissional em São Leopoldo, com passagem pelo Banco Bradesco e atuação como gerente financeiro nas empresas Calçados Glória e Calçados Platina.',
    source: 'Câmara Municipal de Caxias do Sul · biografia publicada em 2024',
  },
  {
    period: '1993–2004',
    title: 'Administração municipal em São José dos Ausentes',
    place: 'São José dos Ausentes · RS',
    description:
      'Retornou ao município em 1993, onde exerceu as funções de chefe de gabinete e secretário de Administração. Em 1996 foi eleito prefeito e exerceu dois mandatos, de 1997 a 2000 e de 2001 a 2004.',
    source: 'Câmara Municipal de Caxias do Sul · biografia publicada em 2024',
  },
  {
    period: '2005–2014',
    title: 'Gestão pública em Caxias do Sul',
    place: 'Caxias do Sul · RS',
    description:
      'Atuou como secretário da Fazenda entre 2005 e 2008 e, de 2009 a abril de 2014, como secretário de Gestão e Finanças. A passagem abrangeu as administrações de José Ivo Sartori e Alceu Barbosa Velho.',
    source: 'Câmara Municipal de Caxias do Sul · biografia publicada em 2024',
  },
  {
    period: '2015–2018',
    title: 'Governo do Estado do Rio Grande do Sul',
    place: 'Porto Alegre · RS',
    description:
      'Em 2015 foi nomeado secretário-geral de Governo. Entre 2016 e abril de 2018, ocupou a Secretaria de Planejamento, Governança e Gestão. No fim de 2018, exerceu a função de chefe de gabinete do governador.',
    source: 'Câmara Municipal de Caxias do Sul · biografia publicada em 2024',
  },
  {
    period: '2018–2022',
    title: 'Primeiro período na Assembleia Legislativa',
    place: 'Porto Alegre · RS',
    description:
      'Na eleição estadual de 2018, obteve mais de 34 mil votos e ficou na primeira suplência do MDB. Assumiu o mandato na Assembleia Legislativa do Rio Grande do Sul em 2019 e exerceu a função até 2022.',
    source: 'Câmara Municipal de Caxias do Sul · biografia publicada em 2024',
  },
  {
    period: '2023–atual',
    title: 'Segundo período parlamentar',
    place: 'Porto Alegre · RS',
    description:
      'Nas eleições de 2022, obteve mais de 33 mil votos e ficou na segunda suplência do MDB. Assumiu novamente o mandato parlamentar em 2023. Os registros públicos consultados também documentam sua participação em comissões e frentes parlamentares.',
    source: 'Câmara Municipal de Caxias do Sul · biografia publicada em 2024',
  },
];

export const TrajectoryView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-stone-200 bg-stone-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="h-2.5 w-2.5 bg-[#00A550]" aria-hidden="true" />
              <span className="text-sm font-bold uppercase tracking-[0.12em] text-[#00863f]">
                Trajetória pública
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              Trajetória de Carlos Búrigo
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700 sm:text-xl">
              Uma linha do tempo organizada a partir de registros públicos e documentos
              identificados no acervo do projeto.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
              Cada etapa indica o período, o cargo ou contexto e a fonte utilizada para
              contextualizar o registro. A página prioriza informação factual e evita
              transformar a biografia em peça promocional.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="linha-do-tempo" className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 id="linha-do-tempo" className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              Linha do tempo
            </h2>
            <p className="mt-2 text-base leading-7 text-stone-600">
              Do início da formação profissional ao mandato parlamentar.
            </p>
          </div>

          <ol className="relative border-l border-stone-300 pl-7 sm:pl-10">
            {timeline.map((item) => (
              <li key={item.period} className="relative pb-12 last:pb-0">
                <span
                  className="absolute -left-[2.05rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#00863f] ring-1 ring-stone-300 sm:-left-[2.55rem]"
                  aria-hidden="true"
                />
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#00863f]">
                  {item.period}
                </p>
                <h3 className="mt-2 text-xl font-bold text-stone-950 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-stone-500">{item.place}</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg">
                  {item.description}
                </p>
                <p className="mt-4 text-sm leading-6 text-stone-500">
                  <span className="font-semibold text-stone-700">Fonte:</span> {item.source}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-stone-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#00863f]">
              Acervo e evidências
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              A trajetória pode ser aprofundada pelos registros públicos do portal.
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Proposições, votações, documentos, notícias e resultados ficam organizados
              em áreas próprias para consulta.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('atuacao')}
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-stone-900 px-5 text-base font-semibold text-white hover:bg-black focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"
            >
              Consultar atuação parlamentar
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('documentos')}
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-stone-300 bg-white px-5 text-base font-semibold text-stone-800 hover:bg-stone-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"
            >
              Consultar documentos
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
