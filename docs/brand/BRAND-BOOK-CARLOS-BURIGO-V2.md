# Brand Book — Carlos Búrigo V2

> **Status:** BASE CANÔNICA — em construção  
> **Última atualização:** 2026-09-18  
> **Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`  
> **Objetivo:** registrar a identidade visual e as decisões de produto que devem permanecer consistentes entre chats, agentes e futuras implementações.

---

## 0. Regra deste documento

Este arquivo é a **fonte de verdade da identidade digital** do projeto.

A partir de agora:

1. Toda decisão relevante de marca, UI, cores, tipografia, logo, navegação, Home, SEO visual e PWA deve ser registrada aqui.
2. Um novo chat deve começar pela leitura deste documento antes de alterar a identidade do site.
3. Não criar uma segunda identidade visual paralela.
4. Não substituir uma decisão registrada sem atualizar este documento.
5. Quando uma decisão ainda não estiver validada, ela deve ser marcada como **PROPOSTA**, **EM VALIDAÇÃO** ou **CANÔNICA**.
6. O código deve implementar este documento; o documento não deve ser alterado apenas para justificar uma implementação já feita.
7. O documento deve permanecer conciso o suficiente para ser usado por agentes de desenvolvimento.

---

# 1. Contexto da marca

## 1.1 Produto

O site é o **portal institucional digital de Carlos Búrigo**, deputado estadual do Rio Grande do Sul.

Ele não deve ser tratado como:

- simples galeria de documentos;
- arquivo de notícias;
- arquivo de vídeos;
- landing page de campanha;
- dashboard administrativo exposto ao cidadão.

A função principal do site é apresentar, de forma clara e verificável:

- quem é Carlos Búrigo;
- sua trajetória pública;
- seu mandato atual;
- sua atuação parlamentar;
- suas proposições;
- votações;
- comissões;
- resultados e ações documentadas;
- notícias;
- agenda;
- municípios e presença territorial;
- documentos públicos;
- formas de contato e participação.

## 1.2 Princípio de comunicação

A identidade deve transmitir **institucionalidade, clareza, proximidade e legibilidade**.

A comunicação visual não deve depender de efeitos decorativos para parecer sofisticada.

**Menos é mais.**

---

# 2. Hierarquia de identidade

A identidade será construída em três níveis:

### Nível 1 — MDB

A marca partidária deve respeitar o manual oficial do MDB.

Não redesenhar, deformar ou reinterpretar o logotipo oficial do partido.

O manual oficial do MDB deve ser tratado como referência normativa para usos da marca partidária.

### Nível 2 — Carlos Búrigo

Carlos Búrigo possui uma identidade própria dentro do contexto institucional.

Essa identidade deve permitir reconhecimento mesmo quando a marca partidária não estiver presente.

Elementos possíveis:

- nome;
- assinatura visual;
- símbolo/logo já utilizado;
- fotografia;
- sistema tipográfico;
- paleta derivada;
- tratamento gráfico;
- composição característica.

### Nível 3 — Eleitoral

Quando o contexto for explicitamente eleitoral, a identidade pode incorporar elementos eleitorais próprios, sempre respeitando a legislação e as regras oficiais aplicáveis.

O **número eleitoral** deve ser tratado como elemento visual de primeira classe durante o período eleitoral.

**Número de trabalho atualmente identificado: 15140.**

> Antes de qualquer publicação eleitoral definitiva, o número, situação da candidatura e demais dados eleitorais devem ser conferidos em fonte oficial do TSE.

---

# 3. Direção visual

## 3.1 Objetivo

Modernizar a presença digital sem apagar a identidade já reconhecível.

A direção deve combinar:

- identidade atual do candidato;
- referências visuais do MDB;
- linguagem digital contemporânea;
- aparência institucional;
- excelente contraste;
- leitura rápida no celular.

## 3.2 Referência do site atual

O site oficial atual de Carlos Búrigo é uma referência importante para:

- reconhecimento visual;
- logo existente;
- fotografia;
- relação entre nome e identidade;
- elementos que já fazem parte da percepção pública da marca.

**Regra:** antes de substituir um ativo visual existente, verificar se ele é um ativo oficial que deve ser preservado.

Não recriar uma logo do zero se o ativo original estiver disponível e for adequado para uso digital.

---

# 4. Logo e assinatura

## 4.1 Fonte da verdade

Os arquivos oficiais existentes devem ser catalogados antes de qualquer redesenho.

Inventário inicial:

- [ ] Logo principal atual
- [ ] Logo horizontal
- [ ] Logo vertical
- [ ] Símbolo/monograma, se existir
- [ ] Versão positiva
- [ ] Versão negativa
- [ ] Versão monocromática
- [ ] Arquivo vetorial
- [ ] PNG transparente
- [ ] Favicon
- [ ] Ícone para PWA

## 4.2 Regras

Não:

- distorcer proporções;
- alterar arbitrariamente as cores;
- adicionar sombras;
- aplicar gradientes não previstos;
- colocar efeitos de vidro;
- usar a logo como elemento decorativo excessivo.

## 4.3 Relação Carlos Búrigo × MDB

A apresentação deve deixar clara a diferença entre:

**identidade pessoal/institucional**  
e  
**identidade partidária**.

A marca do MDB não deve substituir a identidade do parlamentar.

Da mesma forma, a identidade de Carlos Búrigo não deve ser apresentada como se fosse a identidade oficial do MDB.

---

# 5. Sistema de cores

## 5.1 Princípio

A paleta atual do código não deve ser considerada definitiva.

O problema identificado não é simplesmente "falta de verde": é a falta de uma hierarquia semântica de cores e contraste.

A nova implementação deve trabalhar com tokens semânticos.

### Tokens previstos

| Token | Função |
|---|---|
| `brand-primary` | cor principal da identidade |
| `brand-primary-dark` | hover, texto sobre fundos claros, estados fortes |
| `brand-primary-light` | fundos e destaques sutis |
| `brand-secondary` | apoio institucional |
| `brand-accent` | destaque pontual |
| `surface` | fundo principal |
| `surface-muted` | seções secundárias |
| `surface-dark` | áreas institucionais específicas |
| `text-primary` | texto principal |
| `text-secondary` | texto secundário |
| `text-muted` | informação auxiliar |
| `border` | divisórias |
| `focus` | foco de acessibilidade |
| `electoral-number` | tratamento visual do número eleitoral |

## 5.2 Regra MDB

O verde, amarelo e demais cores associadas ao MDB podem orientar a paleta, mas não devem ser simplesmente aplicados em todas as superfícies.

A identidade digital deve usar:

- cor de marca para ações e reconhecimento;
- neutros para leitura;
- cor de destaque com parcimônia;
- contraste suficiente entre texto e fundo.

## 5.3 Proibição

Não usar como padrão visual:

- gradientes decorativos;
- glassmorphism;
- `backdrop-blur`;
- fundos excessivamente escuros sem necessidade;
- texto verde sobre fundo verde;
- amarelo como texto pequeno;
- vermelho como cor genérica de destaque.

---

# 6. Tipografia

## 6.1 Direção

A tipografia deve priorizar legibilidade e consistência.

Preferência:

1. Inter ou equivalente de alta legibilidade;
2. system-ui como fallback;
3. fonte display somente se houver justificativa clara.

A implementação atual usa fontes diferentes da constituição visual definida anteriormente. Isso deve ser revisado.

## 6.2 Hierarquia

Definir tokens:

- Display
- H1
- H2
- H3
- Body
- Body small
- Caption
- Navigation
- Label
- Electoral number

Evitar títulos gigantes apenas para criar impacto.

O tamanho deve obedecer à hierarquia do conteúdo.

---

# 7. Número eleitoral

## 7.1 Princípio

No modo eleitoral, o número do candidato deve ser imediatamente reconhecível.

Não deve aparecer como:

- texto escondido;
- detalhe de rodapé;
- badge pequeno;
- elemento secundário perdido na composição.

Deve existir uma composição própria para:

**CARLOS BÚRIGO**  
**15140**

A aplicação deve ser forte, limpa e reproduzível em:

- Hero;
- cards eleitorais;
- compartilhamento social;
- materiais digitais;
- favicon/ícone somente quando fizer sentido;
- versão mobile.

## 7.2 Separação institucional × eleitoral

O site deve conseguir existir institucionalmente sem transformar cada página em propaganda eleitoral.

Quando houver necessidade de alternância visual entre contextos, usar dois modos controlados:

### Modo institucional

Prioriza:

- mandato;
- atuação;
- transparência;
- trajetória;
- notícias;
- agenda;
- contato.

### Modo eleitoral

Adiciona:

- identificação eleitoral;
- número;
- elementos eleitorais permitidos;
- informações oficiais da candidatura.

Não duplicar a arquitetura do site para isso.

---

# 8. Fotografia

A fotografia é parte importante da identidade.

Priorizar:

- fotos reais;
- boa iluminação;
- contexto institucional;
- atuação parlamentar;
- contato com municípios;
- plenário/comissões;
- reuniões e agendas públicas.

Evitar:

- banco de imagens genérico;
- tratamento excessivo;
- filtros artificiais;
- sobreposição de textos que prejudique o rosto;
- imagens usadas apenas como decoração.

Sempre que possível, imagens devem ter contexto textual e origem identificável.

---

# 9. Ícones e elementos gráficos

Usar Lucide ou conjunto equivalente já adotado no projeto.

Regras:

- traço consistente;
- poucos ícones;
- ícone acompanhado de texto quando a ação não for óbvia;
- não usar ícones como decoração em excesso;
- não usar pontos genéricos como substitutos permanentes de ícones.

O estado ativo da navegação deve ser visualmente inequívoco.

---

# 10. Navegação

## 10.1 Desktop

A navegação principal deve refletir a função institucional do portal.

Estrutura-base:

- Início
- Trajetória
- Atuação
- Notícias
- Agenda
- Mais

Itens secundários podem entrar em "Mais".

## 10.2 Mobile

A barra inferior fixa deve ser simplificada.

### Proposta canônica

**4 itens:**

1. Início
2. Atuação
3. Notícias
4. Mais

Não usar seis ou mais itens na barra inferior.

O quarto item abre as demais áreas:

- Trajetória
- Proposições
- Votações
- Comissões
- Resultados
- Agenda
- Municípios
- Vídeos
- Documentos
- Contato

## 10.3 Regras visuais

A barra:

- deve ser sólida;
- não deve depender de `backdrop-blur`;
- deve ter contraste claro;
- deve mostrar o item ativo;
- deve respeitar área segura do aparelho;
- deve ter alvos de toque de pelo menos 44px.

---

# 11. Home

## 11.1 Nova função

A Home deixa de ser tratada como arquivo.

Ela é o **portal institucional**.

A Home deve responder rapidamente:

1. Quem é Carlos Búrigo?
2. Qual é sua função atual?
3. O que está fazendo?
4. Qual é sua trajetória?
5. Em que atua?
6. O que aconteceu recentemente?
7. Como o cidadão pode acompanhar ou entrar em contato?

## 11.2 Estrutura proposta

1. Header
2. Hero institucional
3. Trajetória resumida
4. Atuação Parlamentar
5. Principais pautas
6. Resultados documentados
7. Agenda
8. Notícias
9. Vídeos
10. Gabinete / Participe
11. Footer

## 11.3 Hero

O Hero deve priorizar:

- nome Carlos Búrigo;
- função atual;
- fotografia/identidade;
- mensagem institucional factual;
- CTA principal para atuação;
- CTA secundário para trajetória.

No modo eleitoral, pode incorporar o número eleitoral com destaque.

## 11.4 Trajetória

A Home deve mostrar uma linha do tempo resumida.

Marcos já identificados para posterior validação documental:

- São José dos Ausentes;
- atuação como prefeito;
- gestão pública em Caxias do Sul;
- atuação no Governo do Rio Grande do Sul;
- atuação como deputado estadual;
- mandato atual.

A versão completa deve ficar em `/trajetoria` ou área equivalente.

---

# 12. Atuação Parlamentar

A Home deve apresentar o mandato como uma área própria.

Possíveis entradas:

- Proposições
- Votações
- Comissões
- Relatorias
- Discursos
- Frentes parlamentares
- Atividades legislativas

Tudo deve usar dados já existentes no sistema ou fontes públicas verificáveis.

Não criar conteúdo político factual sem fonte.

---

# 13. Pautas

A seção de pautas só deve ser criada depois de uma auditoria factual.

Cada pauta deve responder:

- qual é o tema;
- qual é a atuação concreta;
- qual é o período;
- qual documento ou proposição comprova;
- qual o contexto territorial, quando aplicável.

Evitar slogans vagos apresentados como fatos.

---

# 14. Resultados

"Resultados" não deve ser uma coleção de frases promocionais.

Cada resultado deve possuir, quando disponível:

- título;
- descrição objetiva;
- período;
- município/região;
- papel exercido;
- proposição/ato relacionado;
- documento ou fonte;
- link para evidência.

---

# 15. Notícias, vídeos e documentos

Esses conteúdos são importantes, mas são **camadas do portal**, não a identidade do portal.

### Notícias

Representam atividade recente.

### Vídeos

Representam comunicação audiovisual.

### Documentos

Representam transparência e acervo.

Nenhum deles deve dominar a Home a ponto de esconder a identidade e a atuação parlamentar.

---

# 16. SEO

SEO será tratado como parte da arquitetura institucional.

## 16.1 Princípios

Cada página importante deve possuir:

- título único;
- descrição única;
- URL semântica;
- H1 único;
- hierarquia de headings;
- conteúdo textual real;
- canonical;
- Open Graph;
- Twitter/X Card quando aplicável;
- dados estruturados apropriados;
- sitemap;
- robots;
- links internos.

## 16.2 Hub semântico

A Home deve distribuir autoridade e contexto para:

- /sobre
- /trajetoria
- /atuacao
- /proposicoes
- /votacoes
- /comissoes
- /resultados
- /noticias
- /agenda
- /municipios
- /videos
- /documentos
- /contato

Não criar rotas que dupliquem dados existentes.

---

# 17. Acessibilidade

Meta mínima:

**WCAG 2.2 AA**, sempre que aplicável.

Prioridades:

- contraste;
- foco visível;
- teclado;
- texto alternativo;
- labels;
- tamanho de toque;
- leitura por tecnologia assistiva;
- ordem semântica;
- redução de dependência de cor.

A identidade visual nunca deve comprometer acessibilidade.

---

# 18. PWA

O site deve evoluir para PWA sem transformar o projeto em um aplicativo separado.

## 18.1 Requisitos

- Web App Manifest;
- nome;
- nome curto;
- ícones;
- theme color;
- background color;
- display apropriado;
- service worker;
- fallback offline para shell;
- instalação em dispositivos compatíveis.

## 18.2 Regra de cache

Não armazenar indefinidamente conteúdo político ou institucional dinâmico no cache do app.

O PWA deve priorizar:

- shell;
- assets;
- páginas estáticas adequadas;
- fallback offline.

Conteúdo dinâmico deve continuar vindo da fonte canônica.

---

# 19. Arquitetura de conteúdo

A identidade visual não autoriza criar uma segunda arquitetura.

Fonte canônica existente:

- Supabase;
- `pages`;
- `page_blocks`;
- `legislative_items`;
- `documents`;
- demais entidades já existentes.

Regras:

- não criar tabela duplicada sem necessidade;
- não criar API paralela para substituir a fonte existente;
- não duplicar documentos;
- não duplicar proposições;
- não criar uma segunda Home;
- não criar um segundo sistema de blocos.

---

# 20. Design System

A implementação futura deve transformar este Brand Book em tokens de design.

## Tokens obrigatórios

### Cor

- brand
- surface
- text
- border
- focus
- electoral

### Tipografia

- display
- heading
- body
- label
- caption
- navigation
- number

### Espaçamento

Escala consistente, preferencialmente baseada em múltiplos de 4px.

### Radius

Poucos valores.

Evitar cartões excessivamente arredondados.

### Sombras

Usar com parcimônia.

### Motion

A identidade atualizada não deve depender de animações.

---

# 21. Componentes prioritários

Ordem de revisão:

1. Header
2. Hero
3. Typography
4. Buttons
5. Cards
6. Timeline
7. Section headers
8. News cards
9. Agenda
10. Parliamentary activity
11. Mobile navigation
12. Footer
13. Electoral number block
14. PWA icons

---

# 22. Ativos

## Inventário a completar

| Ativo | Estado | Ação |
|---|---|---|
| Logo atual Carlos Búrigo | A identificar | Extrair/cadastrar |
| Logo MDB | Oficial | Usar fonte oficial |
| Fotografia principal | A identificar | Catalogar |
| Fotos secundárias | A identificar | Catalogar |
| Ícone/favicon | A criar | Derivar da identidade |
| PWA 192x192 | A criar | Derivar da identidade |
| PWA 512x512 | A criar | Derivar da identidade |
| OG image | A criar | Criar após identidade |
| Número eleitoral | 15140 — confirmar TSE | Validar antes de publicação |
| Paleta final | Em validação | Definir após auditoria dos ativos |

---

# 23. Regras contra regressão

Nenhuma implementação futura deve:

- reintroduzir glassmorphism;
- reintroduzir navegação mobile com seis ou mais itens;
- remover a trajetória parlamentar;
- transformar Home novamente em arquivo;
- criar uma segunda arquitetura de conteúdo;
- duplicar dados do Supabase;
- usar logo não validada;
- inventar resultados;
- inventar pautas;
- esconder o estado ativo da navegação;
- sacrificar contraste por estética;
- usar o número eleitoral fora do contexto apropriado;
- substituir a identidade institucional por uma identidade puramente eleitoral.

---

# 24. Roadmap visual

## Fase A — Identidade

- [ ] catalogar logo atual;
- [ ] catalogar ativos existentes;
- [ ] comparar com manual oficial MDB;
- [ ] definir paleta final;
- [ ] definir tipografia;
- [ ] definir tratamento fotográfico;
- [ ] definir composição do número eleitoral;
- [ ] fechar Brand Book.

## Fase B — Design Tokens

- [ ] transformar decisões em tokens CSS;
- [ ] remover tokens antigos conflitantes;
- [ ] corrigir contraste;
- [ ] remover glassmorphism;
- [ ] revisar tipografia;
- [ ] revisar estados de foco/hover.

## Fase C — Navegação e componentes

- [ ] Header;
- [ ] mobile navigation com 4 itens;
- [ ] Footer;
- [ ] Buttons;
- [ ] Cards;
- [ ] Timeline;
- [ ] Hero.

## Fase D — Home V2

- [ ] Hero institucional;
- [ ] Trajetória;
- [ ] Atuação parlamentar;
- [ ] Pautas;
- [ ] Resultados;
- [ ] Agenda;
- [ ] Notícias;
- [ ] Vídeos;
- [ ] Gabinete/Participe.

## Fase E — SEO

- [ ] metadata;
- [ ] canonical;
- [ ] sitemap;
- [ ] robots;
- [ ] Open Graph;
- [ ] dados estruturados;
- [ ] arquitetura interna de links.

## Fase F — PWA

- [ ] manifest;
- [ ] ícones;
- [ ] service worker;
- [ ] shell offline;
- [ ] estratégia de cache;
- [ ] instalação;
- [ ] validação mobile.

---

# 25. Referências

## Identidade MDB

Manual oficial de Identidade Visual do MDB:

https://www.mdb.org.br/wp-content/uploads/2024/06/MANUAL_MDB_2018_v3.pdf

O manual estabelece regras de padronização para aplicações da marca MDB e deve ser consultado antes de qualquer uso ou adaptação da marca partidária.

## Presença digital atual

Site oficial atual de Carlos Búrigo:

https://www.carlosburigo.com.br/

Este site deve ser usado como referência para identificar ativos e elementos de reconhecimento existentes, não como modelo obrigatório de arquitetura da V2.

---

# 26. Registro de decisões

| Data | Decisão | Estado |
|---|---|---|
| 2026-09-18 | Este arquivo passa a ser a fonte de verdade da identidade digital | CANÔNICA |
| 2026-09-18 | Home deve ser portal institucional, não arquivo | CANÔNICA |
| 2026-09-18 | Trajetória deve existir como eixo estrutural | CANÔNICA |
| 2026-09-18 | Mobile bottom navigation deve ter 4 itens | PROPOSTA CANÔNICA |
| 2026-09-18 | Glassmorphism/backdrop blur não fazem parte da identidade V2 | CANÔNICA |
| 2026-09-18 | Número eleitoral deve ter tratamento próprio no modo eleitoral | CANÔNICA |
| 2026-09-18 | Número de trabalho identificado: 15140; validar em fonte oficial antes da publicação | EM VALIDAÇÃO |
| 2026-09-18 | PWA será evolução do mesmo site, não um segundo aplicativo | CANÔNICA |
| 2026-09-18 | Não criar segunda arquitetura de conteúdo | CANÔNICA |

---

# 27. Como continuar em um novo chat

Ao iniciar um novo chat sobre este projeto:

1. localizar este arquivo no GitHub;
2. ler a versão atual;
3. verificar o último registro de decisões;
4. verificar o estado real do código;
5. atualizar este arquivo antes de introduzir uma nova decisão estrutural;
6. implementar somente depois de alinhar o código ao documento;
7. registrar no final o que foi decidido e implementado.

**Este arquivo é o ponto de continuidade entre conversas.**
