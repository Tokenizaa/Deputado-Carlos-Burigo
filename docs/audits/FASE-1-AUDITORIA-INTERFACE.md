# Fase 1 — Auditoria integral da interface atual

**Data:** 2026-09-18  
**Base auditada:** `main`  
**Objetivo:** registrar o estado real da interface antes de qualquer reconstrução visual ou estrutural da Home.

## 1. Escopo

A auditoria cobre:

- entrada da aplicação e shell;
- roteamento atual;
- header e navegação;
- navegação mobile;
- footer;
- Home e blocos canônicos;
- páginas públicas;
- fluxo de contato/cidadão;
- tipografia e CSS global;
- acessibilidade estrutural observável no código;
- coerência com o Brand Book V2;
- resíduos de arquitetura/UX anteriores;
- dados e responsabilidades da camada pública.

A Fase 1 é **audit-only**: nenhuma alteração de interface foi feita como parte desta fase.

## 2. Estado arquitetural observado

| Área | Estado atual | Avaliação |
|---|---|---|
| Fonte pública da Home | `pages.slug='home'` e blocos publicados | CANÔNICO |
| Legislativo | `legislative_items` como fonte canônica | PRESERVAR |
| Notícias | camada pública via Supabase | PRESERVAR |
| Documentos | `documents` + Storage canônico | PRESERVAR |
| Runtime | Cloudflare Workers | PRESERVAR |
| Frontend | React 19 + Vite + Tailwind 4 | PRESERVAR |
| Dados públicos | `AppContext` + camada `server/supabase.ts` | PRESERVAR |
| Roteamento | estado `currentView` + inspeção de pathname | FUNCIONAL, MAS FRÁGIL |
| Mobile nav | implementada no Footer | REESTRUTURAR |
| PWA | não registrado em `main.tsx` | PENDENTE FASE 13 |
| Acessibilidade dedicada | não há barra/área global identificada | PENDENTE FASE 3 |
| SEO por rota | metadata global no `index.html` | INCOMPLETO; FASE 12 |

## 3. Matriz de auditoria

### P0 — estrutural

| Problema | Arquivo/componente | Impacto | Correção planejada | Fase |
|---|---|---|---|---|
| Roteamento depende de estado interno e pathname manual | `src/App.tsx`, `AppUiContext` | URLs e navegação ficam difíceis de manter de forma consistente | Consolidar mapa de rotas sem criar segunda arquitetura | 4/12 |
| Lista `RESERVED_PATHS` precisa ser mantida manualmente | `src/App.tsx` | Nova página pode colidir com slug dinâmico | Centralizar regras de navegação/rotas | 4 |
| Navegação principal mistura função institucional, campanha e acesso administrativo | `Navbar.tsx` | Confunde portal público com áreas internas/eleitorais | Separar claramente portal institucional, área administrativa e modo eleitoral | 4/7 |
| Mobile e desktop possuem estruturas de navegação diferentes e duplicadas | `Navbar.tsx` | Acessibilidade e manutenção ficam mais difíceis | Definir uma arquitetura única de informação com apresentações responsivas | 4 |
| Bottom nav atual possui 6 itens e ícones improvisados | `Footer.tsx` | Contraria a decisão de 4 itens e reduz clareza em telas pequenas | Adotar Início / Atuação / Notícias / Mais | 4 |
| CTA de gabinete aparece com rótulos diferentes (Gabinete, Atendimento do Gabinete, Contato) | `Navbar.tsx`, `Footer.tsx`, páginas públicas | Reduz consistência da ação cidadã | Canonizar “Fale com o Gabinete” | 5 |
| Não há CTA flutuante cidadão conforme Brand Book | shell/mobile | Contato exige descoberta no menu | Implementar CTA persistente sem sobreposição | 5 |
| Não há rota pública dedicada de Transparência na implementação observada | `App.tsx` / navegação | Critério institucional não está exposto como primeira classe | Adicionar rota/entrada canônica sem duplicar dados | 6 |

### P1 — visual e sistema

| Problema | Arquivo/componente | Impacto | Correção planejada | Fase |
|---|---|---|---|---|
| `glass-card-dark/light` e `backdrop-filter` existem no CSS | `src/index.css` | Contraria explicitamente o Brand Book | Remover dívida visual | 2 |
| Tipografia global usa Plus Jakarta Sans/Space Grotesk | `index.html` | Diverge do sistema definido no Brand Book (Inter/system) | Consolidar fonte institucional | 2 |
| H1 global chega a 88–96px | `src/index.css` | Pode criar hierarquia exagerada e perda de densidade em páginas institucionais | Redefinir escala tipográfica | 2 |
| H2 desktop chega a 52px | `src/index.css` | Pode competir com conteúdo | Redefinir escala | 2 |
| Há classes de texto de 11–12px em áreas públicas | `Navbar.tsx`, `Footer.tsx` | Pode comprometer leitura, especialmente em mobile/baixa visão | Revisar texto essencial para 16px+ | 2/3 |
| Footer usa vários textos em `text-xs` | `Footer.tsx` | Hierarquia pode depender de texto pequeno | Revisar escala sem perder densidade | 2 |
| Corpo usa 16px, mas componentes ainda reduzem conteúdo para `text-sm` | `index.css`, páginas públicas | Regra de 16px mínimo não é garantida de forma uniforme | Auditar e normalizar | 2/3 |
| Há animações utilitárias no shell (dropdown/loading) | `Navbar.tsx`, `App.tsx` | Movimento não está centralizado em `prefers-reduced-motion` | Reduzir e respeitar preferência | 2/3 |

### P1 — acessibilidade

| Problema | Arquivo/componente | Impacto | Correção planejada | Fase |
|---|---|---|---|---|
| Não foi identificada barra global de acessibilidade | shell | Usuários não têm controles dedicados | Criar controle global | 3 |
| Não foi identificado skip link global | `main.tsx`/shell | Navegação por teclado começa no shell | Adicionar “Pular para conteúdo” | 3 |
| Menu mobile usa botão corretamente rotulado, mas não há evidência de foco/confinamento/estado ARIA completo | `Navbar.tsx` | Experiência com teclado/leitor de tela pode ser inconsistente | Validar e corrigir estados | 3 |
| Dropdown desktop depende de mouse enter/leave | `Navbar.tsx` | Pode falhar para teclado/touch | Abrir/fechar também por teclado e foco | 3/4 |
| Links de navegação são majoritariamente `button` | `Navbar.tsx`, `Footer.tsx` | URL semântica, histórico e abertura em nova aba ficam prejudicados | Usar links reais onde a ação é navegação | 4 |
| Foco global existe, mas componentes também usam `focus:outline-hidden` | `index.css`, `Navbar.tsx` | Pode suprimir indicador antes de outra regra atuar | Normalizar foco | 3 |
| Contraste do sistema ainda não foi validado componente a componente | global | Não há prova de conformidade | Testar tokens e estados | 2/14 |
| Zoom 200% ainda não foi validado | global | Critério eMAG/WCAG pendente | Teste real em 200% | 3/14 |

O eMAG recomenda que as funções da página sejam operáveis via teclado e que o conteúdo permaneça funcional em redimensionamento de até 200%; também documenta recursos como atalhos, contraste e página de acessibilidade para portais públicos. citeturn0search1turn0search12

### P1 — conteúdo e comunicação

| Problema | Arquivo/componente | Impacto | Correção planejada | Fase |
|---|---|---|---|---|
| Footer contém linguagem promocional/afirmativa (“leis que destravam...”) | `Footer.tsx` | Pode deslocar o portal de institucional para promocional | Revisar linguagem factual | 7/10 |
| “Campanha 2026” está no header institucional | `Navbar.tsx` | Mistura modo eleitoral com portal institucional | Separar contexto eleitoral | 4/7 |
| O número “15” aparece no estado de carregamento | `App.tsx` | Mistura identidade eleitoral com loading institucional | Remover do shell | 2/7 |
| Fale com o Gabinete não está canonizado como ação principal | shell | Participação cidadã fica subordinada | Fase 5 | 5 |
| Transparência não está presente na navegação principal atual | `Navbar.tsx`, `Footer.tsx` | Informação pública fica difícil de descobrir | Fase 6 | 6 |

### P2 — SEO/PWA e infraestrutura de interface

| Problema | Arquivo/componente | Impacto | Correção planejada | Fase |
|---|---|---|---|---|
| Metadata está concentrada em `index.html` | `index.html` | Todas as rotas compartilham metadata | Metadata por rota | 12 |
| Fontes externas do Google são carregadas diretamente no HTML | `index.html` | Dependência externa e controle tipográfico inconsistente | Revisar fonte institucional | 2/12 |
| `main.tsx` não registra PWA/service worker | `src/main.tsx` | PWA ainda não existe | Fase 13 |
| Dependência `motion` existe no projeto | `package.json` | Pode manter complexidade/movimento sem necessidade | Avaliar uso antes de remover; não remover sem auditoria | 2 |
| Metadata do repositório ainda aponta para Vercel | GitHub repository metadata | Descoberta/links podem apontar para runtime antigo | Corrigir sem alterar runtime Cloudflare | 12/0 |

## 4. Componentes públicos auditados

### Shell

- `Navbar.tsx`: alta prioridade. É o principal ponto de mudança da Fase 4.
- `Footer.tsx`: alta prioridade. Precisa absorver transparência, acessibilidade e CTA sem virar um menu excessivo.
- `App.tsx`: alta prioridade estrutural; não deve receber nova arquitetura paralela.
- `AppContext.tsx` / `AppUiContext.tsx`: preservar responsabilidades existentes e reduzir apenas duplicações comprovadas.

### Conteúdo

Foram identificados:

- `HeroSection`
- `TrajectorySection`
- `ActionsAndProjectsSection`
- `ResultsSection`
- `NewsSection`
- `NewsDetail`
- `AgendaSection`
- `MunicipalitiesSection`
- `VideosSection`
- `AboutView`
- `DynamicPageView`
- `ContactView`
- `PrivacyPolicyView`
- `CampaignView`

Esses componentes representam capacidade já existente. A regra para as próximas fases é **reorganizar e melhorar o que existe antes de criar equivalentes**.

### Cidadão

- `CitizenPortalView.tsx`
- `CitizenProtocolModal.tsx`

O fluxo deve ser reaproveitado quando corresponder ao contato/atendimento público. Não criar uma segunda solução de protocolo ou contato.

## 5. Rotas/áreas atuais observadas

O `App.tsx` reconhece atualmente:

- Home;
- Sobre;
- Trajetória;
- Atuação;
- Projetos;
- Votações;
- Documentos;
- Resultados;
- Notícias;
- detalhe de notícia;
- Agenda;
- Municípios;
- Vídeos;
- Cidadão;
- Contato;
- Campanha;
- Privacidade;
- Admin;
- páginas dinâmicas por slug.

### Lacunas em relação ao plano

- Transparência ainda não está no conjunto reservado de rotas.
- Acessibilidade ainda não aparece como área pública.
- Comissões/relatorias/discursos não possuem navegação própria observável no shell atual.
- “Mais” ainda não existe como conceito de navegação.

## 6. Decisões de implementação derivadas da auditoria

1. **Não reconstruir o projeto.** A base atual é suficiente para a refatoração.
2. **Não criar novo banco ou API para resolver UX.**
3. **Não alterar Home na Fase 1.**
4. **Não manter campanha como elemento dominante do portal institucional.**
5. **Não usar ícone como substituto de CTA textual cidadão.**
6. **Não manter glassmorphism no sistema final.**
7. **Não usar texto essencial abaixo de 16px.**
8. **Não transformar navegação em dashboard.**
9. **Links de navegação devem usar semântica de link quando apropriado.**
10. **A fonte pública Supabase permanece canônica.**
11. **Cloudflare permanece o único runtime de produção.**
12. **PWA continua sendo a mesma aplicação.**

## 7. Prioridade consolidada

### P0 — antes da Home V2

- shell/navegação;
- separação institucional × eleitoral;
- CTA cidadão;
- rota e arquitetura de Transparência;
- acessibilidade estrutural;
- tokens tipográficos e visuais.

### P1 — durante a refatoração das páginas

- revisão de linguagem;
- semântica de links/botões;
- foco/teclado;
- mobile;
- contraste;
- zoom;
- estados de conteúdo.

### P2 — acabamento

- SEO por rota;
- PWA;
- refinamentos de metadata;
- limpeza de dependências visuais sem uso.

## 8. Critério de encerramento da Fase 1

A auditoria é considerada concluída quando:

- [x] interface atual foi inventariada;
- [x] shell foi analisado;
- [x] mobile foi analisado;
- [x] CSS global foi analisado;
- [x] acessibilidade foi analisada;
- [x] rotas atuais foram registradas;
- [x] conflitos com Brand Book foram registrados;
- [x] matriz problema → arquivo → impacto → correção → fase foi consolidada;
- [x] nenhuma mudança de Home foi feita durante a auditoria;
- [x] findings foram persistidos no GitHub.

**Conclusão:** a base é aproveitável. O principal problema não é falta de funcionalidade; é a coexistência de decisões visuais, navegação e comunicação de gerações diferentes. A próxima intervenção deve ser a **Fase 2 — sistema visual/design tokens**, sem criar uma nova arquitetura de aplicação.
