# Fase 14 — Auditoria final de acessibilidade

**Status:** CONCLUÍDA COM CORREÇÕES ESTÁTICAS  
**Data:** 2026-09-18

## Escopo

Auditoria final do código público e dos fluxos estruturais do portal, com foco em:

- teclado e foco;
- skip link;
- navegação principal;
- controles de acessibilidade;
- formulários;
- tamanho de interação;
- zoom/redimensionamento;
- redução de movimento;
- contraste estrutural;
- navegação mobile;
- PWA/offline;
- atualização de metadata durante navegação SPA.

## Achados e correções

### 1. Skip link e âncora do menu

O skip link foi reposicionado antes do header para aparecer no início da ordem de foco. A navegação principal recebeu o identificador `menu-principal`, usado pelo atalho de acessibilidade.

### 2. Estado de carregamento

O carregamento institucional recebeu `role="status"` e `aria-live="polite"`, permitindo comunicação adequada do estado para tecnologias assistivas.

### 3. Metadata em navegação SPA

O componente SEO passou a reagir à mudança de `currentView`. Isso evita que título, descrição e canonical permaneçam presos à primeira rota carregada quando a navegação ocorre sem recarregamento completo.

### 4. Foco e interação

A base global mantém foco visível de 3px, controles de formulário com altura mínima de 44px e navegação mobile com quatro destinos.

### 5. Texto e redimensionamento

O corpo base permanece em 16px, com escalas de acessibilidade de 112,5% e 125%. A implementação evita altura rígida no conteúdo principal e mantém `text-size-adjust: 100%`.

### 6. Movimento

`prefers-reduced-motion: reduce` neutraliza animações/transições não essenciais.

### 7. Formulário de contato

Os campos possuem labels visíveis e os controles de formulário herdam tamanho tipográfico do documento. O consentimento LGPD usa checkbox nativo associado ao texto do label.

## Resultado

A auditoria estática não encontrou regressão estrutural nos requisitos centrais já implementados.

### Limitação

A validação de leitor de tela real, contraste medido pixel a pixel, zoom físico a 200% em múltiplos navegadores e teste em dispositivos físicos requerem execução em navegador/dispositivo. O ambiente GitHub disponível nesta execução não expôs uma ferramenta de browser local para concluir esses testes instrumentados.

Esses pontos ficam explicitamente registrados como **validação manual pendente**, não como falsamente aprovados.

## Critério

- [x] auditoria estrutural realizada;
- [x] correções encontradas aplicadas;
- [x] skip link;
- [x] foco;
- [x] teclado estrutural;
- [x] formulários;
- [x] interação mobile;
- [x] reduced motion;
- [x] redimensionamento;
- [x] SEO reativo em SPA;
- [ ] leitor de tela real;
- [ ] contraste instrumental;
- [ ] zoom 200% em browser real;
- [ ] teste em dispositivos físicos.
