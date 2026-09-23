# PLANO CANÔNICO — OPEN GRAPH

**Projeto:** Deputado Carlos Búrigo  
**Data:** 2026-09-22  
**Escopo:** tornar o Open Graph operacional, consistente e verificável em produção.  
**Estratégia:** cinco fases sequenciais, sem criação de novo Worker e sem duplicação de arquitetura.

## 1. Objetivo

Estabelecer uma única estratégia de Open Graph para o projeto, cobrindo:

- HTML entregue pelo Worker;
- páginas institucionais;
- páginas gerenciadas pelo CMS;
- notícias individuais;
- imagem padrão e imagens específicas;
- URLs absolutas;
- tipo, dimensões e acessibilidade da imagem;
- fallback seguro;
- testes reais da implementação de produção;
- validação no domínio público.

O objetivo operacional é que uma URL compartilhada produza metadados OG completos e coerentes para crawlers e plataformas de compartilhamento, incluindo og:image.

## 2. Estado encontrado na auditoria

A implementação atual está distribuída entre múltiplas camadas:

1. index.html contém metadados estáticos incompletos.
2. src/components/seo/SEO.tsx gera OG no cliente.
3. src/worker.ts injeta OG no HTML entregue ao crawler.
4. public/og/carlos-burigo.png é o fallback estático atual.
5. public.site_settings.seo_default_image_url está atualmente nulo.
6. public.pages.og_image_url não possui atualmente overrides publicados.
7. O bucket og-images existe, mas não possui objetos atualmente.
8. O CMS permite imagem OG específica, porém a validação do arquivo ainda é insuficiente.
9. O Worker possui fallback para a imagem estática, mas uma exceção durante a injeção pode devolver o HTML original sem OG completo.
10. Notícias usam /noticias?noticia=slug, mas o Worker não resolve atualmente o OG específico da notícia.
11. As rotas conhecidas pelo Worker e pelo SEO client-side não estão totalmente sincronizadas.
12. tests/unit/open-graph-image.test.ts reproduz parte da lógica e ainda espera um caminho antigo, em vez de testar diretamente a implementação de produção.

## 3. Princípios canônicos

### 3.1 Uma única cadeia de decisão

A imagem OG deve ser resolvida nesta ordem:

1. imagem específica do conteúdo, quando existir e for válida;
2. imagem padrão configurada no CMS/configuração, quando existir e for válida;
3. /og/carlos-burigo.png como fallback estático obrigatório.

### 3.2 O Worker continua sendo a camada crítica para crawlers

Não será criado um segundo Worker exclusivamente para OG.

O Worker atual continuará entregando o HTML e será responsável pela garantia server-side dos metadados.

### 3.3 Cliente não pode ser a única fonte

SEO.tsx pode continuar sendo útil para navegação no browser, mas não poderá contradizer a política server-side.

### 3.4 URL final deve ser absoluta

og:image deve chegar ao crawler como URL absoluta e publicamente acessível.

### 3.5 Metadados devem corresponder ao arquivo

O tipo declarado, a extensão, o conteúdo efetivo e as dimensões da imagem precisam ser coerentes.

### 3.6 Testar produção, não uma cópia da implementação

Os testes devem importar e exercitar funções reais da implementação sempre que a arquitetura permitir. Não será mantido teste que apenas reproduza a lógica esperada.

## 4. Plano de execução em cinco fases

### FASE 1 — ESPECIFICAÇÃO E CANONIZAÇÃO

**Objetivo:** definir formalmente a fonte de verdade do OG antes de alterar código.

**Executar:**

- mapear todos os pontos de geração/injeção de OG;
- definir o contrato único de metadados;
- consolidar constantes de título, descrição, imagem e dimensões;
- definir a precedência entre conteúdo, configuração e fallback;
- mapear todas as rotas públicas;
- documentar o tratamento especial de notícias com query noticia=slug;
- definir o comportamento em caso de falha de Supabase;
- definir o comportamento quando imagem configurada estiver indisponível ou inválida.

**Critérios de conclusão:**

- contrato OG documentado;
- fontes duplicadas identificadas;
- matriz de rotas concluída;
- cadeia de fallback definida;
- nenhuma decisão de arquitetura permanece implícita.

**Resultado:** especificação que servirá como referência para as quatro fases seguintes.

---

### FASE 2 — IMPLEMENTAÇÃO SERVER-SIDE E FALLBACK

**Objetivo:** garantir que o HTML entregue pelo Worker sempre tenha OG válido.

**Executar:**

- refatorar src/worker.ts para seguir o contrato canônico;
- garantir fallback para /og/carlos-burigo.png;
- garantir URL absoluta;
- corrigir o tratamento do tipo MIME;
- garantir og:image, og:image:width, og:image:height, og:image:alt e demais campos necessários;
- impedir que uma falha secundária de configuração elimine todo o OG;
- alinhar as rotas estáticas;
- integrar metadados específicos de notícias;
- preservar títulos e descrições específicos quando existirem.

**Critérios de conclusão:**

Para cada rota pública relevante, o HTML server-side deve conter:

- og:title;
- og:description;
- og:type;
- og:url;
- og:image absoluto;
- dimensões da imagem;
- tipo da imagem coerente;
- twitter:card=summary_large_image;
- twitter:image.

**Resultado:** crawler não depende de JavaScript para descobrir a imagem.

---

### FASE 3 — UNIFICAÇÃO DO FRONTEND E CMS

**Objetivo:** eliminar divergências entre a camada server-side, SEO.tsx e o CMS.

**Executar:**

- alinhar src/components/seo/SEO.tsx ao contrato canônico;
- fazer o componente respeitar a URL recebida quando essa URL representar o conteúdo;
- aplicar o mesmo fallback estático;
- impedir que ausência de configuração remova a imagem;
- revisar os campos OG do CMS;
- validar uploads de imagem;
- garantir coerência entre JPEG/PNG e og:image:type;
- validar dimensões e proporção no upload;
- documentar o comportamento de imagens específicas de páginas e notícias.

**Critérios de conclusão:**

- Worker e frontend não usam regras conflitantes;
- CMS não consegue gravar uma configuração claramente inválida;
- imagem específica e fallback seguem a mesma política;
- notícias possuem metadados coerentes no browser e no HTML server-side.

**Resultado:** uma política única de OG em toda a aplicação.

---

### FASE 4 — TESTES E VALIDAÇÃO AUTOMATIZADA

**Objetivo:** substituir testes falsamente positivos por testes da implementação real.

**Executar:**

- reescrever tests/unit/open-graph-image.test.ts;
- testar diretamente helpers/funções de produção;
- testar HTML final produzido pelo Worker;
- testar fallback quando seo_default_image_url é nulo;
- testar imagem específica de página;
- testar URL relativa convertida para absoluta;
- testar imagem absoluta;
- testar notícias por ?noticia=slug;
- testar ausência/falha de configuração;
- testar tipo MIME;
- testar dimensões;
- testar que uma exceção de configuração não devolve HTML sem OG;
- testar rotas públicas representativas;
- incluir uma verificação do arquivo físico public/og/carlos-burigo.png.

**Critérios de conclusão:**

- testes não duplicam a implementação;
- existe cobertura do fallback;
- existe cobertura de conteúdo específico;
- existe cobertura de notícia;
- existe cobertura da saída HTML;
- build/typecheck/lint/testes passam.

**Resultado:** regressões de OG passam a ser detectáveis antes do deploy.

---

### FASE 5 — VALIDAÇÃO REAL EM PRODUÇÃO E ENCERRAMENTO

**Objetivo:** comprovar que o OG funciona no domínio público, não apenas no código.

**Executar:**

- executar build de produção;
- publicar no Worker existente;
- verificar o HTML público com requisições sem JavaScript;
- verificar headers e status HTTP;
- verificar a URL final da imagem;
- verificar Content-Type da imagem;
- verificar dimensões reais;
- verificar acessibilidade pública da imagem;
- validar uma rota institucional;
- validar uma página com conteúdo específico;
- validar uma notícia individual;
- registrar evidências do resultado;
- atualizar o roadmap e o documento de auditoria.

**Critérios de conclusão:**

Uma URL pública compartilhável deve apresentar:

1. HTML acessível sem JavaScript;
2. og:image absoluto;
3. imagem retornando HTTP 200;
4. MIME correto;
5. dimensões esperadas;
6. metadados coerentes com a página;
7. fallback funcional quando não houver imagem específica;
8. metadados específicos quando houver conteúdo específico.

A validação de plataformas externas deve ser tratada separadamente de uma validação do HTML: cache do serviço de compartilhamento não deve ser confundido com falha da aplicação.

**Resultado:** Open Graph considerado operacional somente após evidência no domínio público.

## 5. Sequência obrigatória

FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5

Cada fase deve ser concluída e registrada antes da seguinte.

Não criar:

- novo Worker;
- novo serviço externo;
- nova camada de SEO;
- novo sistema paralelo de imagens;
- duplicação de configuração.

## 6. Definition of Done

O trabalho de Open Graph estará concluído quando:

- [ ] existe contrato OG canônico;
- [ ] existe uma única cadeia de fallback;
- [ ] Worker entrega OG server-side;
- [ ] og:image é absoluto;
- [ ] fallback estático funciona;
- [ ] imagens específicas funcionam;
- [ ] notícias individuais possuem OG próprio;
- [ ] MIME e dimensões são coerentes;
- [ ] CMS valida imagens;
- [ ] SEO.tsx está alinhado;
- [ ] testes exercitam código real;
- [ ] build/typecheck/lint/testes passam;
- [ ] HTML público foi validado;
- [ ] imagem pública foi validada;
- [ ] evidências foram registradas no Git;
- [ ] roadmap foi atualizado.

## 7. Regra de encerramento

Não considerar o Open Graph resolvido apenas porque o código contém og:image.

A conclusão exige três níveis:

**Código → Testes → Produção**

Somente os três níveis aprovados encerram o plano.


## 8. FASE 1 — EXECUÇÃO CONCLUÍDA

**Status:** CONCLUÍDA em 2026-09-22.

### 8.1 Fontes auditadas

Foram confrontadas diretamente no código atual:

- `index.html`;
- `src/worker.ts`;
- `src/components/seo/SEO.tsx`;
- `tests/unit/open-graph-image.test.ts`;
- modelo/configuração pública de SEO no Supabase;
- páginas públicas/CMS e seus campos OG;
- asset `public/og/carlos-burigo.png`;
- bucket `og-images`;
- histórico de alterações relacionadas a OG.

### 8.2 Contrato canônico definido

O contrato server-side passa a ser:

| Campo | Regra |
|---|---|
| `og:title` | título específico da página/conteúdo; fallback para título institucional |
| `og:description` | descrição específica; fallback para descrição institucional |
| `og:type` | `website` no escopo atual |
| `og:url` | URL canônica da requisição |
| `og:locale` | `pt_BR` |
| `og:image` | URL absoluta resolvida pela cadeia canônica |
| `og:image:secure_url` | acompanhar a imagem quando aplicável |
| `og:image:type` | corresponder ao tipo real da imagem |
| `og:image:width` | dimensão real/canônica da imagem |
| `og:image:height` | dimensão real/canônica da imagem |
| `og:image:alt` | texto alternativo coerente com o conteúdo |
| `twitter:card` | `summary_large_image` |
| `twitter:title` | mesmo título efetivo |
| `twitter:description` | mesma descrição efetiva |
| `twitter:image` | mesma imagem efetiva |
| `twitter:image:alt` | mesmo texto alternativo |

### 8.3 Precedência canônica

A resolução ficou definida como:

**conteúdo específico válido → configuração global válida → asset estático obrigatório**

Asset estático obrigatório:

`/og/carlos-burigo.png`

O asset atual é 1200×630 PNG.

### 8.4 Matriz de rotas

**Rotas institucionais conhecidas pelo Worker:** `/`, `/sobre`, `/trajetoria`, `/atuacao`, `/projetos`, `/votacoes`, `/documentos`, `/resultados`, `/noticias`, `/agenda`, `/municipios`, `/videos`, `/contato`.

**Rotas adicionais conhecidas pelo SEO client-side:** `/transparencia`, `/acessibilidade`, `/privacidade`.

**CMS:** páginas publicadas devem poder fornecer título, descrição e imagem próprios.

**Notícias:** a aplicação usa `/noticias?noticia=slug`; portanto a identificação do conteúdo precisa considerar a query string, e não somente `pathname`.

### 8.5 Falhas e comportamento obrigatório

1. Falha ao consultar configurações públicas não pode eliminar o OG.
2. Ausência de imagem configurada não pode eliminar o OG.
3. URL relativa deve ser convertida para absoluta.
4. URL inválida deve cair no asset estático.
5. Imagem específica deve prevalecer apenas quando válida.
6. O tipo declarado não pode permanecer fixo como PNG se a imagem efetiva for JPEG.
7. Uma exceção na construção do OG não deve devolver uma página HTML sem a garantia mínima de imagem.
8. O cliente não pode ser a única camada responsável por OG.

### 8.6 Divergências registradas para execução posterior

- `index.html` não é autossuficiente em OG e depende da injeção do Worker.
- `SEO.tsx` usa regras próprias e remove `og:image` quando não há configuração.
- `SEO.tsx` recebe `props.url`, mas atualmente constrói a canonical a partir da rota atual.
- Worker e SEO client-side possuem conjuntos de rotas diferentes.
- Worker trata notícias principalmente pelo pathname e não pelo slug da query.
- Worker declara `image/png` independentemente do tipo efetivo da imagem.
- O teste atual de imagem referencia o caminho legado `/assets/carlos_burigo_portrait.png` e replica a função de produção em vez de testá-la.
- A configuração global atual não possui imagem cadastrada; o fallback estático é, portanto, a fonte efetiva.
- O bucket `og-images` está sem objetos no estado auditado.

### 8.7 Decisão arquitetural da Fase 1

**Não criar novo Worker.**

A implementação seguirá no Worker existente, com uma cadeia única de resolução e testes sobre a saída real.

A Fase 1 está encerrada. Nenhuma alteração funcional foi antecipada para a Fase 2.
