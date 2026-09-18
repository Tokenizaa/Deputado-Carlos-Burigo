# Fase 3 — Acessibilidade estrutural

**Data:** 2026-09-18  
**Base:** `main`  
**Objetivo:** estabelecer a camada estrutural de acessibilidade antes da reconstrução da navegação e da Home.

## Implementado

### 1. Pular para o conteúdo

Foi adicionado:

- link de skip para `#conteudo-principal`;
- foco visível;
- conteúdo principal com destino estável.

Isso atende à necessidade de permitir acesso direto ao conteúdo para quem navega por teclado. O eMAG recomenda âncoras para conteúdo e menu e uma ordem lógica de leitura/tabulação. citeturn0search0turn0search3

### 2. Barra de acessibilidade

Criada `AccessibilityBar` com:

- Conteúdo;
- Menu;
- Aumentar fonte;
- Normal;
- Texto grande;
- Alto contraste;
- página de Acessibilidade.

As preferências de fonte/contraste são persistidas no navegador.

### 3. Página pública de acessibilidade

Criada:

`/acessibilidade`

com documentação dos recursos disponíveis, navegação por teclado e critérios de validação futura.

### 4. Tamanho do texto

Foram adicionados dois níveis de aumento:

- 112,5%;
- 125%.

O sistema mantém a escala normal como padrão e não depende de alterar manualmente cada componente.

### 5. Foco

Mantido foco global visível com:

- contorno de 3px;
- offset de 3px;
- cor de foco de alto contraste.

O eMAG recomenda que o foco seja visualmente evidente e que não seja removido. citeturn0search12

### 6. Alvos de toque

Controles de formulário e botões receberam altura mínima de 44px.

Links de texto não receberam uma altura global artificial para evitar deformar o layout; seus componentes deverão respeitar área de interação adequada quando forem revisados.

### 7. Estado de carregamento

O loading deixou de exibir o número eleitoral “15”.

Agora apresenta:

- indicador visual não textual;
- mensagem “Carregando o portal institucional...”;
- texto com tamanho acessível.

### 8. Motion

A política de `prefers-reduced-motion` criada na Fase 2 permanece ativa.

### 9. Rota

`/acessibilidade` foi registrada no mapa canônico de rotas e não pode ser confundida com páginas dinâmicas.

## Referência normativa

O eMAG recomenda:

- funções operáveis por teclado;
- foco não bloqueado;
- alternativas textuais para imagens informativas;
- contraste mínimo de 4,5:1;
- redimensionamento funcional até 200%;
- foco visualmente evidente;
- mecanismos para acesso direto ao conteúdo. citeturn0search0turn0search12

## Limitações desta fase

A Fase 3 é estrutural. Ainda não foi declarado que o portal inteiro está conforme.

Ficam para a auditoria final:

- teste real em 200%;
- jornada completa apenas por teclado;
- screen reader;
- contraste componente a componente;
- modais;
- formulários;
- imagens de todas as páginas;
- validação em 360/390/768/1024/1280/1440px.

Não há GitHub Actions configurado no repositório neste momento, portanto não foi possível usar uma execução automatizada para declarar build/E2E verde.

## Critério

- [x] skip link;
- [x] foco visível;
- [x] barra de acessibilidade;
- [x] controles de tamanho;
- [x] alto contraste inicial;
- [x] página pública de acessibilidade;
- [x] rota registrada;
- [x] loading sem número eleitoral;
- [x] documentação persistida.

**Estado: Fase 3 concluída.**

Próxima etapa: **Fase 4 — Navegação e shell do produto**.
