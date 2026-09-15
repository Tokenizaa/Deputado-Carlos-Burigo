import fs from 'fs';
import path from 'path';
import {
  SiteSettings,
  Demand,
  News,
  EventItem,
  ProjectItem,
  ResultItem,
  Municipality,
  VideoItem,
  MediaItem,
  Page,
  PageVersion,
  User,
  AuditLog,
} from '../src/types.js';

interface DatabaseSchema {
  settings: SiteSettings;
  users: User[];
  pages: Page[];
  pageVersions: PageVersion[];
  news: News[];
  events: EventItem[];
  projects: ProjectItem[];
  results: ResultItem[];
  municipalities: Municipality[];
  videos: VideoItem[];
  media: MediaItem[];
  demands: Demand[];
  auditLogs: AuditLog[];
  nextProtocolCounter: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_SETTINGS: SiteSettings = {
  site_mode: 'campaign', // 'campaign' | 'mandate' | 'institutional'
  candidate_title: 'Candidato a Deputado Estadual',
  mandate_title: 'Deputado Estadual',
  institutional_title: 'Carlos Búrigo',
  candidate_name: 'Carlos Búrigo',
  electoral_number: '15140',
  party_number: '15',
  party_name: 'MDB — Movimento Democrático Brasileiro',
  campaign_slogan: 'Trabalho sério, presença e resultados reais para o Rio Grande.',
  campaign_cnpj: '56.789.123/0001-45',
  campaign_coalition: 'Coligação Pra Frente Rio Grande (MDB / Federação)',
  official_election_date: '2026-10-04',
  gabinete_address_poa: 'Assembleia Legislativa do RS — Praça Marechal Deodoro, 101, Gabinete 502, Centro Histórico, Porto Alegre - RS',
  gabinete_address_caxias: 'Escritório Regional Serra Gaúcha — Rua Sinimbu, 1870, Sala 402, Caxias do Sul - RS',
  gabinete_phone: '(51) 3210-2000',
  gabinete_whatsapp: '(54) 99915-1515',
  gabinete_email: 'carlos.burigo@al.rs.gov.br',
  social_instagram: 'https://www.instagram.com/carlosburigo15/',
  social_facebook: 'https://www.facebook.com/CBurigo/?locale=pt_BR',
  social_youtube: 'https://www.youtube.com/@carlosburigo',
  social_whatsapp: 'https://wa.me/5554999151515',
  seo_default_title: 'Carlos Búrigo | Deputado Estadual e Candidato 15140 MDB Rio Grande do Sul',
  seo_default_description: 'Plataforma oficial de Carlos Búrigo. Conheça a trajetória de quem foi Prefeito de São José dos Ausentes, Secretário da Fazenda de Caxias do Sul, Secretário de Estado e atual Líder do MDB na Assembleia Legislativa do RS.',
  privacy_policy_text: 'Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), os dados cadastrados pelos cidadãos no canal de atendimento do gabinete são utilizados exclusivamente para a tramitação, resposta e acompanhamento das demandas públicas, sendo resguardado o sigilo pessoal e jamais compartilhados para fins eleitorais abusivos ou comerciais.',
};

const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Carlos Búrigo',
    email: 'carlos.burigo@al.rs.gov.br',
    role: 'ADMIN',
    cargo: 'Deputado Estadual / Titular',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'usr-2',
    name: 'Mariana Silveira',
    email: 'mariana.chefia@burigo.com.br',
    role: 'ADMIN',
    cargo: 'Chefe de Gabinete',
  },
  {
    id: 'usr-3',
    name: 'Rodrigo Fontana',
    email: 'rodrigo.comunicacao@burigo.com.br',
    role: 'COMUNICACAO',
    cargo: 'Coordenador de Comunicação & Imprensa',
  },
  {
    id: 'usr-4',
    name: 'Luciana Zanotto',
    email: 'luciana.atendimento@burigo.com.br',
    role: 'ATENDIMENTO',
    cargo: 'Assessora de Relações com Municípios e Atendimento',
  },
  {
    id: 'usr-5',
    name: 'Felipe Maciel',
    email: 'felipe.legislativo@burigo.com.br',
    role: 'EDITOR',
    cargo: 'Assessor Jurídico e Parlamentar',
  },
  {
    id: 'usr-6',
    name: 'Equipe de Apoio',
    email: 'apoio.regional@burigo.com.br',
    role: 'VISUALIZADOR',
    cargo: 'Secretaria Regional',
  },
];

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    code: 'PL 332/2025',
    title: 'Desburocratização e Isenção de Licenciamento da Silvicultura',
    summary: 'Adequa a legislação estadual do RS à norma federal, retirando a obrigatoriedade de licenciamento ambiental repetitivo para o cultivo florestal sustentável.',
    detailedDescription: 'De autoria do deputado Carlos Búrigo e aprovado por unanimidade no plenário da ALRS, o Projeto de Lei nº 332/2025 moderniza o marco florestal gaúcho, destravando investimentos bilionários em celulose, papel e madeira sustentável, além de gerar milhares de empregos no campo e na indústria.',
    theme: 'Desenvolvimento Econômico & Meio Ambiente',
    status: 'Aprovado / Lei Sancionada',
    linkAlrs: 'https://ww4.al.rs.gov.br/legislativo',
    year: 2025,
    impacts: [
      'Equiparação do RS com a legislação federal',
      'Desoneração para milhares de produtores rurais',
      'Estímulo a cadeias produtivas de celulose e madeira sustentável',
      'Atração estimada de mais de R$ 5 bilhões em investimentos',
    ],
  },
  {
    id: 'proj-2',
    code: 'PL 184/2024',
    title: 'Programa Estadual "Juro Zero" para Micro e Pequenas Empresas',
    summary: 'Institui o subsídio estatal integral de juros em operações de crédito para Microempreendedores Individuais (MEIs) e pequenas empresas atingidas por crises.',
    detailedDescription: 'Proposta pioneira apresentada por Carlos Búrigo para fortalecer o empreendedorismo e a recuperação econômica. O Estado assume os juros do financiamento junto a instituições financeiras cooperativas e bancos de fomento para que o pequeno empresário invista em capital de giro e maquinário com custo zero de juro.',
    theme: 'Empreendedorismo & Finanças Públicas',
    status: 'Em Tramitação',
    year: 2024,
    impacts: [
      'Alívio financeiro para mais de 100 mil microempreendedores',
      'Preservação direta de postos de trabalho no comércio e serviços',
      'Foco prioritário em municípios impactados por eventos climáticos',
    ],
  },
  {
    id: 'proj-3',
    code: 'FP-LOG-01',
    title: 'Frente Parlamentar de Logística e Transportes dos Campos de Cima da Serra',
    summary: 'Articulação suprapartidária para asfaltamento e duplicação da BR-285, integração RS-SC e recuperação de rodovias turísticas e de escoamento.',
    detailedDescription: 'Criada e presidida por Carlos Búrigo, a frente lidera a cobrança junto ao DNIT e ao Governo do Estado pela conclusão das obras estruturais da Serra Gaúcha, ligação de São José dos Ausentes a Timbé do Sul (SC) e acessos asfálticos que reduzem o custo logístico dos hortifrutigranjeiros e maçã.',
    theme: 'Infraestrutura & Logística',
    status: 'Aprovado / Lei Sancionada',
    year: 2023,
    impacts: [
      'Liberação de recursos para o trecho restante da BR-285',
      'Melhoria contínua de acessos asfálticos em municípios isolados',
      'Aumento do fluxo de turismo ecológico e de aventura na região dos cânions',
    ],
  },
  {
    id: 'proj-4',
    code: 'COM-EDU-02',
    title: 'Modernização e Manutenção dos Repasses para Escolas Estaduais',
    summary: 'Iniciativas conduzidas durante a presidência da Comissão de Educação para garantia de merenda com produtos da agricultura familiar e reformas estruturais.',
    detailedDescription: 'Carlos Búrigo liderou audiências públicas e emendas parlamentares voltadas à recomposição do orçamento da infraestrutura escolar e valorização dos profissionais da educação no Rio Grande do Sul.',
    theme: 'Educação',
    status: 'Aprovado / Lei Sancionada',
    year: 2022,
    impacts: [
      'Destinação de emendas diretas a dezenas de escolas da Serra e Campos de Cima da Serra',
      'Incentivo à aquisição de alimentos da agricultura familiar gaúcha na merenda',
    ],
  },
];

const INITIAL_RESULTS: ResultItem[] = [
  {
    id: 'res-1',
    title: 'Aprovação da Lei da Silvicultura (PL 332/2025)',
    category: 'Economia & Empreendedorismo',
    description: 'Histórica vitória para o agronegócio e a indústria madeireira gaúcha com desregulamentação ambiental e segurança jurídica para investimentos.',
    metrics: 'R$ 5+ bi em novos investimentos previstos',
    municipality: 'Estado do Rio Grande do Sul',
    date: 'Novembro de 2025',
  },
  {
    id: 'res-2',
    title: 'Recursos para Hospitais Regionais e Saúde Pública',
    category: 'Saúde',
    description: 'Articulação direta e emendas impositivas destinadas ao Hospital Geral de Caxias do Sul (nova ala), Hospital Pompéia, Hospital Nossa Senhora da Oliveira de Vacaria e unidades básicas de saúde da Serra.',
    metrics: 'Mais de R$ 18 milhões viabilizados',
    municipality: 'Serra Gaúcha e Campos de Cima da Serra',
    date: '2023 - 2026',
  },
  {
    id: 'res-3',
    title: 'Avanço da Ligação RS-SC pela BR-285',
    category: 'Infraestrutura',
    description: 'Articulação contínua com o DNIT e bancada federal para garantir o ritmo das obras no trecho da Serra da Rocinha, conectando os Campos de Cima da Serra ao litoral catarinense.',
    metrics: 'Conexão logística e turística de alta relevância',
    municipality: 'São José dos Ausentes / Região',
    date: '2024 - 2026',
  },
  {
    id: 'res-4',
    title: 'Defesa do Equilíbrio Fiscal e Voto Contra Aumento de Tributos',
    category: 'Gestão Pública',
    description: 'Posicionamento firme e coerente no parlamento contra a elevação da alíquota básica de ICMS, preservando o poder de compra das famílias gaúchas e a competitividade do comércio.',
    metrics: 'Defesa de mais de 11 milhões de consumidores gaúchos',
    municipality: 'Porto Alegre / Assembleia Legislativa',
    date: '2023 - 2024',
  },
  {
    id: 'res-5',
    title: 'Recuperação de Municípios Atingidos pelas Enchentes',
    category: 'Infraestrutura',
    description: 'Destinação integral de emendas parlamentares do gabinete e intermediação de máquinas e verbas emergenciais para restabelecimento de pontes e acessos rurais.',
    metrics: '14 municípios assistidos com urgência',
    municipality: 'Serra Gaúcha e Vale do Taquari',
    date: '2024 - 2025',
  },
];

const INITIAL_MUNICIPALITIES: Municipality[] = [
  {
    id: 'mun-caxias',
    name: 'Caxias do Sul',
    region: 'Serra Gaúcha',
    population: '463.370 hab.',
    keyDeliveries: [
      'Gestão na Secretaria da Fazenda por 9 anos equilibrando as finanças municipais',
      'Destinação de emendas para a ampliação do Hospital Geral de Caxias do Sul',
      'Articulação para infraestrutura do Aeroporto Regional de Vila Oliva',
      'Apoio ao setor metalmecânico e vitivinícola da região',
    ],
  },
  {
    id: 'mun-ausentes',
    name: 'São José dos Ausentes',
    region: 'Campos de Cima da Serra',
    population: '3.500 hab.',
    keyDeliveries: [
      'Prefeito por dois mandatos (1997-2004) estruturando o município recém-emancipado',
      'Liderança na luta pelo asfaltamento e conclusão da BR-285',
      'Incentivo ao turismo de cânions e produção de batata e hortaliças',
    ],
  },
  {
    id: 'mun-vacaria',
    name: 'Vacaria',
    region: 'Campos de Cima da Serra',
    population: '61.500 hab.',
    keyDeliveries: [
      'Emendas para o Hospital Nossa Senhora da Oliveira',
      'Defesa dos produtores de maçã e pequenos fruticultores',
      'Apoio à segurança pública e estradas vicinais',
    ],
  },
  {
    id: 'mun-bento',
    name: 'Bento Gonçalves',
    region: 'Serra Gaúcha',
    population: '121.800 hab.',
    keyDeliveries: [
      'Apoio à vitivinicultura e cadeia do turismo enológico',
      'Voto contra aumento de impostos sobre o setor vinícola e moveleiro',
      'Destinação de recursos para saúde pública regional',
    ],
  },
  {
    id: 'mun-farroupilha',
    name: 'Farroupilha',
    region: 'Serra Gaúcha',
    population: '73.000 hab.',
    keyDeliveries: [
      'Recursos para o Hospital São Carlos',
      'Apoio ao setor malheiro, calçadista e frutícola',
      'Melhorias em rodovias estaduais de interligação da Serra',
    ],
  },
  {
    id: 'mun-poa',
    name: 'Porto Alegre',
    region: 'Região Metropolitana',
    population: '1.332.000 hab.',
    keyDeliveries: [
      'Atuação como Secretário-Geral de Governo e Secretário de Planejamento do RS',
      'Liderança da Bancada do MDB na Assembleia Legislativa do RS',
      'Voto pelas reformas estruturais e modernização do Estado',
    ],
  },
];

const INITIAL_NEWS: News[] = [
  {
    id: 'noticia-1',
    title: 'Assembleia aprova por unanimidade projeto de Carlos Búrigo que desonera e impulsiona a silvicultura no RS',
    slug: 'assembleia-aprova-unanimidade-projeto-carlos-burigo-silvicultura',
    summary: 'O PL 332/2025 alinha o Rio Grande do Sul à legislação federal, dispensando o licenciamento ambiental repetitivo e destravando investimentos bilionários no setor florestal.',
    content: `Em uma votação histórica com apoio de todas as bancadas partidárias na Assembleia Legislativa, foi aprovado o Projeto de Lei nº 332/2025, de autoria do deputado estadual Carlos Búrigo (MDB).

A medida harmoniza o regramento estadual com a legislação federal, extinguindo a obrigatoriedade de licenciamento ambiental prévio e de instalação para plantios de silvicultura (eucalipto, pinus e acácia) em áreas já antropizadas e consolidadas.

"Não estamos retirando a responsabilidade ambiental, mas sim eliminando a burocracia inútil que impedia o Rio Grande do Sul de competir com estados vizinhos como Santa Catarina e Paraná. A silvicultura recupera solos degradados, gera milhares de empregos no interior e garante matéria-prima sustentável", destacou Búrigo da tribuna.

Entidades do setor produtivo, como a Associação Gaúcha de Empresas Florestais (AGEFLOR) e sindicatos rurais, comemoraram a conquista, que deve destravar investimentos privados imediatos na casa de R$ 5 bilhões.`,
    mainImage: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
    category: 'Atuação Parlamentar',
    municipality: 'Porto Alegre',
    date: '2026-09-08',
    author: 'Assessoria de Comunicação',
    status: 'publicado',
    featured: true,
    seoTitle: 'Carlos Búrigo aprova PL da Silvicultura na Assembleia do RS',
    seoDescription: 'Projeto de Carlos Búrigo desburocratiza cultivo florestal e atrai bilhões em investimentos para o Rio Grande do Sul.',
  },
  {
    id: 'noticia-2',
    title: 'Carlos Búrigo destina emendas para reforço do atendimento no Hospital Geral de Caxias do Sul',
    slug: 'carlos-burigo-emendas-hospital-geral-caxias-do-sul',
    summary: 'Recursos viabilizados pelo mandato garantem novos leitos clínicos e equipamentos modernos para a instituição que atende 49 municípios da macrorregião da Serra.',
    content: `O deputado estadual Carlos Búrigo esteve em visita ao Hospital Geral de Caxias do Sul para oficializar a entrega de recursos de emenda parlamentar destinados à aquisição de insumos hospitalares e ampliação da capacidade de exames diagnósticos.

Com uma trajetória diretamente ligada à gestão de Caxias do Sul — onde atuou por 9 anos como Secretário da Fazenda —, Búrigo reforçou que a saúde pública de qualidade na Serra depende de financiamento perene e de articulação política comprometida.

"O Hospital Geral é o coração da saúde pública para mais de 1,2 milhão de cidadãos de quase 50 municípios. O nosso mandato tem prioridade absoluta em garantir que nenhuma família fique desassistida", afirmou o parlamentar durante reunião com a direção da Fundação Universidade de Caxias do Sul (FUCS).`,
    mainImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    category: 'Saúde',
    municipality: 'Caxias do Sul',
    date: '2026-08-28',
    author: 'Assessoria de Comunicação',
    status: 'publicado',
    featured: true,
  },
  {
    id: 'noticia-3',
    title: 'Frente Parlamentar dos Campos de Cima da Serra vistoria obras na BR-285 e cobra celeridade',
    slug: 'frente-parlamentar-campos-de-cima-da-serra-vistoria-br-285',
    summary: 'Comitiva liderada por Carlos Búrigo acompanhou os trabalhos de contenção e pavimentação da Serra da Rocinha, ligação vital entre o RS e Santa Catarina.',
    content: `A Frente Parlamentar de Logística e Transportes dos Campos de Cima da Serra, presidida pelo deputado Carlos Búrigo, realizou nova vistoria técnica às obras de pavimentação da BR-285, no trecho entre São José dos Ausentes e Timbé do Sul (SC).

A rodovia é considerada o corredor estratégico para o escoamento da produção agrícola da região serrana e um polo catalisador do ecoturismo.

"São décadas de luta dos municípios dos Campos de Cima da Serra. Acompanhamos cada medição e cada repasse orçamentário para que esta ligação histórica seja entregue definitivamente à nossa população", pontuou Búrigo.`,
    mainImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    category: 'Infraestrutura',
    municipality: 'São José dos Ausentes',
    date: '2026-08-15',
    author: 'Assessoria de Comunicação',
    status: 'publicado',
    featured: false,
  },
  {
    id: 'noticia-4',
    title: 'Programa Juro Zero: Búrigo defende apoio emergencial a microempresários e pequenos comerciantes',
    slug: 'programa-juro-zero-carlos-burigo-microempresarios',
    summary: 'Projeto de lei estabelece suporte do Estado para pagamento de encargos financeiros de pequenos negócios em fase de retomada.',
    content: `Em audiência na Federação de Entidades Empresariais do RS (Federasul), o deputado Carlos Búrigo apresentou os detalhes do Projeto de Lei que institui o Programa Juro Zero no âmbito estadual.

A medida visa permitir que o microempreendedor individual (MEI) e as microempresas tenham acesso a linhas de crédito com custo de juros 100% subsidiado pelo poder público, exigindo apenas o pagamento do principal em dia.

"Quem gera emprego na esquina, na oficina, na padaria ou no pequeno comércio de bairro não pode pagar a conta de crises financeiras. O Estado precisa ser parceiro de quem produz", defendeu Búrigo.`,
    mainImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80',
    category: 'Economia & Empreendedorismo',
    municipality: 'Porto Alegre',
    date: '2026-07-22',
    author: 'Assessoria Econômica',
    status: 'publicado',
    featured: false,
  },
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Encontro com Lideranças Comunitárias e Setor Produtivo de Caxias do Sul',
    description: 'Apresentação de prestação de contas do mandato na ALRS e diálogo sobre prioridades de infraestrutura viária e saúde regional.',
    date: '2026-09-18',
    time: '19:30',
    location: 'Salão Nobre da CIC Caxias do Sul',
    municipality: 'Caxias do Sul',
    visibility: 'publico',
  },
  {
    id: 'evt-2',
    title: 'Caminhada e Roda de Conversa nos Campos de Cima da Serra',
    description: 'Visita ao centro de São José dos Ausentes e reunião com produtores de maçã, silvicultores e comerciantes locais.',
    date: '2026-09-20',
    time: '14:00',
    location: 'Praça Central de São José dos Ausentes',
    municipality: 'São José dos Ausentes',
    visibility: 'publico',
  },
  {
    id: 'evt-3',
    title: 'Sessão Plenária Deliberativa na Assembleia Legislativa do RS',
    description: 'Votação de projetos prioritários e pronunciamento como Líder da Bancada do MDB.',
    date: '2026-09-22',
    time: '14:00',
    location: 'Plenário 20 de Setembro — ALRS',
    municipality: 'Porto Alegre',
    visibility: 'publico',
  },
  {
    id: 'evt-4',
    title: 'Reunião Interna de Coordenação de Gabinete e Jurídico Eleitoral',
    description: 'Alinhamento estratégico interno com assessores regionais e equipe de atendimento aos cidadãos.',
    date: '2026-09-21',
    time: '09:00',
    location: 'Gabinete 502 — ALRS (Restrito)',
    municipality: 'Porto Alegre',
    visibility: 'interno', // Strictly internal - MUST NOT show on public website
  },
  {
    id: 'evt-5',
    title: 'Painel sobre o Futuro da Silvicultura e Desenvolvimento Sustentável',
    description: 'Palestra sobre os impactos da aprovação da nova Lei da Silvicultura (PL 332/2025) para a economia do interior gaúcho.',
    date: '2026-09-25',
    time: '10:00',
    location: 'Auditório da Casa da Cultura de Vacaria',
    municipality: 'Vacaria',
    visibility: 'publico',
  },
];

const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Pronunciamento da Tribuna: A Vitória da Lei da Silvicultura para o RS',
    description: 'Deputado Carlos Búrigo defende na tribuna da ALRS a aprovação histórica do PL 332/2025, desburocratizando o cultivo florestal responsável.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Embeddable sample URL
    platform: 'YouTube',
    category: 'Discursos & Plenário',
    date: '2025-11-20',
    thumbnail: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
    featured: true,
    status: 'ativo',
  },
  {
    id: 'vid-2',
    title: 'Entrevista Exclusiva: Responsabilidade Fiscal e Investimentos na Serra',
    description: 'Búrigo relembra a experiência como Secretário da Fazenda de Caxias do Sul e discute o equilíbrio das contas públicas estaduais.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'YouTube',
    category: 'Entrevistas',
    date: '2026-06-14',
    thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
    featured: true,
    status: 'ativo',
  },
  {
    id: 'vid-3',
    title: 'Vistoria às Obras da BR-285 na Serra da Rocinha',
    description: 'Acompanhamento in loco dos trabalhos de pavimentação e infraestrutura da rota turística e produtiva.',
    url: 'https://www.instagram.com/carlosburigo15/',
    platform: 'Instagram',
    category: 'Fiscalização',
    date: '2026-08-16',
    thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    featured: false,
    status: 'ativo',
  },
];

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    name: 'foto_oficial_carlos_burigo.jpg',
    title: 'Retrato Oficial Carlos Búrigo',
    altText: 'Carlos Búrigo em retrato institucional sorrindo com paletó escuro e camisa clara',
    description: 'Foto oficial utilizada na Assembleia Legislativa do RS e materiais institucionais.',
    credit: 'Assessoria ALRS / Divulgação',
    category: 'fotos',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    size: 420000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-01',
    usedIn: ['Hero Section', 'Trajetória', 'Apresentação'],
  },
  {
    id: 'med-2',
    name: 'plenario_alrs_votacao.jpg',
    title: 'Votação do PL da Silvicultura na ALRS',
    altText: 'Carlos Búrigo discursando na tribuna da Assembleia Legislativa do Rio Grande do Sul',
    description: 'Registro da aprovação por unanimidade do PL 332/2025.',
    credit: 'Gabinete Deputado Carlos Búrigo',
    category: 'fotos',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    size: 580000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-10',
    usedIn: ['Notícias', 'Projetos'],
  },
  {
    id: 'med-3',
    name: 'manual_mdb_marca.pdf',
    title: 'Manual de Identidade Visual do MDB',
    altText: 'Documento técnico com diretrizes de aplicação das marcas e cores do MDB',
    description: 'Manual oficial 2018/2024 para aplicação das cores verde, amarelo e vermelho.',
    credit: 'Diretório Nacional do MDB',
    category: 'documentos',
    url: 'https://www.mdb.org.br/wp-content/uploads/2024/06/MANUAL_MDB_2018_v3.pdf',
    size: 3400000,
    mimeType: 'application/pdf',
    uploadedAt: '2026-08-15',
    usedIn: ['Configurações'],
  },
];

const INITIAL_DEMANDS: Demand[] = [
  {
    id: 'dem-1',
    protocol: '#2026-004821',
    citizenName: 'Adalberto Mengue da Silva',
    citizenEmail: 'adalberto.mengue@gmail.com',
    citizenPhone: '(54) 99812-3456',
    municipality: 'São José dos Ausentes',
    neighborhood: 'Zona Rural - Silveira',
    category: 'infraestrutura e rodovias',
    subject: 'Manutenção emergencial da ponte vicinal do Rio das Contas',
    description: 'Solicito a intermediação do gabinete do deputado Carlos Búrigo junto ao DAER/Governo do Estado para reparo estrutural das cabeceiras da ponte no acesso à localidade de Silveira, essencial para o transporte escolar e escoamento da safra de batata.',
    attachments: [],
    assignedTo: 'Luciana Zanotto',
    priority: 'alta',
    status: 'em atendimento',
    messages: [
      {
        id: 'msg-1',
        demandId: 'dem-1',
        senderType: 'citizen',
        senderName: 'Adalberto Mengue da Silva',
        text: 'Envio fotos da erosão que está ocorrendo na cabeceira da ponte após as últimas chuvas.',
        createdAt: '2026-09-02T10:15:00Z',
      },
      {
        id: 'msg-2',
        demandId: 'dem-1',
        senderType: 'cabinet',
        senderName: 'Luciana Zanotto (Gabinete Carlos Búrigo)',
        text: 'Prezado Adalberto, acusamos o recebimento de sua solicitação. O gabinete já expediu o Ofício nº 412/2026 à Superintendência Regional do DAER solicitando vistoria técnica em caráter de urgência. Seguiremos acompanhando até a solução.',
        createdAt: '2026-09-04T14:30:00Z',
      },
    ],
    history: [
      {
        id: 'hist-1',
        demandId: 'dem-1',
        action: 'Demanda protocolada pelo cidadão no Portal',
        newStatus: 'recebida',
        actorName: 'Sistema Automático',
        actorRole: 'PORTAL',
        timestamp: '2026-09-02T10:15:00Z',
      },
      {
        id: 'hist-2',
        demandId: 'dem-1',
        action: 'Triagem e distribuição interna',
        previousStatus: 'recebida',
        newStatus: 'em análise',
        actorName: 'Mariana Silveira',
        actorRole: 'ADMIN',
        note: 'Encaminhado para a assessora de relações com municípios.',
        timestamp: '2026-09-03T09:00:00Z',
      },
      {
        id: 'hist-3',
        demandId: 'dem-1',
        action: 'Ofício expedido ao DAER',
        previousStatus: 'em análise',
        newStatus: 'em atendimento',
        actorName: 'Luciana Zanotto',
        actorRole: 'ATENDIMENTO',
        note: 'Ofício nº 412/2026 protocolado junto ao DAER/RS.',
        timestamp: '2026-09-04T14:30:00Z',
      },
    ],
    createdAt: '2026-09-02T10:15:00Z',
    updatedAt: '2026-09-04T14:30:00Z',
  },
  {
    id: 'dem-2',
    protocol: '#2026-004815',
    citizenName: 'Cláudia Beatriz Rossi',
    citizenEmail: 'claudiarossi.caxias@terra.com.br',
    citizenPhone: '(54) 99123-7788',
    municipality: 'Caxias do Sul',
    neighborhood: 'Bairro Santa Catarina',
    category: 'saúde e hospitalar',
    subject: 'Agilidade em fila de exames de oncologia no Hospital Geral',
    description: 'Demanda sobre o fluxo de atendimento e ampliação de capacidade ambulatorial de quimioterapia para pacientes da região serrana.',
    attachments: [],
    assignedTo: 'Luciana Zanotto',
    priority: 'urgente',
    status: 'respondida',
    messages: [
      {
        id: 'msg-3',
        demandId: 'dem-2',
        senderType: 'citizen',
        senderName: 'Cláudia Beatriz Rossi',
        text: 'Gostaria de saber se o deputado pode intervir para reforçar os leitos e a equipe oncológica do Hospital Geral.',
        createdAt: '2026-08-25T11:00:00Z',
      },
      {
        id: 'msg-4',
        demandId: 'dem-2',
        senderType: 'cabinet',
        senderName: 'Carlos Búrigo (Deputado Estadual)',
        text: 'Prezada Cláudia, informamos que recentemente viabilizamos R$ 2,5 milhões em emenda parlamentar destinada expressamente à aquisição de novos equipamentos de quimioterapia e manutenção do HG. Acompanhamos semanalmente a execução desse plano junto à Secretaria Estadual da Saúde.',
        createdAt: '2026-08-28T16:00:00Z',
      },
    ],
    history: [
      {
        id: 'hist-4',
        demandId: 'dem-2',
        action: 'Demanda protocolada pelo cidadão',
        newStatus: 'recebida',
        actorName: 'Sistema Automático',
        actorRole: 'PORTAL',
        timestamp: '2026-08-25T11:00:00Z',
      },
      {
        id: 'hist-5',
        demandId: 'dem-2',
        action: 'Resposta do parlamentar registrada e enviada ao cidadão',
        previousStatus: 'recebida',
        newStatus: 'respondida',
        actorName: 'Carlos Búrigo',
        actorRole: 'ADMIN',
        timestamp: '2026-08-28T16:00:00Z',
      },
    ],
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-08-28T16:00:00Z',
  },
  {
    id: 'dem-3',
    protocol: '#2026-004830',
    citizenName: 'Marcos Vinícius Boeira',
    citizenEmail: 'boeira.mv@agrofloresta.com.br',
    citizenPhone: '(54) 99654-0011',
    municipality: 'Vacaria',
    category: 'agricultura e silvicultura',
    subject: 'Orientações práticas sobre a aplicação do novo PL 332 da Silvicultura',
    description: 'Gostaria de solicitar material explicativo ou cartilha sobre como os pequenos produtores rurais de Vacaria devem proceder para implantação de mudas florestais sob a nova lei de desoneração.',
    attachments: [],
    assignedTo: 'Felipe Maciel',
    priority: 'média',
    status: 'recebida',
    messages: [],
    history: [
      {
        id: 'hist-6',
        demandId: 'dem-3',
        action: 'Demanda protocolada no Portal do Cidadão',
        newStatus: 'recebida',
        actorName: 'Sistema Automático',
        actorRole: 'PORTAL',
        timestamp: '2026-09-14T17:40:00Z',
      },
    ],
    createdAt: '2026-09-14T17:40:00Z',
    updatedAt: '2026-09-14T17:40:00Z',
  },
];

const INITIAL_PAGES: Page[] = [
  {
    id: 'page-home',
    title: 'Página Inicial (Home)',
    slug: 'home',
    description: 'Página principal editorial e institucional do mandato e da candidatura',
    status: 'publicado',
    updatedAt: '2026-09-15T12:00:00Z',
    updatedBy: 'Carlos Búrigo',
    blocks: [
      {
        id: 'blk-hero',
        type: 'hero',
        title: 'Hero Principal',
        subtitle: 'Apresentação com alternância dinâmica de modo (campanha / mandato / institucional)',
        visible: true,
        order: 1,
        content: {
          headline: 'Carlos Búrigo',
          highlightPhrase: 'Trabalho sério, presença e resultados para o Rio Grande',
          leadText: 'Prefeito por dois mandatos de São José dos Ausentes, 9 anos Secretário da Fazenda de Caxias do Sul, Secretário-Geral de Governo do RS e atual Deputado Estadual e Líder da Bancada do MDB.',
        },
      },
      {
        id: 'blk-trajectory',
        type: 'trajectory',
        title: 'Trajetória e Biografia',
        subtitle: 'Origem nos Campos de Cima da Serra, formação e histórico público',
        visible: true,
        order: 2,
        content: {
          title: 'Uma vida dedicada ao serviço público e à responsabilidade fiscal',
          description: 'Nascido em São José dos Ausentes, contador graduado pela Unisinos, construiu uma trajetória sólida marcada pelo equilíbrio das contas públicas e pelo desenvolvimento regional.',
        },
      },
      {
        id: 'blk-projects',
        type: 'projects',
        title: 'Atuação e Projetos de Lei',
        subtitle: 'Iniciativas legislativas que transformam a vida dos gaúchos',
        visible: true,
        order: 3,
        content: {
          badge: 'Na Assembleia Legislativa',
          title: 'Projetos e Leis com Impacto Real',
        },
      },
      {
        id: 'blk-results',
        type: 'results',
        title: 'Resultados e Entregas',
        subtitle: 'Conquistas concretas para a Serra Gaúcha e todo o RS',
        visible: true,
        order: 4,
        content: {
          badge: 'Prestação de Contas',
          title: 'Compromissos que viraram realidade',
        },
      },
      {
        id: 'blk-news',
        type: 'news',
        title: 'Notícias Recentes',
        subtitle: 'Acompanhe as ações e posições de Carlos Búrigo',
        visible: true,
        order: 5,
        content: {
          limit: 3,
          showFeatured: true,
        },
      },
      {
        id: 'blk-agenda',
        type: 'agenda',
        title: 'Agenda Pública',
        subtitle: 'Compromissos públicos com as comunidades',
        visible: true,
        order: 6,
        content: {
          badge: 'Transparência',
          title: 'Próximos compromissos',
        },
      },
      {
        id: 'blk-municipalities',
        type: 'municipalities',
        title: 'Presença nos Municípios',
        subtitle: 'Atuação regionalizada na Serra Gaúcha e em todo o Estado',
        visible: true,
        order: 7,
        content: {
          title: 'Onde o nosso trabalho faz a diferença',
        },
      },
      {
        id: 'blk-videos',
        type: 'videos',
        title: 'Vídeos e Pronunciamentos',
        subtitle: 'Discursos na tribuna, entrevistas e vistorias',
        visible: true,
        order: 8,
        content: {
          title: 'Vídeos em Destaque',
        },
      },
      {
        id: 'blk-citizen-cta',
        type: 'citizen_cta',
        title: 'Portal do Cidadão — Fale com o Gabinete',
        subtitle: 'Canal direto para envio de demandas, solicitações e propostas com número de protocolo',
        visible: true,
        order: 9,
        content: {
          title: 'Fale com o Gabinete de Carlos Búrigo',
          ctaText: 'Solicitar Atendimento ou Apresentar Demanda',
        },
      },
      {
        id: 'blk-contact',
        type: 'contact',
        title: 'Canais de Contato e Gabinete',
        subtitle: 'Endereços em Porto Alegre e Caxias do Sul',
        visible: true,
        order: 10,
        content: {
          showAddresses: true,
        },
      },
    ],
  },
];

const INITIAL_VERSIONS: PageVersion[] = [
  {
    id: 'ver-1',
    pageId: 'page-home',
    versionNumber: 1,
    title: 'Versão Inicial Estruturada',
    savedAt: '2026-09-10T10:00:00Z',
    savedBy: 'Carlos Búrigo',
    status: 'published',
    note: 'Versão inicial com todas as seções institucionais e eleitorais integradas.',
    blocks: INITIAL_PAGES[0].blocks,
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-1',
    userName: 'Carlos Búrigo',
    userRole: 'ADMIN',
    action: 'PUBLISH_PAGE',
    entityType: 'page',
    entityId: 'page-home',
    details: 'Publicou a versão 1.0 da página inicial com 10 blocos modulares.',
    timestamp: '2026-09-10T10:00:00Z',
  },
  {
    id: 'log-2',
    userId: 'usr-2',
    userName: 'Mariana Silveira',
    userRole: 'ADMIN',
    action: 'UPDATE_SETTINGS',
    entityType: 'settings',
    entityId: 'site_mode',
    details: 'Definiu o modo da plataforma como "campaign" para o período eleitoral até 04/10/2026.',
    timestamp: '2026-09-11T14:20:00Z',
  },
  {
    id: 'log-3',
    userId: 'usr-4',
    userName: 'Luciana Zanotto',
    userRole: 'ATENDIMENTO',
    action: 'UPDATE_DEMAND_STATUS',
    entityType: 'demand',
    entityId: 'dem-1',
    details: 'Alterou status da demanda #2026-004821 para "em atendimento" e expediu Ofício nº 412/2026.',
    timestamp: '2026-09-04T14:30:00Z',
  },
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Error reading db.json, generating defaults:', err);
    }

    const defaultData: DatabaseSchema = {
      settings: INITIAL_SETTINGS,
      users: INITIAL_USERS,
      pages: INITIAL_PAGES,
      pageVersions: INITIAL_VERSIONS,
      news: INITIAL_NEWS,
      events: INITIAL_EVENTS,
      projects: INITIAL_PROJECTS,
      results: INITIAL_RESULTS,
      municipalities: INITIAL_MUNICIPALITIES,
      videos: INITIAL_VIDEOS,
      media: INITIAL_MEDIA,
      demands: INITIAL_DEMANDS,
      auditLogs: INITIAL_AUDIT_LOGS,
      nextProtocolCounter: 4831,
    };

    this.saveDataDirect(defaultData);
    return defaultData;
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  public save() {
    this.saveDataDirect(this.data);
  }

  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<SiteSettings>, actor: User): SiteSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.logAudit(actor, 'UPDATE_SETTINGS', 'settings', 'global', `Atualizou configurações gerais do site (Modo: ${this.data.settings.site_mode})`);
    this.save();
    return this.data.settings;
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public updateUserRole(userId: string, newRole: any, actor: User): User {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('Usuário não encontrado');
    const oldRole = user.role;
    user.role = newRole;
    this.logAudit(actor, 'UPDATE_USER_ROLE', 'user', userId, `Alterou papel de ${user.name} de ${oldRole} para ${newRole}`);
    this.save();
    return user;
  }

  public getPages(): Page[] {
    return this.data.pages.map((p) => ({
      ...p,
      versions: this.getPageVersions(p.id),
    }));
  }

  public getPageBySlug(slug: string): Page | undefined {
    const page = this.data.pages.find((p) => p.slug === slug || p.id === slug);
    if (!page) return undefined;
    return {
      ...page,
      versions: this.getPageVersions(page.id),
    };
  }

  public updatePage(pageId: string, data: { blocks?: any[]; title?: string; description?: string; status?: 'publicado' | 'rascunho'; publish?: boolean; note?: string }, actor: User): Page {
    let page = this.data.pages.find((p) => p.id === pageId || p.slug === pageId);
    if (!page && this.data.pages.length > 0) {
      page = this.data.pages[0];
    }
    if (!page) throw new Error('Página não encontrada');

    if (data.blocks) {
      page.blocks = data.blocks;
    }
    if (data.title) {
      page.title = data.title;
    }
    if (data.description) {
      page.description = data.description;
    }
    if (data.publish) {
      page.status = 'publicado';
    } else if (data.status) {
      page.status = data.status;
    }
    page.updatedAt = new Date().toISOString();
    page.updatedBy = actor.name;

    // Create a new version
    const currentVersions = this.data.pageVersions.filter((v) => v.pageId === page!.id);
    const nextVer = currentVersions.length + 1;
    const newVersion: PageVersion = {
      id: `ver-${Date.now()}`,
      pageId: page.id,
      versionNumber: nextVer,
      title: data.publish ? `Versão ${nextVer} (Publicada)` : `Versão ${nextVer} (Rascunho)`,
      blocks: JSON.parse(JSON.stringify(page.blocks)),
      savedAt: new Date().toISOString(),
      savedBy: actor.name,
      status: data.publish ? 'published' : 'draft',
      note: data.note || (data.publish ? 'Publicação oficial no site' : 'Salvamento de rascunho editorial'),
    };
    this.data.pageVersions.unshift(newVersion);

    this.logAudit(actor, data.publish ? 'PUBLISH_PAGE' : 'UPDATE_PAGE_BLOCKS', 'page', page.id, `Atualizou página "${page.title}" (Versão ${nextVer})`);
    this.save();
    return {
      ...page,
      versions: this.getPageVersions(page.id),
    };
  }

  public updatePageBlocks(pageId: string, blocks: any[], actor: User, note?: string): Page {
    let page = this.data.pages.find((p) => p.id === pageId || p.slug === pageId);
    if (!page && this.data.pages.length > 0) {
      page = this.data.pages[0];
    }
    if (!page) throw new Error('Página não encontrada');

    page.blocks = blocks;
    page.updatedAt = new Date().toISOString();
    page.updatedBy = actor.name;

    // Create a new version
    const currentVersions = this.data.pageVersions.filter((v) => v.pageId === page!.id);
    const nextVer = currentVersions.length + 1;
    const newVersion: PageVersion = {
      id: `ver-${Date.now()}`,
      pageId: page.id,
      versionNumber: nextVer,
      title: `Versão ${nextVer}`,
      blocks: JSON.parse(JSON.stringify(blocks)),
      savedAt: new Date().toISOString(),
      savedBy: actor.name,
      status: 'published',
      note: note || 'Edição de blocos no Page Builder',
    };
    this.data.pageVersions.unshift(newVersion);

    this.logAudit(actor, 'UPDATE_PAGE_BLOCKS', 'page', page.id, `Atualizou blocos da página "${page.title}" (Versão ${nextVer})`);
    this.save();
    return {
      ...page,
      versions: this.getPageVersions(page.id),
    };
  }

  public getPageVersions(pageId: string): PageVersion[] {
    return this.data.pageVersions.filter((v) => v.pageId === pageId || v.pageId === 'page-home');
  }

  public restorePageVersion(pageId: string, versionIdOrNumber: string | number, actor: User): Page {
    let page = this.data.pages.find((p) => p.id === pageId || p.slug === pageId);
    if (!page && this.data.pages.length > 0) {
      page = this.data.pages[0];
    }
    if (!page) throw new Error('Página não encontrada');

    const version = this.data.pageVersions.find(
      (v) => (v.id === String(versionIdOrNumber) || v.versionNumber === Number(versionIdOrNumber))
    );
    if (!version) throw new Error('Versão não encontrada');

    page.blocks = JSON.parse(JSON.stringify(version.blocks));
    page.updatedAt = new Date().toISOString();
    page.updatedBy = actor.name;
    page.status = 'publicado';

    const currentVersions = this.data.pageVersions.filter((v) => v.pageId === page!.id);
    const nextVer = currentVersions.length + 1;
    const restoredVersion: PageVersion = {
      id: `ver-${Date.now()}`,
      pageId: page.id,
      versionNumber: nextVer,
      title: `Restauração da Versão ${version.versionNumber}`,
      blocks: JSON.parse(JSON.stringify(version.blocks)),
      savedAt: new Date().toISOString(),
      savedBy: actor.name,
      status: 'published',
      note: `Restaurado a partir da Versão ${version.versionNumber}`,
    };
    this.data.pageVersions.unshift(restoredVersion);

    this.logAudit(actor, 'RESTORE_PAGE_VERSION', 'page', page.id, `Restaurou versão ${version.versionNumber} para a página "${page.title}"`);
    this.save();
    return {
      ...page,
      versions: this.getPageVersions(page.id),
    };
  }

  public getNews(onlyPublished = false): News[] {
    if (onlyPublished) {
      return this.data.news.filter((n) => n.status === 'publicado');
    }
    return this.data.news;
  }

  public getNewsBySlug(slug: string): News | undefined {
    return this.data.news.find((n) => n.slug === slug);
  }

  public createNews(item: Omit<News, 'id'>, actor: User): News {
    const newItem: News = {
      ...item,
      id: `noticia-${Date.now()}`,
    };
    this.data.news.unshift(newItem);
    this.logAudit(actor, 'CREATE_NEWS', 'news', newItem.id, `Criou notícia "${newItem.title}" (${newItem.status})`);
    this.save();
    return newItem;
  }

  public updateNews(id: string, updates: Partial<News>, actor: User): News {
    const index = this.data.news.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('Notícia não encontrada');
    this.data.news[index] = { ...this.data.news[index], ...updates };
    this.logAudit(actor, 'UPDATE_NEWS', 'news', id, `Atualizou notícia "${this.data.news[index].title}"`);
    this.save();
    return this.data.news[index];
  }

  public deleteNews(id: string, actor: User): boolean {
    const item = this.data.news.find((n) => n.id === id);
    if (!item) return false;
    this.data.news = this.data.news.filter((n) => n.id !== id);
    this.logAudit(actor, 'DELETE_NEWS', 'news', id, `Excluiu notícia "${item.title}"`);
    this.save();
    return true;
  }

  public getEvents(isPublicView = true): EventItem[] {
    if (isPublicView) {
      // Internal events MUST NEVER appear on public view
      return this.data.events.filter((e) => e.visibility === 'publico');
    }
    return this.data.events;
  }

  public createEvent(item: Omit<EventItem, 'id'>, actor: User): EventItem {
    const newEvent: EventItem = {
      ...item,
      id: `evt-${Date.now()}`,
    };
    this.data.events.unshift(newEvent);
    this.logAudit(actor, 'CREATE_EVENT', 'event', newEvent.id, `Criou evento "${newEvent.title}" (${newEvent.visibility})`);
    this.save();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<EventItem>, actor: User): EventItem {
    const index = this.data.events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Evento não encontrado');
    this.data.events[index] = { ...this.data.events[index], ...updates };
    this.logAudit(actor, 'UPDATE_EVENT', 'event', id, `Atualizou evento "${this.data.events[index].title}"`);
    this.save();
    return this.data.events[index];
  }

  public deleteEvent(id: string, actor: User): boolean {
    const event = this.data.events.find((e) => e.id === id);
    if (!event) return false;
    this.data.events = this.data.events.filter((e) => e.id !== id);
    this.logAudit(actor, 'DELETE_EVENT', 'event', id, `Excluiu evento "${event.title}"`);
    this.save();
    return true;
  }

  public getProjects(): ProjectItem[] {
    return this.data.projects;
  }

  public createProject(item: Omit<ProjectItem, 'id'>, actor: User): ProjectItem {
    const newProject: ProjectItem = {
      ...item,
      id: `proj-${Date.now()}`,
    };
    this.data.projects.unshift(newProject);
    this.logAudit(actor, 'CREATE_PROJECT', 'project', newProject.id, `Criou projeto "${newProject.code} - ${newProject.title}"`);
    this.save();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<ProjectItem>, actor: User): ProjectItem {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Projeto não encontrado');
    this.data.projects[index] = { ...this.data.projects[index], ...updates };
    this.logAudit(actor, 'UPDATE_PROJECT', 'project', id, `Atualizou projeto "${this.data.projects[index].code}"`);
    this.save();
    return this.data.projects[index];
  }

  public getResults(): ResultItem[] {
    return this.data.results;
  }

  public createResult(item: Omit<ResultItem, 'id'>, actor: User): ResultItem {
    const newResult: ResultItem = {
      ...item,
      id: `res-${Date.now()}`,
    };
    this.data.results.unshift(newResult);
    this.logAudit(actor, 'CREATE_RESULT', 'result', newResult.id, `Criou resultado "${newResult.title}"`);
    this.save();
    return newResult;
  }

  public updateResult(id: string, updates: Partial<ResultItem>, actor: User): ResultItem {
    const index = this.data.results.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Resultado não encontrado');
    this.data.results[index] = { ...this.data.results[index], ...updates };
    this.logAudit(actor, 'UPDATE_RESULT', 'result', id, `Atualizou resultado "${this.data.results[index].title}"`);
    this.save();
    return this.data.results[index];
  }

  public getMunicipalities(): Municipality[] {
    return this.data.municipalities;
  }

  public createMunicipality(item: Omit<Municipality, 'id'>, actor: User): Municipality {
    const newMun: Municipality = {
      ...item,
      id: `mun-${Date.now()}`,
    };
    this.data.municipalities.push(newMun);
    this.logAudit(actor, 'CREATE_MUNICIPALITY', 'municipality', newMun.id, `Cadastrou município "${newMun.name}"`);
    this.save();
    return newMun;
  }

  public updateMunicipality(id: string, updates: Partial<Municipality>, actor: User): Municipality {
    const index = this.data.municipalities.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Município não encontrado');
    this.data.municipalities[index] = { ...this.data.municipalities[index], ...updates };
    this.logAudit(actor, 'UPDATE_MUNICIPALITY', 'municipality', id, `Atualizou município "${this.data.municipalities[index].name}"`);
    this.save();
    return this.data.municipalities[index];
  }

  public getVideos(): VideoItem[] {
    return this.data.videos;
  }

  public createVideo(item: Omit<VideoItem, 'id'>, actor: User): VideoItem {
    const newVid: VideoItem = {
      ...item,
      id: `vid-${Date.now()}`,
    };
    this.data.videos.unshift(newVid);
    this.logAudit(actor, 'CREATE_VIDEO', 'video', newVid.id, `Cadastrou vídeo "${newVid.title}"`);
    this.save();
    return newVid;
  }

  public updateVideo(id: string, updates: Partial<VideoItem>, actor: User): VideoItem {
    const index = this.data.videos.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vídeo não encontrado');
    this.data.videos[index] = { ...this.data.videos[index], ...updates };
    this.logAudit(actor, 'UPDATE_VIDEO', 'video', id, `Atualizou vídeo "${this.data.videos[index].title}"`);
    this.save();
    return this.data.videos[index];
  }

  public deleteVideo(id: string, actor: User): boolean {
    const vid = this.data.videos.find((v) => v.id === id);
    if (!vid) return false;
    this.data.videos = this.data.videos.filter((v) => v.id !== id);
    this.logAudit(actor, 'DELETE_VIDEO', 'video', id, `Excluiu vídeo "${vid.title}"`);
    this.save();
    return true;
  }

  public getMedia(): MediaItem[] {
    return this.data.media;
  }

  public createMedia(item: Omit<MediaItem, 'id' | 'uploadedAt'>, actor: User): MediaItem {
    const newMedia: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    this.data.media.unshift(newMedia);
    this.logAudit(actor, 'UPLOAD_MEDIA', 'media', newMedia.id, `Adicionou mídia "${newMedia.name}"`);
    this.save();
    return newMedia;
  }

  public deleteMedia(id: string, actor: User): boolean {
    const item = this.data.media.find((m) => m.id === id);
    if (!item) return false;
    this.data.media = this.data.media.filter((m) => m.id !== id);
    this.logAudit(actor, 'DELETE_MEDIA', 'media', id, `Removeu mídia "${item.name}"`);
    this.save();
    return true;
  }

  // --- DEMANDS & CITIZEN PORTAL ---
  public generateNextProtocol(): string {
    const counter = this.data.nextProtocolCounter || 4831;
    this.data.nextProtocolCounter = counter + 1;
    const padded = String(counter).padStart(6, '0');
    return `#2026-${padded}`;
  }

  public getDemands(): Demand[] {
    return this.data.demands;
  }

  public getDemandByIdOrProtocol(query: string): Demand | undefined {
    const clean = query.trim().toUpperCase();
    return this.data.demands.find(
      (d) => d.id === query || d.protocol.toUpperCase() === clean || d.protocol.replace('#', '').toUpperCase() === clean.replace('#', '')
    );
  }

  public createCitizenDemand(data: {
    citizenName: string;
    citizenEmail: string;
    citizenPhone: string;
    municipality: string;
    neighborhood?: string;
    category: any;
    subject: string;
    description: string;
    attachments?: string[];
  }): Demand {
    const protocol = this.generateNextProtocol();
    const now = new Date().toISOString();
    const newDemand: Demand = {
      id: `dem-${Date.now()}`,
      protocol,
      citizenName: data.citizenName.trim(),
      citizenEmail: data.citizenEmail.trim().toLowerCase(),
      citizenPhone: data.citizenPhone.trim(),
      municipality: data.municipality.trim(),
      neighborhood: data.neighborhood?.trim(),
      category: data.category,
      subject: data.subject.trim(),
      description: data.description.trim(),
      attachments: data.attachments || [],
      priority: 'média',
      status: 'recebida',
      messages: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          demandId: `dem-${Date.now()}`,
          action: 'Demanda protocolada no Portal do Cidadão',
          newStatus: 'recebida',
          actorName: data.citizenName.trim(),
          actorRole: 'CIDADÃO',
          note: `Protocolo gerado com sucesso: ${protocol}`,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.data.demands.unshift(newDemand);
    this.save();
    return newDemand;
  }

  public updateDemandStatus(
    demandId: string,
    status: any,
    actor: User,
    note?: string,
    assignedTo?: string,
    priority?: any
  ): Demand {
    const demand = this.data.demands.find((d) => d.id === demandId);
    if (!demand) throw new Error('Demanda não encontrada');

    const previousStatus = demand.status;
    demand.status = status;
    if (assignedTo !== undefined) demand.assignedTo = assignedTo;
    if (priority !== undefined) demand.priority = priority;
    demand.updatedAt = new Date().toISOString();

    demand.history.push({
      id: `hist-${Date.now()}`,
      demandId,
      action: `Status alterado de "${previousStatus}" para "${status}"`,
      previousStatus,
      newStatus: status,
      actorName: actor.name,
      actorRole: actor.role,
      note: note || '',
      timestamp: new Date().toISOString(),
    });

    this.logAudit(actor, 'UPDATE_DEMAND_STATUS', 'demand', demand.protocol, `Alterou status da demanda ${demand.protocol} para "${status}"`);
    this.save();
    return demand;
  }

  public addDemandMessage(
    demandId: string,
    text: string,
    senderType: 'citizen' | 'cabinet',
    senderName: string,
    attachments?: string[]
  ): Demand {
    const demand = this.data.demands.find((d) => d.id === demandId);
    if (!demand) throw new Error('Demanda não encontrada');

    const now = new Date().toISOString();
    const msg = {
      id: `msg-${Date.now()}`,
      demandId,
      senderType,
      senderName,
      text: text.trim(),
      attachments: attachments || [],
      createdAt: now,
    };

    demand.messages.push(msg);
    demand.updatedAt = now;

    // If cabinet responds and status was in triage/received, move to 'respondida'
    if (senderType === 'cabinet' && (demand.status === 'recebida' || demand.status === 'em análise' || demand.status === 'aguardando retorno')) {
      demand.status = 'respondida';
      demand.history.push({
        id: `hist-${Date.now()}`,
        demandId,
        action: 'Resposta oficial do gabinete registrada',
        previousStatus: 'em análise',
        newStatus: 'respondida',
        actorName: senderName,
        actorRole: 'GABINETE',
        note: 'Mensagem e esclarecimentos encaminhados ao cidadão.',
        timestamp: now,
      });
    }

    this.save();
    return demand;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public logAudit(actor: User, action: string, entityType: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: actor.id,
      userName: actor.name,
      userRole: actor.role,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
  }
}

export const db = new DatabaseManager();
