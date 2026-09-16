# P0 — Inventário do Núcleo Público

**Data:** 2026-09-16  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`  
**Branch:** `main`  
**Ponto de partida auditado:** `82d1a3bb119b000baa8d403deee1ab0e7b356d28`  
**Status:** P0 concluído — inventário documentado; nenhuma correção de produto executada nesta etapa.

## Regra operacional

Toda alteração posterior deve seguir:

`auditar → implementar → testar → revisar → commit`

Nenhuma correção de copy, código, banco, SEO, mídia ou infraestrutura será considerada executada sem commit identificável no GitHub.

## 1. Arquitetura encontrada

O repositório mantém uma aplicação React/Vite com Express e uma camada Supabase já parcialmente integrada.

Arquivos centrais auditados:

- `src/App.tsx`
- `src/context/AppContext.tsx`
- `server.ts`
- `server/supabase.ts`
- `data/db.json`
- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `supabase/migrations/20260915_initial_platform.sql`

O `App.tsx` já possui renderização dinâmica por `pages/page_blocks`, porém existe fallback direto para componentes públicos quando `pages` está vazio. O Supabase atualmente possui `pages = 0` e `page_blocks = 0`, portanto esse fallback é o caminho efetivamente utilizado na Home.

## 2. Estado atual do Supabase

Consulta realizada no projeto `wktanxbpijurimdjgone`:

| Tabela | Registros | Situação para núcleo público |
|---|---:|---|
| `site_settings` | 1 | fonte pública já migrada |
| `projects` | 20 | dados existentes; publicação filtrada por item legislativo verificado |
| `results` | 4 | dados existentes; publicação filtrada por item legislativo verificado |
| `media` | 6 | acervo de mídia existente |
| `videos` | 13 | acervo audiovisual existente |
| `news` | 0 | sem conteúdo publicado no banco |
| `events` | 0 | sem agenda publicada no banco |
| `municipalities` | 0 | sem municípios publicados no banco |
| `pages` | 0 | CMS público ainda vazio |
| `page_blocks` | 0 | CMS público ainda vazio |

A fonte pública de dados legislativos já está vinculada ao acervo verificado. O backend consulta `legislative_items` publicados e com `VERIFIED_PRIMARY`/`VERIFIED_MULTIPLE` antes de expor projetos.

## 3. Fonte paralela ainda existente

`data/db.json` continua contendo uma implementação anterior completa de settings, usuários, páginas, versões, textos e conteúdo editorial.

O JSON contém dados eleitorais e institucionais que não podem ser tratados como fonte de verdade sem validação. Entre eles:

- modo `campaign`;
- número eleitoral;
- slogan;
- CNPJ de campanha;
- coligação;
- endereços;
- telefone e WhatsApp;
- e-mail;
- SEO;
- claims biográficos e parlamentares;
- usuários administrativos com dados não confirmados;
- avatar Unsplash usado como representação de usuário.

Regra registrada anteriormente: o JSON legado não deve permanecer como autoridade paralela quando o dado correspondente já existir no Supabase.

## 4. Home pública encontrada

Quando `pages` está vazio, `App.tsx` renderiza diretamente:

1. `HeroSection`
2. `TrajectorySection`
3. `ActionsAndProjectsSection`
4. `ResultsSection`
5. `NewsSection`
6. `AgendaSection`
7. `MunicipalitiesSection`
8. `VideosSection`

O CTA de cidadão e o contato existem no restante da aplicação, mas não aparecem no fallback da Home atual.

### 4.1 HeroSection

Arquivo: `src/components/public/HeroSection.tsx`

Claims/textos hardcoded encontrados:

- `Deputado Estadual • Líder da Bancada do MDB`
- defesa da liberdade econômica;
- rigor na gestão pública;
- representação ativa de cada região;
- `Autor da Lei da Silvicultura`;
- `Líder da Bancada do MDB na ALRS`;
- `9 anos Secretário da Fazenda • Ex-Secretário de Governo do RS`;
- alt text que já afirma cargo parlamentar.

A fotografia principal usa `/assets/carlos_burigo_portrait.png`, com fallback externo Wikimedia. O acervo Supabase já possui mídia e deve ser a fonte canônica no futuro.

**P0:** requer canonização antes de nova publicação factual.

### 4.2 TrajectorySection

Arquivo: `src/components/public/TrajectorySection.tsx`

Há uma timeline totalmente hardcoded com afirmações sobre:

- dois mandatos e emancipação;
- estruturação de serviços;
- nove anos à frente das finanças;
- equilíbrio fiscal;
- modernização de arrecadação;
- viabilização de obras;
- renegociação da dívida;
- reformas fiscais;
- liderança de bancada;
- voto contrário ao ICMS;
- autoria da Lei da Silvicultura.

Parte desses fatos possui documentação no acervo, mas as formulações atuais misturam fato, interpretação e avaliação. A timeline deve ser reescrita usando somente fatos classificados e relações documentadas.

### 4.3 ActionsAndProjectsSection

Arquivo: `src/components/public/ActionsAndProjectsSection.tsx`

O componente possui um bloco `extendedProjects` hardcoded com projetos que não correspondem necessariamente aos registros atuais retornados por Supabase.

Também existem blocos hardcoded de votações e números de impacto.

Esse é o maior ponto de divergência entre a regra `Supabase informa → aplicação renderiza` e a implementação atual.

**P0:** não ampliar essa estrutura; a próxima etapa deve eliminar a autoridade desses dados hardcoded em favor do acervo já existente.

### 4.4 ResultsSection

Arquivo: `src/components/public/ResultsSection.tsx`

Os cards usam `results` do contexto, portanto possuem caminho de dados Supabase. Entretanto o cabeçalho contém claim hardcoded:

`Recursos viabilizados para hospitais, destravamento de acessos asfálticos e desoneração de cadeias produtivas no Estado.`

Essa frase ainda não está ligada a evidência específica no componente.

### 4.5 NewsSection

Arquivo: `src/components/public/NewsSection.tsx`

Os itens vêm do contexto, mas o banco `news` está vazio.

O componente possui copy editorial fixa como:

- `Notícias & Posicionamentos Oficiais`;
- `Acompanhe a cobertura das votações...`;
- `MANCHETE PRINCIPAL`.

Não há notícia real disponível no Supabase neste momento. A Home não deve fabricar notícias nem reutilizar dados do JSON legado sem validação.

### 4.6 AgendaSection

Arquivo: `src/components/public/AgendaSection.tsx`

O componente usa `events` do contexto. O banco `events` está vazio.

Foi identificado um problema técnico para a próxima etapa: `server/supabase.ts` consulta e ordena por `start_at`, enquanto a migration define a coluna como `starts_at`.

Além disso, o componente espera campos `date` e `time`, enquanto a tabela usa `starts_at`/`ends_at`.

**P0:** registrar como bloqueador técnico de integração; não corrigido nesta etapa.

### 4.7 MunicipalitiesSection

Arquivo: `src/components/public/MunicipalitiesSection.tsx`

O componente depende de `municipalities`, mas a tabela está vazia.

Existe copy fixa afirmando atuação permanente com prefeitos, vereadores, cooperativas e comunidades.

Sem registros no banco, não existe base de dados suficiente para preencher essa seção com municípios e entregas verificadas.

### 4.8 VideosSection

Arquivo: `src/components/public/VideosSection.tsx`

O componente usa vídeos do contexto e o Supabase possui 13 registros.

A apresentação contém copy editorial fixa sobre TV ALRS, plenário, CCJ e prestação de contas. Os metadados individuais vêm do banco, mas devem continuar condicionados ao acervo verificado.

## 5. Sobre / biografia

`AboutView.tsx` já recebeu correção anterior no commit `1c4c3166a175c01858c9983dc460cb19ccf5b16f`.

O componente atual trata explicitamente a divergência de naturalidade e evita transformar São José dos Ausentes em fato categórico.

Ainda há dependência direta de arquivos locais de mídia, e parte da trajetória é hardcoded. A próxima etapa deve canonizar a fonte factual sem recriar a página.

## 6. Contato

`ContactView.tsx` contém dados hardcoded e não usa `settings` para os contatos exibidos.

Também foi encontrado uso de `openCitizenModal` no componente, mas essa função não existe na interface atual de `AppContext`; o contexto possui `openProtocolModal` e `setCurrentView`.

O formulário atual apenas altera estado local para exibir “Mensagem transmitida com sucesso” e não foi identificado como persistência real no banco.

**P0:** registrar como lacuna funcional; correção reservada à etapa de implementação.

## 7. Campanha 2026

`CampaignView.tsx` possui conteúdo eleitoral hardcoded, incluindo:

- prioridades políticas;
- afirmações sobre ICMS;
- interpretação sobre Lei da Silvicultura;
- saúde regional;
- infraestrutura;
- trajetória;
- formulário de apoio.

A separação institucional/campanha está prevista na arquitetura, mas a copy eleitoral ainda não está integralmente ligada ao `site_settings`/acervo.

O conteúdo de campanha deve permanecer separado da Home institucional e ser tratado como conteúdo temporal da eleição de 2026.

## 8. Contexto e backend

`AppContext.tsx` carrega dados públicos por API para settings, páginas, notícias, agenda, projetos, resultados, municípios, vídeos e mídia.

Porém:

- `/api/settings` já lê Supabase;
- `/api/projects`, `/api/results`, `/api/municipalities`, `/api/videos`, `/api/media`, `/api/news` e `/api/agenda` já possuem leitura Supabase;
- `/api/pages` e `/api/pages/:slug` ainda usam `db` legado;
- mutations administrativas ainda usam `db` legado;
- autenticação administrativa ainda usa usuários do `db` legado.

Portanto a migração para Supabase está parcial e deliberadamente em andamento.

## 9. SEO e indexação

`index.html` contém title e description institucionais, Open Graph básico, locale e Twitter card.

Ainda não foram encontrados no HTML global:

- canonical;
- `og:url`;
- `og:image`;
- metadata específica por rota;
- JSON-LD.

`public/robots.txt` existe e bloqueia `/admin` e `/api/`.

`public/sitemap.xml` ainda referencia o domínio oficial antigo e URLs com `?view=...`, enquanto a aplicação atual utiliza navegação por estado/rotas sem essas URLs semânticas.

**P0:** SEO está inventariado, não corrigido.

## 10. Rotas públicas encontradas

O `App.tsx` reconhece:

- `home`
- `sobre`
- `trajetoria`
- `atuacao`
- `projetos`
- `votacoes`
- `documentos`
- `resultados`
- `noticias`
- `noticia-detalhe`
- `agenda`
- `municipios`
- `videos`
- `cidadao`
- `contato`
- `campanha`
- `privacidade`

A navegação pública agrupa projetos, votações, resultados e documentos dentro de Atuação.

## 11. Resultado do P0

### O que está pronto

- inventário das principais fontes de conteúdo;
- inventário do estado atual do Supabase;
- inventário dos componentes públicos da Home;
- identificação das fontes paralelas;
- identificação das claims hardcoded prioritárias;
- identificação das lacunas de notícias, agenda e municípios;
- identificação das divergências entre schema Supabase e mapeamento do backend;
- inventário inicial de SEO e sitemap;
- inventário da separação institucional/campanha.

### O que NÃO foi feito no P0

Nenhum componente foi corrigido nesta etapa.

Nenhuma copy foi alterada nesta etapa.

Nenhuma tabela ou registro do Supabase foi alterado nesta etapa.

Nenhum arquivo existente foi sobrescrito nesta etapa.

O único artefato criado para fechar o P0 é este documento de inventário, que deve ser registrado em commit.

## 12. Próximo passo — P1

P1 deve transformar este inventário em fonte de dados editorial canônica, começando pela Home e sem criar uma segunda arquitetura.

Sequência obrigatória:

1. validar o mapeamento dos dados já existentes no Supabase;
2. corrigir primeiro os bloqueadores de integração identificados;
3. eliminar a autoridade dos blocos hardcoded onde já existe dado no Supabase;
4. não preencher `pages/page_blocks` com claims ainda não validados;
5. manter fatos conflitantes fora de afirmações categóricas;
6. executar testes após cada alteração;
7. fechar a etapa com commit próprio e hash informado.
