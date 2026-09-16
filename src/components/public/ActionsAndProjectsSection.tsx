import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Download,
  Eye,
  Vote,
  FolderOpen,
  X,
  Building2,
  Calendar,
} from 'lucide-react';
import { ProjectItem } from '../../types';

interface ActionsAndProjectsSectionProps {
  initialSubTab?: 'visao-geral' | 'projetos' | 'votacoes' | 'resultados' | 'documentos';
}

export const ActionsAndProjectsSection: React.FC<ActionsAndProjectsSectionProps> = ({
  initialSubTab = 'visao-geral',
}) => {
  const { projects, setCurrentView, currentView } = useApp();
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'projetos' | 'votacoes' | 'resultados' | 'documentos'>(
    currentView === 'projetos'
      ? 'projetos'
      : currentView === 'votacoes'
      ? 'votacoes'
      : currentView === 'documentos'
      ? 'documentos'
      : currentView === 'resultados'
      ? 'resultados'
      : initialSubTab
  );

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Expanded legislative projects with archival linkage
  const extendedProjects = [
    {
      id: 'proj-silvicultura',
      code: 'PL 332/2025',
      lawNumber: 'Lei Estadual nº 16.445/2025',
      title: 'Lei da Silvicultura: Desregulamentação e Segurança Jurídica',
      summary:
        'Equiparação da legislação gaúcha às normas federais, extinguindo o licenciamento ambiental repetitivo para florestas plantadas e estimulando mais de R$ 5 bilhões em investimentos produtivos.',
      theme: 'Desenvolvimento Econômico & Meio Ambiente',
      status: 'Sancionado / Lei Vigente',
      year: 2025,
      authorship: 'Carlos Búrigo (Autor Principal)',
      ementa:
        'Dispõe sobre o cultivo, o manejo e a atividade da silvicultura no Estado do Rio Grande do Sul, desburocratizando processos de plantio e transporte de madeira sustentável.',
      tramitacao: 'Aprovado por unanimidade (50 votos a 0) em plenário e sancionado pelo Governador.',
      documents: [
        {
          name: 'Texto Integral do Projeto de Lei 332/2025',
          type: 'Projeto Original',
          date: '10/06/2025',
          status: 'Aprovado',
          url: 'https://ww4.al.rs.gov.br/legislativo',
        },
        {
          name: 'Parecer da Comissão de Constituição e Justiça (CCJ)',
          type: 'Parecer',
          date: '02/09/2025',
          status: 'Favorável',
          url: 'https://ww4.al.rs.gov.br/legislativo',
        },
        {
          name: 'Texto da Lei Estadual nº 16.445/2025 Sancionada',
          type: 'Lei Sancionada',
          date: '18/11/2025',
          status: 'Publicada em Diário Oficial',
          url: 'https://ww4.al.rs.gov.br/legislativo',
        },
      ],
      impacts: [
        'Atração de R$ 5+ bilhões em investimentos em celulose e papel sustentável',
        'Desoneração direta de milhares de produtores rurais na Serra e nos Campos de Cima da Serra',
        'Segurança jurídica alinhada à jurisprudência e normas ambientais federais',
      ],
    },
    {
      id: 'proj-pl60',
      code: 'PL 60/2021',
      lawNumber: 'Tramitação Parlamentar',
      title: 'Incentivo ao Desenvolvimento Agropecuário e Cadeias Regionais',
      summary:
        'Medidas de fortalecimento do produtor rural gaúcho, incentivo à modernização produtiva e apoio logístico aos municípios do interior.',
      theme: 'Agricultura & Desenvolvimento Regional',
      status: 'Aprovado na CCJ / Em Tramitação',
      year: 2021,
      authorship: 'Carlos Búrigo e Bancada do MDB',
      ementa:
        'Institui diretrizes para o apoio técnico, desoneração e fomento às cadeias produtivas agropecuárias familiares e cooperativas no Rio Grande do Sul.',
      tramitacao: 'Parecer favorável aprovado na Comissão de Constituição e Justiça (CCJ) e na CECDCT.',
      documents: [
        {
          name: 'Texto e Justificativa - Versão Oficial ALRS',
          type: 'Texto Original',
          date: '15/03/2021',
          status: 'Oficial',
          url: '/documents/alrs/PL60_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
        },
        {
          name: 'Parecer CCJ - Relatoria Pepe Vargas',
          type: 'Parecer',
          date: '18/08/2021',
          status: 'Favorável Aprovado',
          url: '/documents/alrs/PL60_2021/04_PARECER_Parecer_CCJ_rel_Pepe_Vargas_Favor_vel_Aprovado.pdf',
        },
        {
          name: 'Parecer CECDCT - Relatoria Fernando Marroni',
          type: 'Parecer',
          date: '05/10/2021',
          status: 'Favorável Aprovado',
          url: '/documents/alrs/PL60_2021/05_PARECER_Parecer_CECDCT_rel_Fernando_Marroni_Favor_vel_Aprovado.pdf',
        },
      ],
      impacts: [
        'Apoio direto a mais de 40 municípios com vocação agropecuária',
        'Desburocratização de certidões rurais junto a órgãos estaduais',
      ],
    },
    {
      id: 'proj-pl480',
      code: 'PL 480/2021',
      lawNumber: 'Relatoria Carlos Búrigo na CCJ',
      title: 'Modernização de Marcos Administrativos e Fiscalização',
      summary:
        'Atuação técnica na Comissão de Constituição e Justiça avaliando constitucionalidade e rigor financeiro em projetos de relevância pública.',
      theme: 'Gestão Pública & Fiscal',
      status: 'Parecer Aprovado na CCJ',
      year: 2021,
      authorship: 'Relatoria de Carlos Búrigo (CCJ)',
      ementa:
        'Análise da constitucionalidade e técnica legislativa de normativas estaduais para aprimoramento da prestação de serviços públicos.',
      tramitacao: 'Parecer da lavra de Carlos Búrigo aprovado por unanimidade na CCJ.',
      documents: [
        {
          name: 'Parecer CCJ - Relator Carlos Búrigo (Favorável Aprovado)',
          type: 'Parecer',
          date: '12/11/2021',
          status: 'Aprovado Unanimidade',
          url: '/documents/alrs/PL480_2021/10_PARECER_Parecer_CCJ_rel_Carlos_B_rigo_Favor_vel_Aprovado.pdf',
        },
        {
          name: 'Parecer CSSP - Relator Fábio Ostermann',
          type: 'Parecer',
          date: '02/12/2021',
          status: 'Favorável Aprovado',
          url: '/documents/alrs/PL480_2021/11_PARECER_Parecer_CSSP_rel_F_bio_Ostermann_Favor_vel_Aprovado.pdf',
        },
      ],
      impacts: [
        'Fortalecimento da segurança jurídica nas contratações públicas estaduais',
      ],
    },
    {
      id: 'proj-pl481',
      code: 'PL 481/2023',
      lawNumber: 'Tramitação Parlamentar',
      title: 'Aprimoramento da Legislação de Fomento e Meio Ambiente',
      summary:
        'Adequação de regras para conciliar sustentabilidade ambiental e viabilidade econômica em obras regionais.',
      theme: 'Infraestrutura & Meio Ambiente',
      status: 'Aprovado na CCJ',
      year: 2023,
      authorship: 'Dep. Frederico Antunes (Relatoria na CCJ)',
      ementa:
        'Estabelece parâmetros modernos para intervenções de interesse social e infraestrutura viária no Rio Grande do Sul.',
      tramitacao: 'Aprovado na Comissão de Constituição e Justiça e na Comissão de Meio Ambiente.',
      documents: [
        {
          name: 'Texto e Justificativa Oficial - ALRS',
          type: 'Texto Original',
          date: '20/10/2023',
          status: 'Oficial',
          url: '/documents/alrs/PL481_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
        },
        {
          name: 'Parecer CCJ - Relator Frederico Antunes',
          type: 'Parecer',
          date: '05/12/2023',
          status: 'Favorável Aprovado',
          url: '/documents/alrs/PL481_2023/18_PARECER_Parecer_CCJ_rel_Frederico_Antunes_Favor_vel_Aprovado.pdf',
        },
        {
          name: 'Parecer CSMA - Relatora Eliana Bayer',
          type: 'Parecer',
          date: '20/12/2023',
          status: 'Favorável Aprovado',
          url: '/documents/alrs/PL481_2023/19_PARECER_Parecer_CSMA_rel_Eliana_Bayer_Favor_vel_Aprovado.pdf',
        },
      ],
      impacts: [
        'Desbloqueio de obras essenciais em rodovias e acessos municipais',
      ],
    },
    {
      id: 'proj-jurozero',
      code: 'PL 184/2024',
      lawNumber: 'Em Tramitação',
      title: 'Programa Juro Zero para Micro e Pequenas Empresas',
      summary:
        'Institui o subsídio governamental integral de juros em operações de crédito para MEIs e pequenas empresas atingidas por crises climáticas.',
      theme: 'Empreendedorismo & Finanças Públicas',
      status: 'Em Tramitação',
      year: 2024,
      authorship: 'Carlos Búrigo (Autor)',
      ementa:
        'Cria mecanismo estatal de equalização de taxas de juros para crédito produtivo orientado junto a bancos e cooperativas de crédito.',
      tramitacao: 'Distribuído às comissões permanentes de mérito da Assembleia Legislativa.',
      documents: [
        {
          name: 'Texto Integral do PL 184/2024',
          type: 'Projeto Original',
          date: '08/05/2024',
          status: 'Em Tramitação',
          url: 'https://ww4.al.rs.gov.br/legislativo',
        },
      ],
      impacts: [
        'Alívio financeiro para pequenos negócios que geram emprego direto',
        'Foco prioritário em municípios afetados por cheias e enchentes',
      ],
    },
  ];

  const votacoes = [
    {
      titulo: 'Voto Contrário ao Aumento de Alíquotas de ICMS no RS',
      data: '2023 - 2024',
      resultado: 'Votou NÃO ao aumento de impostos',
      contexto:
        'Coerente com a trajetória de responsabilidade fiscal e defesa do contribuinte, Carlos Búrigo manteve posição contrária a projetos que oneram o custo de vida e reduzem a competitividade da indústria gaúcha.',
    },
    {
      titulo: 'Aprovação Unânime do Marco Legal da Silvicultura',
      data: 'Novembro de 2025',
      resultado: 'Aprovado por 50 votos a 0',
      contexto:
        'Articulação parlamentar que uniu situação e oposição em torno do projeto que desonera produtores de florestas plantadas e atrai investimentos privados.',
    },
    {
      titulo: 'Manutenção do Equilíbrio Fiscal e Regime de Recuperação',
      data: '2023 - 2026',
      resultado: 'Posicionamento Técnico',
      contexto:
        'Defesa da estabilidade das contas estaduais e prioridade na destinação de recursos para hospitais regionais da Serra Gaúcha e acessos asfálticos.',
    },
  ];

  return (
    <section className="bg-[#0D0D0D] text-white border-b border-stone-850 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 bg-[#00A550]" />
            <span className="text-xs sm:text-sm font-bold text-[#00A550] uppercase tracking-[0.12em]">
              ATUAÇÃO PARLAMENTAR
            </span>
            <span className="text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              ASSEMBLEIA LEGISLATIVA DO RS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.06]">
            O trabalho parlamentar em movimento.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-[65ch]">
            Atuação técnica pautada por projetos estruturantes, relatorias na Comissão de Constituição e Justiça (CCJ), votos de responsabilidade fiscal e acervo documental oficial aberto à sociedade.
          </p>
        </div>

        {/* Real Verified Numbers (Television / Infographic Section) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pb-12 mb-12 border-b border-stone-800">
          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight block leading-none">
              1ª
            </span>
            <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.08em] block pt-1">
              Lei da Silvicultura Sancionada
            </span>
            <p className="text-xs text-stone-400 leading-tight">
              PL 332/2025 • Lei Estadual nº 16.445/2025
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight block leading-none">
              9
            </span>
            <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.08em] block pt-1">
              Anos na Fazenda de Caxias
            </span>
            <p className="text-xs text-stone-400 leading-tight">
              Gestão das finanças do 2º maior polo do RS
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight block leading-none">
              100%
            </span>
            <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.08em] block pt-1">
              Contrário ao Aumento de ICMS
            </span>
            <p className="text-xs text-stone-400 leading-tight">
              Defesa inegociável da competitividade gaúcha
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight block leading-none">
              20+
            </span>
            <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.08em] block pt-1">
              Pareceres & Relatorias CCJ
            </span>
            <p className="text-xs text-stone-400 leading-tight">
              Rigor constitucional e controle normativo
            </p>
          </div>
        </div>

        {/* Sub-navigation tabs with sharp contrast */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 mb-12 pb-3">
          {[
            { id: 'visao-geral', label: 'VISÃO GERAL' },
            { id: 'projetos', label: 'PROJETOS DE LEI' },
            { id: 'votacoes', label: 'VOTAÇÕES & POSICIONAMENTOS' },
            { id: 'documentos', label: 'ACERVO DOCUMENTAL ALRS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold tracking-wider transition-colors border-b-2 -mb-[14px] cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#00A550] text-[#00A550]'
                  : 'border-transparent text-stone-400 hover:text-white hover:border-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: VISÃO GERAL (Differentiated Editorial Compositions) */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-12">
            {/* Composition 1: Featured Project with Large Real Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#141414] border border-stone-800 p-6 sm:p-10 rounded-[2px]">
              <div className="lg:col-span-6">
                <div className="aspect-16/10 bg-black rounded-[2px] overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src="/assets/alrs_parlamento.jpg"
                    alt="Assembleia Legislativa do RS - Plenário e Comissões"
                    className="w-full h-full object-cover filter contrast-[1.04]"
                    loading="lazy"
                    width={800}
                    height={500}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400 mt-3">
                  <span>Plenário 20 de Setembro • ALRS</span>
                  <span className="text-[#00A550] font-semibold">Marco Regulatório</span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em]">
                    PROJETOS DE LEI
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="text-xs text-stone-400 uppercase">DESTAQUE SANCIONADO</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Lei da Silvicultura: desoneração e segurança jurídica no RS
                </h3>

                <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-[55ch]">
                  Aprovada por unanimidade no parlamento gaúcho e sancionada como <strong>Lei nº 16.445/2025</strong>, a legislação de autoria de Carlos Búrigo retirou entraves históricos, destravou investimentos no campo e estimulou a cadeia de florestas plantadas sem abrir mão da preservação ambiental.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('projetos')}
                    className="h-[48px] px-7 bg-[#00A550] hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center gap-3 cursor-pointer group"
                  >
                    <span>VER PROJETOS DE LEI</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Composition 2 & 3: Distinct Grid for Votações & Acervo Documental */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Composition 2: Votações (Typographic & Contrast-Driven) */}
              <div className="bg-[#141414] border border-stone-800 p-8 rounded-[2px] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                    VOTAÇÕES & POSICIONAMENTOS
                  </span>
                  <h4 className="text-2xl font-bold text-white leading-snug">
                    Voto Contrário ao Aumento de Impostos no RS
                  </h4>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    Posicionamento firme e permanente em plenário contra a elevação das alíquotas gerais de ICMS, sustentando que o ajuste fiscal deve ser feito pelo corte de despesas da máquina e eficiência administrativa, e não pelo aumento da carga sobre famílias e empresas.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('votacoes')}
                    className="text-white hover:text-[#00A550] font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer group"
                  >
                    <span>VER TODAS AS DELIBERAÇÕES & VOTOS</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Composition 3: Acervo Documental da ALRS (Institutional Archives) */}
              <div className="bg-[#141414] border border-stone-800 p-8 rounded-[2px] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#00A550] uppercase tracking-[0.12em] block">
                    ACERVO OFICIAL ALRS
                  </span>
                  <h4 className="text-2xl font-bold text-white leading-snug">
                    Documentos Oficiais & Pareceres Técnicos
                  </h4>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    Acesso direto ao acervo de documentos parlamentares, incluindo relatorias da CCJ, textos de justificativa, anexos legislativos e pareceres aprovados com integridade e transparência para download e consulta pública.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('documentos')}
                    className="text-white hover:text-[#00A550] font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer group"
                  >
                    <span>ACESSAR DOCUMENTOS OFICIAIS DO ACERVO</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJETOS (Documental, exact layout requested by Section 7) */}
        {activeTab === 'projetos' && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-stone-900">Projetos de Lei e Iniciativas Parlamentares</h3>
              <p className="text-sm text-stone-600 mt-1">
                Acompanhe o teor de cada proposição, sua autoria, status de tramitação e acesse os documentos na íntegra.
              </p>
            </div>

            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {extendedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="py-6 sm:py-8 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-stone-50/60 transition-colors px-2 sm:px-4 rounded-sm"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded font-mono">
                        {proj.code}
                      </span>
                      {proj.lawNumber && (
                        <span className="text-stone-500 font-medium">
                          • {proj.lawNumber}
                        </span>
                      )}
                      <span className="text-stone-400">• Ano {proj.year}</span>
                      <span className="text-[#00A550] font-semibold">
                        • {proj.status}
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                      {proj.title}
                    </h4>

                    <p className="text-sm text-stone-700 leading-relaxed editorial-prose">
                      {proj.summary}
                    </p>

                    <p className="text-xs text-stone-500 font-medium pt-1">
                      Autoria: {proj.authorship}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProject(proj as any)}
                      className="text-sm font-semibold text-[#00A550] hover:text-emerald-800 inline-flex items-center gap-1.5 transition-colors border border-stone-200 hover:border-[#00A550] bg-white px-4 py-2 rounded-md"
                    >
                      <span>Ver projeto & documentos</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VOTAÇÕES */}
        {activeTab === 'votacoes' && (
          <div className="space-y-6 max-w-4xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-stone-900">Votações & Posicionamentos em Plenário</h3>
              <p className="text-sm text-stone-600 mt-1">
                Compromisso público com a transparência de votos na Assembleia Legislativa do Rio Grande do Sul.
              </p>
            </div>

            <div className="space-y-4">
              {votacoes.map((v, i) => (
                <div
                  key={i}
                  className="border border-stone-200 rounded-sm p-6 bg-stone-50/50 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-stone-400 uppercase">{v.data}</span>
                    <span className="bg-[#00A550] text-white font-bold px-2 py-0.5 rounded text-[11px]">
                      {v.resultado}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-900">{v.titulo}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed editorial-prose">
                    {v.contexto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTOS (Section 8 implementation) */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-stone-900">Acervo Documental Oficial da ALRS</h3>
              <p className="text-sm text-stone-600 mt-1">
                Consulte e baixe pareceres da CCJ, textos de justificativa, relatórios e emendas parlamentares originais.
              </p>
            </div>

            <div className="border border-stone-200 rounded-sm overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Documento / Proposição</th>
                      <th className="py-3.5 px-4">Tipo</th>
                      <th className="py-3.5 px-4">Data</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Acesso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    <tr>
                      <td className="py-3 px-4 font-medium">
                        PL 60/2021 — Texto e Justificativa Versão Atual
                        <span className="block text-xs text-stone-500">Desenvolvimento agropecuário e cadeias regionais</span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-stone-600">Texto Original</td>
                      <td className="py-3 px-4 text-xs text-stone-500">15/03/2021</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Oficial ALRS
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href="/documents/alrs/PL60_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00A550] hover:underline font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar PDF
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">
                        PL 60/2021 — Parecer CCJ Relator Pepe Vargas
                        <span className="block text-xs text-stone-500">Comissão de Constituição e Justiça</span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-stone-600">Parecer</td>
                      <td className="py-3 px-4 text-xs text-stone-500">18/08/2021</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Aprovado
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href="/documents/alrs/PL60_2021/04_PARECER_Parecer_CCJ_rel_Pepe_Vargas_Favor_vel_Aprovado.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00A550] hover:underline font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar PDF
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">
                        PL 480/2021 — Parecer CCJ Relator Carlos Búrigo
                        <span className="block text-xs text-stone-500">Relatoria técnica favorável de Carlos Búrigo na CCJ</span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-stone-600">Parecer Relator</td>
                      <td className="py-3 px-4 text-xs text-stone-500">12/11/2021</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Unanimidade
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href="/documents/alrs/PL480_2021/10_PARECER_Parecer_CCJ_rel_Carlos_B_rigo_Favor_vel_Aprovado.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00A550] hover:underline font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar PDF
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">
                        PL 481/2023 — Parecer CCJ Relator Frederico Antunes
                        <span className="block text-xs text-stone-500">Comissão de Constituição e Justiça</span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-stone-600">Parecer</td>
                      <td className="py-3 px-4 text-xs text-stone-500">05/12/2023</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Aprovado
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href="/documents/alrs/PL481_2023/18_PARECER_Parecer_CCJ_rel_Frederico_Antunes_Favor_vel_Aprovado.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00A550] hover:underline font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar PDF
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT DETAIL MODAL (Exact fields required by Section 7) */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-sm border border-stone-300 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 border-b border-stone-200 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00A550] font-bold">
                    <span>{selectedProject.code}</span>
                    {selectedProject.lawNumber && <span>• {selectedProject.lawNumber}</span>}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                  aria-label="Fechar detalhe do projeto"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 text-sm text-stone-700">
                {/* Ementa */}
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Ementa Oficial
                  </span>
                  <p className="text-stone-900 font-medium leading-relaxed bg-stone-50 p-4 border border-stone-200 rounded-sm">
                    {selectedProject.ementa || selectedProject.summary}
                  </p>
                </div>

                {/* Autoria & Situação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Autoria / Participação
                    </span>
                    <p className="font-semibold text-stone-900 mt-0.5">
                      {selectedProject.authorship || 'Carlos Búrigo'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Situação / Tramitação
                    </span>
                    <p className="font-semibold text-[#00A550] mt-0.5">
                      {selectedProject.status}
                    </p>
                  </div>
                </div>

                {/* Tramitação detalhada */}
                {selectedProject.tramitacao && (
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Histórico e Votações
                    </span>
                    <p className="text-stone-600 leading-relaxed">
                      {selectedProject.tramitacao}
                    </p>
                  </div>
                )}

                {/* Documentos vinculados */}
                {selectedProject.documents && selectedProject.documents.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      Documentos Oficiais Vinculados
                    </span>
                    <div className="space-y-2">
                      {selectedProject.documents.map((doc: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border border-stone-200 rounded-sm bg-stone-50/50"
                        >
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{doc.name}</p>
                            <span className="text-xs text-stone-500">
                              {doc.type} • {doc.date}
                            </span>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-[#00A550] hover:underline inline-flex items-center gap-1 bg-white border border-stone-200 px-3 py-1.5 rounded"
                          >
                            <Download className="w-3.5 h-3.5" /> Baixar
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fonte oficial ALRS */}
                <div className="pt-4 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
                  <span>Fonte: Assembleia Legislativa do Rio Grande do Sul (ALRS)</span>
                  <a
                    href="https://ww4.al.rs.gov.br/legislativo"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00A550] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Portal Legislativo ALRS <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
