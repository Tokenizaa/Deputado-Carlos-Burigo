# Brand Book — Carlos Búrigo V2

> **Status:** BASE CANÔNICA — em construção  
> **Última atualização:** 2026-09-18  
> **Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`  
> **Objetivo:** registrar a identidade visual e as decisões de produto que devem permanecer consistentes entre chats, agentes e futuras implementações.

---

## 0. Regra deste documento

Este arquivo é a **fonte de verdade da identidade digital** do projeto.

A partir de agora:

1. Toda decisão relevante de marca, UI, cores, tipografia, logo, navegação, Home, SEO visual, acessibilidade, comunicação com o cidadão e PWA deve ser registrada aqui.
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
- dashboard administrativo;
- aplicativo interno de gabinete.

A função principal do site é servir ao **cidadão**.

O cidadão deve conseguir, com pouca fricção:

- saber quem é Carlos Búrigo;
- conhecer sua trajetória pública;
- entender o mandato atual;
- consultar sua atuação parlamentar;
- consultar proposições, votações e comissões;
- acompanhar ações e resultados documentados;
- acessar informações de transparência;
- consultar notícias e agenda;
- encontrar documentos públicos relevantes;
- fazer uma solicitação, manifestação ou contato com o gabinete;
- encontrar canais oficiais de comunicação.

## 1.2 Princípio de comunicação

A identidade deve transmitir **institucionalidade, clareza, proximidade, legibilidade e serviço público digital**.

A comunicação visual não deve depender de efeitos decorativos para parecer sofisticada.

**Menos é mais.**

A pergunta central de qualquer decisão de UX é:

> **"Isso facilita a vida do cidadão ou apenas deixa a interface mais bonita?"**

---

# 2. Público prioritário

O produto não é desenhado para o deputado ou para a equipe do gabinete.

É desenhado para o público externo.

O público pode variar amplamente em:

- idade;
- escolaridade;
- familiaridade digital;
- qualidade do dispositivo;
- tamanho de tela;
- visão;
- audição;
- mobilidade;
- uso de tecnologia assistiva;
- qualidade da conexão.

Portanto, **mobile e acessibilidade não são versões reduzidas do produto: são requisitos centrais do produto**.

---

# 3. Hierarquia de identidade

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

# 4. Direção visual

## 4.1 Objetivo

Modernizar a presença digital sem apagar a identidade já reconhecível.

A direção deve combinar:

- identidade atual do candidato;
- referências visuais do MDB;
- linguagem digital contemporânea;
- aparência institucional;
- excelente contraste;
- leitura rápida no celular;
- acessibilidade para diferentes faixas etárias.

## 4.2 Referência do site atual

O site oficial atual de Carlos Búrigo é uma referência importante para:

- reconhecimento visual;
- logo existente;
- fotografia;
- relação entre nome e identidade;
- elementos que já fazem parte da percepção pública da marca.

**Regra:** antes de substituir um ativo visual existente, verificar se ele é um ativo oficial que deve ser preservado.

Não recriar uma logo do zero se o ativo original estiver disponível e for adequado para uso digital.

---

# 5. Logo e assinatura

## 5.1 Fonte da verdade

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

## 5.2 Regras

Não:

- distorcer proporções;
- alterar arbitrariamente as cores;
- adicionar sombras;
- aplicar gradientes não previstos;
- colocar efeitos de vidro;
- usar a logo como elemento decorativo excessivo.

## 5.3 Relação Carlos Búrigo × MDB

A apresentação deve deixar clara a diferença entre:

**identidade pessoal/institucional**  
e  
**identidade partidária**.

A marca do MDB não deve substituir a identidade do parlamentar.

Da mesma forma, a identidade de Carlos Búrigo não deve ser apresentada como se fosse a identidade oficial do MDB.

---

# 6. Sistema de cores

## 6.1 Princípio

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

## 6.2 Contraste

Não usar cinza claro como texto normal sobre fundo branco.

Texto secundário continua sendo **texto de conteúdo** e precisa permanecer claramente legível.

Regra prática do projeto:

- texto normal: contraste mínimo WCAG AA;
- texto grande: contraste mínimo WCAG AA aplicável;
- elementos essenciais de interface: contraste verificável;
- foco: sempre visualmente evidente;
- estados não podem depender somente de cor.

Para conteúdo principal e informação pública, preferir contraste próximo de **7:1** quando a combinação visual permitir.

A referência brasileira eMAG recomenda pelo menos 4,5:1 para texto e descreve 7:1 como referência para alto contraste. citeturn0search0turn0search24

## 6.3 Regra MDB

O verde, amarelo e demais cores associadas ao MDB podem orientar a paleta, mas não devem ser simplesmente aplicados em todas as superfícies.

A identidade digital deve usar:

- cor de marca para ações e reconhecimento;
- neutros para leitura;
- cor de destaque com parcimônia;
- contraste suficiente entre texto e fundo.

## 6.4 Proibição

Não usar como padrão visual:

- gradientes decorativos;
- glassmorphism;
- `backdrop-blur`;
- fundos excessivamente escuros sem necessidade;
- texto verde sobre fundo verde;
- amarelo como texto pequeno;
- vermelho como cor genérica de destaque;
- cinza claro para texto essencial;
- texto pequeno para compensar excesso de conteúdo.

---

# 7. Tipografia e tamanho de texto

## 7.1 Princípio

**A fonte deve ser confortável, não apenas tecnicamente legível.**

Este projeto não deve repetir o padrão comum de PWAs em que o texto funciona no monitor do desenvolvedor, mas fica pequeno para pessoas mais velhas ou com baixa visão.

O tamanho tipográfico deve ser definido a partir do cidadão, especialmente no mobile.

## 7.2 Base mínima

Diretriz de produto:

- corpo principal: **16px como mínimo absoluto**;
- preferencial para leitura contínua: **17–18px**;
- textos auxiliares importantes: **14–16px**, evitando 12px;
- controles e botões: **16px ou maior**;
- labels essenciais: nunca usar tamanho que exija esforço visual;
- títulos devem ter escala clara e confortável.

Não reduzir fonte apenas para fazer mais conteúdo caber na tela.

## 7.3 Escala

Definir tokens:

- Display
- H1
- H2
- H3
- Body large
- Body
- Body small
- Caption
- Navigation
- Label
- Electoral number

A escala deve ser responsiva, mas não deve diminuir o corpo principal para tamanhos inadequados em telas pequenas.

## 7.4 Redimensionamento

O layout deve continuar funcional quando o usuário aumentar o tamanho do texto.

Não criar componentes que dependam de:

- altura fixa rígida;
- texto cortado;
- `overflow: hidden` para esconder conteúdo;
- largura insuficiente;
- truncamento de informações importantes.

O eMAG recomenda que o conteúdo permaneça funcional com redimensionamento de até 200%. citeturn0search0

---

# 8. Acessibilidade como requisito de produto

Acessibilidade não será tratada como uma camada final de QA.

Ela faz parte da arquitetura visual e funcional desde o início.

Meta mínima:

**WCAG 2.2 AA**, sempre que aplicável.

O eMAG também deve ser usado como referência brasileira de acessibilidade digital. citeturn0search1

## Requisitos prioritários

- contraste;
- tamanho confortável de fonte;
- redimensionamento;
- foco visível;
- teclado;
- texto alternativo;
- labels;
- tamanho de toque;
- leitura por tecnologia assistiva;
- ordem semântica;
- navegação previsível;
- redução de dependência de cor;
- mensagens de erro compreensíveis;
- formulários acessíveis;
- links identificáveis;
- headings semânticos.

## Controle de acessibilidade

O produto deve considerar uma área acessível para:

- aumentar tamanho do texto;
- retornar ao tamanho padrão;
- alto contraste, quando implementado;
- acessar informações sobre acessibilidade;
- saltar para conteúdo principal.

O eMAG documenta recursos como aumento/redução de fonte, tamanho normal, alto contraste e atalhos de navegação como padrões históricos de acessibilidade para portais públicos. citeturn0search25turn0search6

---

# 9. Comunicação com o cidadão

## 9.1 Princípio

**Fale com o gabinete não é uma página secundária.**

É uma função central do portal.

O cidadão deve conseguir encontrar rapidamente um canal para:

- apresentar uma demanda;
- solicitar informação;
- enviar sugestão;
- relatar uma necessidade;
- encaminhar uma manifestação;
- entrar em contato com o gabinete.

## 9.2 CTA permanente

O produto deve possuir um mecanismo de contato de alta visibilidade.

### Proposta

Um **botão flutuante de comunicação**:

**Fale com o Gabinete**

ou, conforme o contexto da página:

**Fale com o Deputado**

O botão deve:

- ter texto, não apenas ícone;
- possuir alto contraste;
- permanecer acessível no mobile;
- respeitar a área segura inferior;
- não cobrir conteúdo;
- não competir visualmente com a navegação principal;
- abrir um fluxo simples de demanda.

## 9.3 Fluxo

O fluxo de comunicação deve ser curto:

1. escolha do assunto;
2. mensagem;
3. identificação mínima necessária;
4. canal de retorno;
5. confirmação.

Não transformar o cidadão em operador de um sistema interno de gabinete.

## 9.4 Linguagem

Usar linguagem simples.

Evitar:

- termos administrativos sem explicação;
- campos desnecessários;
- formulários longos;
- jargão parlamentar;
- telas intermediárias sem função.

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
- Transparência
- Contato

O CTA **Fale com o Gabinete** não deve depender da barra inferior para ser encontrado.

## 10.3 Regras visuais

A barra:

- deve ser sólida;
- não deve depender de `backdrop-blur`;
- deve ter contraste claro;
- deve mostrar o item ativo;
- deve respeitar área segura do aparelho;
- deve ter alvos de toque de pelo menos 44px;
- não deve usar texto minúsculo.

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
7. Como o cidadão pode acompanhar?
8. Como o cidadão pode falar com o gabinete?

## 11.2 Estrutura proposta

1. Header
2. Hero institucional
3. Trajetória resumida
4. Atuação Parlamentar
5. Principais pautas
6. Resultados documentados
7. Transparência
8. Agenda
9. Notícias
10. Vídeos
11. Fale com o Gabinete
12. Footer

## 11.3 Hero

O Hero deve priorizar:

- nome Carlos Búrigo;
- função atual;
- fotografia/identidade;
- mensagem institucional factual;
- CTA principal para atuação;
- CTA para trajetória;
- acesso evidente ao contato.

No modo eleitoral, pode incorporar o número eleitoral com destaque.

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

# 13. Transparência e acesso público

O portal deve distinguir **conteúdo institucional**, **transparência pública** e **conteúdo administrativo interno**.

## 13.1 Deve ser público quando houver finalidade cidadã

Exemplos:

- proposições;
- votações;
- presença e atividade parlamentar quando disponíveis publicamente;
- comissões;
- discursos;
- relatórios;
- atos públicos;
- documentos legislativos;
- prestação de contas e informações de transparência aplicáveis;
- agenda pública;
- resultados documentados;
- notícias;
- vídeos;
- canais oficiais de contato.

## 13.2 Não expor como conteúdo público

Não transformar o portal em depósito de:

- documentos internos de gabinete;
- informações pessoais desnecessárias;
- dados pessoais de terceiros;
- credenciais;
- documentos operacionais sem finalidade pública;
- rascunhos internos;
- informações protegidas por legislação;
- arquivos administrativos que não tenham finalidade de transparência.

## 13.3 Princípio

**Transparência não significa publicar tudo.**

Significa publicar aquilo que é relevante para controle, informação e participação do cidadão, respeitando privacidade, segurança e legislação.

Antes de disponibilizar um documento, verificar:

1. ele tem finalidade pública?
2. existe obrigação ou fundamento para divulgação?
3. contém dados pessoais que não precisam estar expostos?
4. existe uma versão pública adequada?
5. o cidadão entende o que está acessando?

---

# 14. Pautas

A seção de pautas só deve ser criada depois de uma auditoria factual.

Cada pauta deve responder:

- qual é o tema;
- qual é a atuação concreta;
- qual é o período;
- qual documento ou proposição comprova;
- qual o contexto territorial, quando aplicável.

Evitar slogans vagos apresentados como fatos.

---

# 15. Resultados

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

# 16. Notícias, vídeos e documentos

Esses conteúdos são importantes, mas são **camadas do portal**, não a identidade do portal.

### Notícias

Representam atividade recente.

### Vídeos

Representam comunicação audiovisual.

### Documentos

Representam transparência e acervo.

Nenhum deles deve dominar a Home a ponto de esconder a identidade e a atuação parlamentar.

---

# 17. SEO

SEO será tratado como parte da arquitetura institucional.

## 17.1 Princípios

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

## 17.2 Hub semântico

A Home deve distribuir autoridade e contexto para:

- /sobre
- /trajetoria
- /atuacao
- /proposicoes
- /votacoes
- /comissoes
- /resultados
- /transparencia
- /noticias
- /agenda
- /municipios
- /videos
- /documentos
- /contato

Não criar rotas que dupliquem dados existentes.

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
- body-large
- body
- body-small
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
2. Accessibility controls
3. Hero
4. Typography
5. Buttons
6. Cards
7. Timeline
8. Section headers
9. News cards
10. Agenda
11. Parliamentary activity
12. Transparency
13. Citizen contact / floating CTA
14. Mobile navigation
15. Footer
16. Electoral number block
17. PWA icons

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
- usar fonte pequena para caber mais conteúdo;
- usar cinza claro para texto essencial;
- esconder o contato com o gabinete em menus profundos;
- transformar o portal em ferramenta interna de gabinete;
- publicar documentos internos ou dados pessoais sem finalidade pública;
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
- [ ] definir escala tipográfica acessível;
- [ ] definir tratamento fotográfico;
- [ ] definir composição do número eleitoral;
- [ ] fechar Brand Book.

## Fase B — Acessibilidade e Design Tokens

- [ ] transformar decisões em tokens CSS;
- [ ] remover tokens antigos conflitantes;
- [ ] corrigir contraste;
- [ ] remover glassmorphism;
- [ ] revisar tipografia;
- [ ] revisar estados de foco/hover;
- [ ] validar redimensionamento;
- [ ] validar navegação por teclado;
- [ ] validar leitores de tela;
- [ ] criar controles de acessibilidade.

## Fase C — Navegação e componentes

- [ ] Header;
- [ ] mobile navigation com 4 itens;
- [ ] CTA flutuante Fale com o Gabinete;
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
- [ ] Transparência;
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

## Acessibilidade

eMAG — Modelo de Acessibilidade em Governo Eletrônico:

https://emag.governoeletronico.gov.br/

O eMAG é a referência brasileira adicional para decisões de acessibilidade digital. citeturn0search0turn0search1

---

# 26. Registro de decisões

| Data | Decisão | Estado |
|---|---|---|
| 2026-09-18 | Este arquivo passa a ser a fonte de verdade da identidade digital | CANÔNICA |
| 2026-09-18 | Home deve ser portal institucional, não arquivo | CANÔNICA |
| 2026-09-18 | Trajetória deve existir como eixo estrutural | CANÔNICA |
| 2026-09-18 | O produto é desenhado prioritariamente para cidadãos, não para gabinete | CANÔNICA |
| 2026-09-18 | Mobile e acessibilidade são requisitos centrais, não adaptações posteriores | CANÔNICA |
| 2026-09-18 | Corpo principal deve ter no mínimo 16px; preferência 17–18px | CANÔNICA |
| 2026-09-18 | Contraste deve priorizar legibilidade, evitando texto cinza claro sobre branco | CANÔNICA |
| 2026-09-18 | Fale com o Gabinete deve ser um CTA de alta visibilidade | CANÔNICA |
| 2026-09-18 | Deve existir CTA flutuante de comunicação sem cobrir conteúdo | PROPOSTA CANÔNICA |
| 2026-09-18 | Transparência deve priorizar informação pública relevante sem expor dados internos desnecessários | CANÔNICA |
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
