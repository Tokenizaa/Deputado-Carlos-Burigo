import React from 'react';

const groups = [
  {
    title: 'Conteúdo institucional',
    what: 'Informações públicas sobre a atuação, trajetória, agenda, notícias, vídeos e resultados que tenham sido publicados no acervo institucional.',
    why: 'Facilitar a consulta pública e permitir que cada informação seja relacionada à sua fonte.',
    period: 'Conforme a data de publicação ou do registro.',
    source: 'Acervo público do portal e respectivas fontes oficiais registradas.',
    href: '/atuacao',
    label: 'Consultar atuação',
  },
  {
    title: 'Atividade parlamentar',
    what: 'Registros legislativos disponibilizados pelo portal quando atendem aos critérios de publicação e verificação definidos no acervo.',
    why: 'Dar acesso a informações parlamentares sem transformar dados não verificados em afirmações públicas.',
    period: 'Conforme o período indicado em cada registro.',
    source: 'Registros públicos e fontes oficiais associadas ao acervo.',
    href: '/documentos',
    label: 'Consultar documentos',
  },
  {
    title: 'Resultados publicados',
    what: 'Resultados que possuem registro no acervo público e passam pelos critérios de publicação definidos para a plataforma.',
    why: 'Permitir que resultados publicados sejam consultados com contexto e sem preencher lacunas com conteúdo não verificado.',
    period: 'Conforme a data indicada em cada registro.',
    source: 'Acervo público e evidências associadas quando disponíveis.',
    href: '/resultados',
    label: 'Consultar resultados',
  },
  {
    title: 'Notícias e agenda',
    what: 'Notícias e compromissos públicos somente quando o respectivo registro está marcado para publicação.',
    why: 'Separar conteúdo efetivamente publicado de rascunhos, registros internos ou itens ainda não disponibilizados.',
    period: 'Conforme a data de cada publicação ou evento.',
    source: 'Acervo institucional do portal.',
    href: '/noticias',
    label: 'Consultar notícias',
  },
];

export const TransparencyView: React.FC = () => (
  <div className="flex-1 bg-white">
    <section className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold text-emerald-700">Transparência</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
          Como as informações públicas são publicadas
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700 sm:text-lg">
          Esta página explica os critérios usados para separar conteúdo público,
          conteúdo que exige tratamento de dados pessoais, informação interna e
          informação restrita. A disponibilidade técnica de um arquivo não é,
          por si só, motivo para publicação.
        </p>
      </div>
    </section>

    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['Público', 'Pode ser divulgado quando possui finalidade pública e contexto adequado.'],
          ['Público com tratamento', 'Pode ser divulgado após remoção ou minimização de dados pessoais quando necessário.'],
          ['Interno', 'Informação operacional ou administrativa sem finalidade de divulgação pública.'],
          ['Restrito', 'Informação sujeita a proteção legal, segurança ou outro fundamento que impeça sua divulgação.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-lg border border-stone-200 bg-white p-5">
            <h2 className="text-lg font-bold text-stone-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="border-y border-stone-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-950">Conteúdo público por assunto</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            Cada grupo abaixo informa o que é publicado, por que é publicado,
            o período de referência e a origem dos dados.
          </p>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <article key={group.title} className="rounded-lg border border-stone-200 p-5">
              <h3 className="text-lg font-bold text-stone-950">{group.title}</h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold text-stone-950">O que é</dt>
                  <dd className="mt-1 text-sm leading-6 text-stone-700">{group.what}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-stone-950">Por que está publicado</dt>
                  <dd className="mt-1 text-sm leading-6 text-stone-700">{group.why}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-stone-950">Período</dt>
                  <dd className="mt-1 text-sm leading-6 text-stone-700">{group.period}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-stone-950">Fonte</dt>
                  <dd className="mt-1 text-sm leading-6 text-stone-700">{group.source}</dd>
                </div>
              </dl>
              <a
                href={group.href}
                className="mt-5 inline-flex min-h-11 items-center rounded-md border border-stone-300 px-4 text-sm font-semibold text-stone-800 hover:bg-stone-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00A550]"
              >
                {group.label}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="text-2xl font-bold text-stone-950">Política de publicação</h2>
      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-6 text-stone-700">
        <p>Rascunhos, registros internos e itens sem autorização de publicação não são tratados como conteúdo público.</p>
        <p>Quando houver dados pessoais desnecessários à finalidade pública, a publicação deve aplicar minimização ou anonimização antes da exposição.</p>
        <p>Informações legislativas e resultados devem permanecer vinculados ao acervo e aos critérios de verificação registrados pelo sistema.</p>
        <p>Quando uma fonte oficial externa for necessária para comprovação, o portal deve preservar o vínculo com a fonte original em vez de substituir a evidência por texto editorial.</p>
      </div>
    </section>
  </div>
);
