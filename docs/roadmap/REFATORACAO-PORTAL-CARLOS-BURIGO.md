# Plano de Refatoração — Portal Institucional Carlos Búrigo

> **Status:** PLANO CANÔNICO DE EXECUÇÃO
> **Última atualização:** 2026-09-18
> **Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`
> **Documento complementar:** `docs/brand/BRAND-BOOK-CARLOS-BURIGO-V2.md`
> **Objetivo:** permitir que a refatoração continue sem perda de contexto, mesmo após interrupção de uma sessão, troca de agente ou falta de saldo.

---

## 0. Como usar este documento

Este arquivo é o **plano operacional da refatoração**. O Brand Book continua sendo a fonte de verdade da identidade e das decisões de produto; este documento explica **como executar essas decisões**.

Um agente que retomar o trabalho deve:

1. ler este arquivo inteiro;
2. ler o Brand Book;
3. verificar o estado real de `main`;
4. localizar a última fase/subfase marcada como concluída;
5. verificar os commits posteriores ao último checkpoint;
6. não repetir uma fase já concluída;
7. executar apenas a próxima subfase desbloqueada;
8. testar antes de avançar;
9. registrar o resultado neste documento;
10. integrar em `main` quando a fase estiver validada.

### Regra de continuidade

O estado do projeto deve ser determinado pelo **Git + código real + este plano**, nunca por memória de uma conversa anterior.

Se houver divergência entre este documento e o código, o agente deve investigar antes de alterar qualquer coisa.

---

# 1. Objetivo geral

Transformar o site em um **portal institucional público, acessível, legível, transparente e orientado ao cidadão**, sem recriar a arquitetura de dados já existente.

O resultado deve permitir que qualquer cidadão:

- saiba quem é Carlos Búrigo;
- conheça sua trajetória pública;
- entenda o mandato atual;
- consulte sua atuação parlamentar;
- consulte proposições, votações e comissões;
- acompanhe notícias e agenda;
- consulte resultados documentados;
- encontre informações de transparência;
- encontre documentos públicos relevantes;
- entre em contato com o gabinete com pouca fricção;
- use o portal confortavelmente no celular;
- use o portal com diferentes tamanhos de texto e tecnologias assistivas.

---

# 2. Princípios que não podem ser quebrados

## 2.1 Produto

O produto é para **cidadãos**, não para o deputado e não para a equipe do gabinete.

## 2.2 Arquitetura

Não criar segunda arquitetura.

Fontes canônicas existentes devem continuar sendo utilizadas:

- Supabase;
- `pages`;
- `page_blocks`;
- `legislative_items`;
- `documents`;
- Storage existente;
- demais entidades já existentes quando adequadas.

Não criar:

- segunda Home;
- tabela paralela;
- API duplicada;
- sistema legislativo paralelo;
- cópias de documentos;
- conteúdo mock quando existe fonte real.

## 2.3 Runtime

Produção permanece em **Cloudflare Workers**.

Não reintroduzir Vercel como runtime de produção.

## 2.4 Acessibilidade

Acessibilidade é requisito de produto desde o início.

Diretrizes centrais:

- corpo mínimo de 16px;
- preferência de 17–18px para leitura;
- controles de 16px ou maior;
- contraste verificável;
- preferência por contraste próximo de 7:1 para conteúdo prioritário;
- funcionamento com redimensionamento até 200%;
- foco visível;
- teclado;
- sem depender somente de cor;
- alvos de toque confortáveis;
- sem texto essencial pequeno.

O eMAG recomenda contraste mínimo de 4,5:1 e descreve 7:1 para alto contraste; também exige que o conteúdo permaneça funcional com redimensionamento até 200%. citeturn0search0turn0search12

## 2.5 Comunicação

**Fale com o Gabinete** é uma função central.

Não pode ficar escondida em rodapé ou menu profundo.

## 2.6 Visual

Evitar:

- glassmorphism;
- `backdrop-blur`;
- gradientes decorativos;
- excesso de cards;
- microtipografia;
- cinza claro como texto essencial;
- interfaces que parecem dashboard interno.

---

# 3. Fluxo de execução obrigatório

Cada fase segue:

```
AUDITAR
  ↓
IMPLEMENTAR
  ↓
TESTAR
  ↓
VALIDAR
  ↓
DOCUMENTAR
  ↓
INTEGRAR EM MAIN
  ↓
CHECKPOINT
```

Não avançar para a fase seguinte com um bloqueador conhecido.

Não abrir PR apenas para manter trabalho pendente. Se a implementação estiver validada e puder ser integrada, integrar.

---

# 4. FASE 0 — Congelamento e baseline

**Objetivo:** estabelecer o estado inicial e impedir regressões arquiteturais.

## 0.1 Confirmar branch e estado

Verificar:

- `main`;
- último commit;
- branches abertas relevantes;
- PRs abertas;
- working tree, quando disponível;
- arquivos canônicos.

## 0.2 Confirmar arquitetura

Verificar no código:

- origem da Home;
- origem de notícias;
- origem de agenda;
- origem de vídeos;
- origem de documentos;
- origem das proposições;
- origem das páginas;
- APIs realmente utilizadas.

## 0.3 Confirmar runtime

Verificar:

- build;
- configuração Cloudflare;
- Wrangler;
- entrypoint;
- assets;
- roteamento SPA;
- deploy atual.

## 0.4 Criar baseline

Registrar:

- build atual;
- rotas existentes;
- componentes principais;
- problemas já conhecidos;
- decisões do Brand Book.

### Critério de conclusão

- [ ] arquitetura confirmada;
- [ ] Cloudflare confirmado;
- [ ] fontes canônicas identificadas;
- [ ] baseline registrado;
- [ ] nenhum novo sistema criado.

---

# 5. FASE 1 — Auditoria integral da interface

**Objetivo:** descobrir exatamente o que precisa ser alterado antes de refatorar.

Esta fase é de diagnóstico. Não reconstruir a Home ainda.

## 1.1 Inventário de rotas

Mapear:

- rotas públicas;
- rotas administrativas;
- rotas duplicadas;
- rotas órfãs;
- links quebrados;
- páginas que deveriam existir;
- páginas que não devem ser públicas.

Entregar uma tabela:

| Rota | Existe | Fonte | Público | Problema | Ação |
|---|---|---|---|---|---|

## 1.2 Auditoria de navegação

Verificar:

- Header;
- Footer;
- bottom navigation;
- menus;
- estado ativo;
- links;
- breadcrumbs;
- navegação por teclado;
- CTA de contato.

## 1.3 Auditoria tipográfica

Procurar no código:

- fontes menores que 16px;
- `text-xs`;
- `text-sm` em conteúdo importante;
- labels pequenos;
- metadados ilegíveis;
- botões pequenos;
- truncamento;
- alturas fixas que cortam texto.

Produzir lista de componentes afetados.

## 1.4 Auditoria de contraste

Mapear todas as combinações relevantes:

- texto/fundo;
- texto secundário/fundo;
- links;
- botões;
- badges;
- footer;
- header;
- placeholders;
- estados;
- foco.

Nenhum problema deve ser resolvido apenas trocando uma cor sem verificar o contexto.

## 1.5 Auditoria de componentes

Mapear:

- Header;
- Hero;
- Buttons;
- Cards;
- Section headers;
- News;
- Agenda;
- Videos;
- Timeline;
- Footer;
- Mobile nav;
- formulários;
- modais.

## 1.6 Auditoria de acessibilidade

Verificar:

- landmarks;
- headings;
- labels;
- alt;
- foco;
- teclado;
- aria;
- estados;
- ordem de leitura;
- skip links;
- zoom;
- overflow horizontal.

## 1.7 Auditoria de conteúdo

Verificar se o texto atual responde:

- quem é;
- qual cargo;
- trajetória;
- atuação;
- notícias;
- agenda;
- contato;
- transparência.

### Entregável da Fase 1

Criar uma matriz:

```
PROBLEMA
→ ARQUIVO
→ COMPONENTE
→ IMPACTO
→ PRIORIDADE
→ CORREÇÃO
→ TESTE
```

### Critério de conclusão

- [ ] rotas auditadas;
- [ ] navegação auditada;
- [ ] tipografia auditada;
- [ ] contraste auditado;
- [ ] componentes auditados;
- [ ] acessibilidade auditada;
- [ ] conteúdo auditado;
- [ ] matriz consolidada.

---

# 6. FASE 2 — Sistema visual e Design Tokens

**Objetivo:** criar uma base visual única antes de reformar páginas.

## 2.1 Cores

Transformar cores em tokens semânticos:

- `brand-primary`;
- `brand-primary-dark`;
- `brand-primary-light`;
- `brand-secondary`;
- `brand-accent`;
- `surface`;
- `surface-muted`;
- `surface-dark`;
- `text-primary`;
- `text-secondary`;
- `text-muted`;
- `border`;
- `focus`;
- `electoral-number`.

## 2.2 Contraste

Para cada token:

1. identificar fundos possíveis;
2. calcular contraste;
3. corrigir combinações insuficientes;
4. registrar combinações aprovadas;
5. impedir uso inadequado.

## 2.3 Tipografia

Definir:

- Display;
- H1;
- H2;
- H3;
- body-large;
- body;
- body-small;
- label;
- navigation;
- caption;
- número eleitoral.

Regra:

> Nunca diminuir texto de conteúdo apenas para encaixar mais informação.

## 2.4 Espaçamento

Criar escala consistente, preferencialmente em múltiplos de 4px.

## 2.5 Radius e sombras

Usar poucos valores.

Não transformar todo elemento em card arredondado.

## 2.6 Motion

Não depender de animação para comunicar função.

Respeitar `prefers-reduced-motion` quando houver movimento.

## 2.7 Remover dívida visual

Eliminar gradualmente:

- glass;
- blur decorativo;
- cores conflitantes;
- tokens antigos;
- fontes inconsistentes.

### Critério

- [ ] tokens definidos;
- [ ] contraste validado;
- [ ] tipografia definida;
- [ ] espaçamento definido;
- [ ] estilos conflitantes removidos;
- [ ] build funcionando.

---

# 7. FASE 3 — Acessibilidade estrutural

**Objetivo:** fazer a acessibilidade funcionar no produto inteiro.

## 3.1 Estrutura semântica

Garantir:

- `header`;
- `nav`;
- `main`;
- `section`;
- `footer`;
- headings em ordem;
- landmarks únicos quando necessário.

## 3.2 Skip links

Implementar acesso rápido a:

- conteúdo;
- menu;
- busca, quando houver.

## 3.3 Foco

Garantir foco visível em:

- links;
- botões;
- inputs;
- menus;
- modal;
- navegação.

## 3.4 Teclado

Testar fluxo completo sem mouse.

## 3.5 Formulários

Garantir:

- label;
- instrução;
- erro associado;
- foco no erro quando apropriado;
- mensagens compreensíveis;
- não depender de placeholder como label.

## 3.6 Imagens

Garantir:

- alt informativo quando necessário;
- alt vazio para imagens decorativas;
- contexto correto para fotos institucionais.

## 3.7 Leitores de tela

Validar:

- ordem;
- nomes acessíveis;
- botões;
- links;
- menus;
- modal;
- estados.

## 3.8 Controle de acessibilidade

Implementar conforme decisão do Brand Book:

- tamanho do texto;
- tamanho normal;
- alto contraste;
- página/área de acessibilidade.

O eMAG documenta barra de acessibilidade, alto contraste, atalhos e página de recursos como referências para portais públicos. citeturn0search0turn0search5

## 3.9 Zoom

Testar pelo menos:

- 100%;
- 125%;
- 150%;
- 200%.

### Critério

- [ ] teclado;
- [ ] foco;
- [ ] semântica;
- [ ] formulários;
- [ ] imagens;
- [ ] screen reader;
- [ ] zoom 200%;
- [ ] contraste;
- [ ] controles acessíveis.

---

# 8. FASE 4 — Navegação e shell do produto

**Objetivo:** corrigir a estrutura de navegação antes da Home.

## 4.1 Header desktop

Priorizar:

- identidade;
- Início;
- Trajetória;
- Atuação;
- Notícias;
- Agenda;
- Mais;
- Fale com o Gabinete.

## 4.2 Mobile

Usar quatro itens:

1. Início;
2. Atuação;
3. Notícias;
4. Mais.

## 4.3 Menu Mais

Conter:

- Trajetória;
- Proposições;
- Votações;
- Comissões;
- Resultados;
- Agenda;
- Municípios;
- Vídeos;
- Documentos;
- Transparência;
- Contato;
- Acessibilidade.

## 4.4 Estado ativo

O usuário deve saber claramente onde está.

Não usar somente cor para indicar estado.

## 4.5 Footer

Organizar:

- identidade;
- canais oficiais;
- transparência;
- acessibilidade;
- documentos;
- contato;
- links institucionais.

## 4.6 Área segura mobile

Garantir que:

- bottom nav;
- CTA flutuante;
- conteúdo;
- formulários

não se sobreponham.

### Critério

- [ ] desktop;
- [ ] mobile;
- [ ] menu Mais;
- [ ] estado ativo;
- [ ] footer;
- [ ] teclado;
- [ ] zoom;
- [ ] safe area.

---

# 9. FASE 5 — Fale com o Gabinete

**Objetivo:** transformar comunicação cidadã em função de primeira classe.

## 5.1 CTA

Criar CTA textual de alta visibilidade:

**Fale com o Gabinete**

Não usar somente ícone.

## 5.2 Desktop

CTA no Header e em pontos estratégicos do conteúdo.

## 5.3 Mobile

Botão flutuante persistente.

Regras:

- não cobrir conteúdo;
- não cobrir bottom nav;
- respeitar safe area;
- alto contraste;
- texto legível;
- tamanho de toque adequado;
- fechar/recolher quando necessário.

## 5.4 Fluxo

Implementar:

1. assunto;
2. mensagem;
3. identificação mínima;
4. canal de retorno;
5. confirmação.

## 5.5 Proteção de dados

Solicitar apenas dados necessários.

Não transformar o formulário público em cadastro excessivo.

## 5.6 Estado

Tratar:

- carregando;
- sucesso;
- erro;
- validação;
- tentativa novamente.

### Critério

Um cidadão deve conseguir iniciar uma manifestação sem procurar contato no rodapé.

---

# 10. FASE 6 — Transparência e política de publicação

**Objetivo:** definir o que deve ser público antes de expor mais conteúdo.

## 6.1 Classificação

Classificar documentos e dados:

### Público

Informação com finalidade pública e adequada à divulgação.

### Público com tratamento

Informação que precisa de remoção/minimização de dados pessoais.

### Interno

Informação operacional ou administrativa sem finalidade pública.

### Restrito

Informação protegida por legislação, segurança ou outro fundamento.

## 6.2 Auditoria documental

Para cada categoria:

- fonte;
- finalidade;
- público-alvo;
- existência de dados pessoais;
- fundamento de publicação;
- necessidade de anonimização;
- retenção;
- link público.

## 6.3 Página Transparência

Criar uma experiência compreensível, não uma lista de PDFs.

Agrupar por assunto.

## 6.4 Explicação

Cada grupo deve explicar:

- o que é;
- por que está publicado;
- período;
- fonte;
- como consultar.

### Critério

Nenhum documento deve ser publicado apenas porque está disponível tecnicamente.

---

# 11. FASE 7 — Reconstrução da Home V2

**Objetivo:** fazer a Home funcionar como portal institucional.

## 7.1 Hero

Mostrar:

- Carlos Búrigo;
- função;
- fotografia;
- mensagem factual;
- atuação;
- CTA de trajetória;
- CTA de contato.

## 7.2 Trajetória resumida

Mostrar 4–6 marcos.

Link para trajetória completa.

## 7.3 Atuação Parlamentar

Entradas para:

- proposições;
- votações;
- comissões;
- relatorias;
- discursos;
- resultados.

## 7.4 Pautas

Só publicar após auditoria factual.

## 7.5 Resultados

Somente evidências documentadas.

Cada resultado deve informar:

- o que;
- quando;
- onde;
- papel exercido;
- fonte/evidência.

## 7.6 Transparência

Criar entrada clara.

## 7.7 Agenda

Mostrar informação pública atualizada.

## 7.8 Notícias

Priorizar conteúdo recente sem deixar notícias dominarem a identidade.

## 7.9 Vídeos

Manter como camada de comunicação.

## 7.10 Gabinete

CTA forte no final da jornada.

### Critério

A Home deve responder às perguntas institucionais principais sem obrigar o cidadão a navegar profundamente.

---

# 12. FASE 8 — Trajetória

**Objetivo:** tornar o histórico público consultável.

## 8.1 Estrutura

Página `/trajetoria`.

## 8.2 Timeline

Organizar cronologicamente:

- São José dos Ausentes;
- formação/início profissional;
- prefeitura;
- gestão pública em Caxias do Sul;
- Governo do RS;
- mandato parlamentar;
- atuação atual.

## 8.3 Evidência

Quando possível, associar:

- fonte;
- documento;
- período;
- cargo;
- contexto.

## 8.4 Linguagem

Factual.

Não transformar biografia em slogans.

### Critério

O cidadão consegue compreender a trajetória sem depender de notícias dispersas.

---

# 13. FASE 9 — Atuação Parlamentar

**Objetivo:** transformar dados legislativos em experiência pública compreensível.

## 9.1 Proposições

Usar `legislative_items` como fonte canônica.

## 9.2 Votações

Derivar da fonte existente.

## 9.3 Comissões

Apresentar participação pública disponível.

## 9.4 Relatorias

Mostrar quando houver dado verificável.

## 9.5 Discursos

Apresentar quando houver fonte pública existente.

## 9.6 Filtros

Priorizar filtros simples:

- período;
- tema;
- tipo;
- situação.

Evitar dashboard excessivo.

## 9.7 Detalhes

Cada item deve responder:

- o que é;
- quando;
- situação;
- relação com o mandato;
- fonte oficial.

### Critério

Não criar novo banco legislativo nem duplicar os dados.

---

# 14. FASE 10 — Resultados e pautas

**Objetivo:** evitar conteúdo promocional sem evidência.

## 10.1 Auditoria de pautas

Para cada pauta:

- tema;
- atuação concreta;
- período;
- documento;
- proposição;
- município/região;
- fonte.

## 10.2 Resultados

Não usar apenas frases como "trabalhando por X".

Exigir evidência.

## 10.3 Página de detalhe

Quando necessário:

- contexto;
- atuação;
- documento;
- fonte;
- cronologia.

### Critério

Nenhum resultado/pauta factual sem base verificável.

---

# 15. FASE 11 — Documentos e acervo

**Objetivo:** organizar documentos públicos sem transformar o portal em arquivo indiscriminado.

## 11.1 Inventário

Verificar:

- documentos existentes;
- metadados;
- Storage;
- duplicatas;
- documentos sem contexto.

## 11.2 Classificação

Separar:

- legislativo;
- institucional;
- transparência;
- histórico;
- outros públicos.

## 11.3 Apresentação

Cada documento deve ter:

- título;
- tipo;
- data/período;
- contexto;
- origem;
- ação de visualização/download.

## 11.4 Segurança

Nunca expor:

- credenciais;
- arquivos internos;
- dados pessoais desnecessários.

### Critério

Acervo público organizado, contextualizado e sem duplicação.

---

# 16. FASE 12 — SEO institucional

**Objetivo:** fazer o conteúdo ser compreendido por buscadores e cidadãos.

## 12.1 Metadata

Cada rota relevante:

- title;
- description;
- canonical.

## 12.2 Estrutura

Garantir:

- H1;
- H2/H3;
- links internos;
- texto real.

## 12.3 Social

Implementar:

- Open Graph;
- Twitter/X Card quando aplicável.

## 12.4 Indexação

Validar:

- sitemap;
- robots;
- canonical;
- URLs.

## 12.5 Dados estruturados

Avaliar schemas apropriados sem inventar entidades ou dados.

### Critério

Cada página pública relevante é encontrável, compreensível e semanticamente conectada.

---

# 17. FASE 13 — PWA

**Objetivo:** permitir instalação e boa experiência mobile sem criar outro produto.

## 13.1 Manifest

Definir:

- nome;
- short name;
- icons;
- theme;
- background;
- display.

## 13.2 Ícones

Criar a partir de identidade aprovada.

## 13.3 Service worker

Adicionar somente depois de definir estratégia de cache.

## 13.4 Cache

Priorizar:

- shell;
- assets;
- fallback offline.

Não manter indefinidamente conteúdo político dinâmico desatualizado.

## 13.5 Instalação

Testar em dispositivos compatíveis.

### Critério

PWA é uma extensão do portal, não um segundo aplicativo.

---

# 18. FASE 14 — Auditoria final de acessibilidade

**Objetivo:** testar o produto real, não apenas o código.

## 14.1 Teste visual

Viewports:

- 360px;
- 390px;
- 768px;
- 1024px;
- 1280px;
- 1440px.

## 14.2 Zoom

Testar:

- 100%;
- 125%;
- 150%;
- 200%.

## 14.3 Teclado

Executar jornada completa.

## 14.4 Contraste

Testar:

- texto;
- links;
- botões;
- estados;
- foco;
- footer;
- overlays.

## 14.5 Screen reader

Validar pelo menos os fluxos principais:

- Home;
- menu;
- atuação;
- notícia;
- transparência;
- contato.

## 14.6 Mobile

Verificar:

- touch;
- safe area;
- bottom nav;
- CTA;
- formulários;
- rolagem;
- orientação.

### Critério

Não basta o Lighthouse estar verde. A validação humana continua necessária.

---

# 19. FASE 15 — QA funcional e conteúdo

## 15.1 Build

Executar build oficial.

## 15.2 Rotas

Verificar todas as rotas públicas.

## 15.3 Dados

Verificar:

- nomes;
- cargos;
- datas;
- links;
- documentos;
- proposições;
- agenda;
- notícias.

## 15.4 Estados

Testar:

- vazio;
- carregamento;
- erro;
- conteúdo indisponível;
- item inexistente.

## 15.5 Comunicação

Testar envio do contato.

## 15.6 Transparência

Testar abertura dos documentos públicos.

### Critério

Nenhum bloqueador funcional conhecido.

---

# 20. FASE 16 — Auditoria final do cidadão

Esta é a validação mais importante.

Simular um cidadão que nunca utilizou o portal.

## Perguntas obrigatórias

### Identidade

> Quem é Carlos Búrigo?

### Trajetória

> O que ele fez antes do mandato atual?

### Mandato

> O que ele faz atualmente?

### Atuação

> Quais proposições e votações posso consultar?

### Transparência

> Onde vejo documentos e informações públicas?

### Atualidade

> O que aconteceu recentemente?

### Participação

> Como faço uma solicitação?

### Contato

> Como falo com o gabinete?

### Acessibilidade

> Consigo ler tudo no celular sem esforço excessivo?

Se alguma resposta exigir procura excessiva, revisar a arquitetura.

---

# 21. Critérios de aceite global

A refatoração somente poderá ser considerada concluída quando:

- [ ] o portal estiver claramente orientado ao cidadão;
- [ ] a Home tiver hierarquia institucional;
- [ ] trajetória estiver disponível;
- [ ] atuação parlamentar estiver organizada;
- [ ] transparência estiver disponível;
- [ ] documentos públicos estiverem contextualizados;
- [ ] Fale com o Gabinete estiver visível;
- [ ] CTA mobile funcionar;
- [ ] fonte principal estiver confortável;
- [ ] não houver texto essencial pequeno;
- [ ] contraste estiver validado;
- [ ] zoom 200% funcionar;
- [ ] teclado funcionar;
- [ ] foco estiver evidente;
- [ ] navegação mobile tiver quatro itens;
- [ ] não houver glassmorphism;
- [ ] não houver arquitetura duplicada;
- [ ] dados legislativos continuarem usando fonte canônica;
- [ ] Cloudflare continuar sendo runtime de produção;
- [ ] PWA funcionar sem virar segundo produto;
- [ ] SEO básico estiver completo;
- [ ] build estiver verde;
- [ ] validação visual estiver concluída;
- [ ] validação de conteúdo estiver concluída.

---

# 22. Política de commits e integração

## Regra

Cada fase concluída deve produzir um checkpoint claro.

Formato sugerido:

```
refactor: complete phase N - <descricao>
```

Exemplos:

```
refactor: complete phase 2 - accessible design tokens
refactor: complete phase 4 - public navigation
refactor: complete phase 7 - institutional home
```

## Não fazer

- commits gigantes misturando fases sem relação;
- PRs intermináveis;
- duas implementações da mesma função;
- branches abandonadas quando a fase já foi integrada;
- alterar arquitetura para resolver problema visual.

## Integração

Quando a fase estiver:

- implementada;
- testada;
- validada;

integrar em `main`.

Depois registrar o SHA no checkpoint.

---

# 23. Checkpoints de continuidade

| Fase | Estado | Commit | Observação |
|---|---|---|---|
| 0 — Baseline | CONCLUÍDA | 0e8091fad4f1da599a00dbdaf51791390a3d90fe | Baseline arquitetural e operacional confirmado; PR #19 integrado |
| 1 — Auditoria | CONCLUÍDA | 218bc8bf8a182bd4d3b33c933b6903fb57a8c1a0 | Auditoria integral registrada em `docs/audits/FASE-1-AUDITORIA-INTERFACE.md` |
| 2 — Design Tokens | CONCLUÍDA | a64d80abe66ecec5972040e75123410447cf88f7 | Tokens semânticos, tipografia, contraste base, redução de motion e neutralização do glass documentados em `docs/design/DESIGN-TOKENS-V2.md` |
| 3 — Acessibilidade | PENDENTE | — | |
| 4 — Navegação | PENDENTE | — | |
| 5 — Gabinete | PENDENTE | — | |
| 6 — Transparência | PENDENTE | — | |
| 7 — Home V2 | PENDENTE | — | |
| 8 — Trajetória | PENDENTE | — | |
| 9 — Atuação | PENDENTE | — | |
| 10 — Resultados/Pautas | PENDENTE | — | |
| 11 — Documentos | PENDENTE | — | |
| 12 — SEO | PENDENTE | — | |
| 13 — PWA | PENDENTE | — | |
| 14 — Acessibilidade final | PENDENTE | — | |
| 15 — QA final | PENDENTE | — | |
| 16 — Auditoria cidadão | PENDENTE | — | |

Estados permitidos:

- PENDENTE
- EM ANDAMENTO
- BLOQUEADA
- CONCLUÍDA
- REABERTA

---

# 24. Registro de bloqueadores

| Fase | Bloqueador | Evidência | Próxima ação |
|---|---|---|---|
| 0 | PR #19 estava aberto antes da execução da Fase 0 | PR #19 documentava ADRs canônicos; foi integrado nesta fase | Resolvido: PR #19 merged |
| 0 | Metadado `homepage` do repositório ainda aponta para Vercel | `get_repo` retorna `https://deputado-darlos-burigo.vercel.app` | Corrigir durante auditoria/SEO; não reintroduzir Vercel como runtime |
| 0 | Existem branches históricas/paralelas no repositório | Listagem de branches mostra branches de consolidação, UX, Vercel e outras fases antigas | Não usar essas branches como fonte de verdade; trabalhar a partir de `main` |

Não mascarar bloqueador como concluído.

---

# 25. Registro de decisões durante a execução

| Data | Fase | Decisão | Motivo | Estado |
|---|---|---|---|---|
| 2026-09-18 | Plano | Criar plano persistente de continuidade | Evitar perda de contexto entre sessões | CANÔNICA |
| 2026-09-18 | Acessibilidade | Priorizar 16px mínimo e 17–18px preferencial | Público amplo e leitura mobile | CANÔNICA |
| 2026-09-18 | Comunicação | Fale com o Gabinete é função central | Participação cidadã | CANÔNICA |
| 2026-09-18 | Transparência | Classificar documentos antes da publicação | Evitar exposição indiscriminada | CANÔNICA |
| 2026-09-18 | Execução | Integrar fases validadas em main | Evitar acúmulo de branches/PRs | CANÔNICA |
| 2026-09-18 | Fase 0 | `main` é a única referência operacional da refatoração | Evitar continuidade em branches históricas divergentes | CANÔNICA |
| 2026-09-18 | Fase 0 | PR #19 foi integrado antes do checkpoint da fase | O ADR documenta decisões arquiteturais que já estavam vigentes | CONCLUÍDA |
| 2026-09-18 | Fase 0 | Referência Vercel no metadata do repositório é tratada como resíduo a corrigir | Cloudflare é o runtime canônico | PENDENTE |
| 2026-09-18 | Fase 1 | Auditoria deve ser audit-only antes da reconstrução visual | Evitar alterar a Home com diagnóstico incompleto | CONCLUÍDA |
| 2026-09-18 | Fase 1 | Base atual é aproveitável; priorizar shell, tokens e acessibilidade antes da Home | Evitar segunda arquitetura e retrabalho | CONCLUÍDA |
| 2026-09-18 | Fase 2 | Design system usa tokens semânticos com aliases de compatibilidade | Evitar migração destrutiva e segunda arquitetura de estilos | CONCLUÍDA |
| 2026-09-18 | Fase 2 | Marca verde principal para texto/ação foi ajustada para garantir contraste mínimo; amarelo e vermelho permanecem acentos visuais | Separar identidade de cor de requisitos de legibilidade | CONCLUÍDA |
| 2026-09-18 | Fase 2 | Glassmorphism foi neutralizado, não substituído por outro padrão complexo | Brand Book proíbe glass e prioriza simplicidade | CONCLUÍDA |

---

# 26. Estado atual e próximo passo

**Estado atual:**

```
FASE 0 — CONCLUÍDA
FASE 1 — CONCLUÍDA
FASE 2 — CONCLUÍDA
FASE 3 — PENDENTE
```

### Próxima ação obrigatória

Executar **FASE 3 — Acessibilidade estrutural**.

A Fase 2 foi concluída com o sistema visual base registrado em `docs/design/DESIGN-TOKENS-V2.md`. A Home não foi reconstruída nesta fase.

---

# 27. Regra de retomada após interrupção

Se a sessão for interrompida, o próximo agente deve executar:

```
1. Ler este documento
2. Ler BRAND-BOOK-CARLOS-BURIGO-V2.md
3. Consultar main
4. Identificar último checkpoint
5. Verificar commits posteriores
6. Verificar se o código corresponde ao checkpoint
7. Retomar a primeira subfase PENDENTE
8. Não repetir trabalho concluído
9. Atualizar este documento
10. Integrar quando validado
```

Se houver dúvida sobre o estado, **auditar o código antes de implementar**.

Não confiar em mensagens de chats anteriores como fonte de estado técnico.

---

# 28. Resultado esperado

Ao final, o produto deverá ser percebido como:

**um portal institucional público, simples, legível, acessível e transparente, no qual o cidadão consegue conhecer a trajetória, acompanhar a atuação parlamentar, consultar informações públicas e falar com o gabinete sem fricção.**

A sofisticação do produto deverá vir da **clareza da informação e da qualidade da experiência**, não da quantidade de componentes, efeitos ou complexidade técnica.
