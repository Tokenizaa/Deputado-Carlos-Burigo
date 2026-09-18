# Fase 4 — Navegação e shell do produto

**Data:** 2026-09-18  
**Base:** `main`  
**Objetivo:** consolidar header, navegação, menu Mais, mobile e footer antes da reconstrução da Home.

## Implementado

### Header desktop
- Início, Trajetória, Atuação, Notícias e Agenda como navegação primária.
- Menu **Mais** para as demais áreas institucionais.
- CTA **Fale com o Gabinete** como ação de primeira classe.
- Consulta de protocolo preservada no shell desktop.
- Campanha 2026 removida do shell institucional.

### Menu Mais
Inclui:
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

### Mobile
- Navegação inferior reduzida a quatro itens: **Início, Atuação, Notícias e Mais**.
- Menu Mais abre as demais rotas.
- Área inferior respeita `safe-area-inset-bottom`.
- CTA de contato permanece visível no header.
- Não há `backdrop-blur` no shell.

### Semântica e teclado
- Links de navegação usam `a` com destinos reais.
- Estado ativo possui indicador textual/estrutural além da cor.
- Menu Mais usa `aria-haspopup`, `aria-expanded` e fechamento por Escape/clique externo.
- Alvos interativos principais mantêm área mínima adequada.

### Footer
- Navegação institucional consolidada.
- **Fale com o Gabinete** substitui a fragmentação entre contato/gabinete/atendimento.
- Acessibilidade e privacidade permanecem acessíveis.
- Campanha não faz parte da navegação institucional.

## Rotas
A rota `/transparencia` foi reservada no mapa canônico para permitir sua entrada no shell sem criar uma segunda arquitetura.

## Preservação
- Home não foi reconstruída.
- Supabase e fontes canônicas não foram substituídos.
- Runtime Cloudflare não foi alterado.
- Nenhuma nova arquitetura foi criada.

## Critério
- [x] desktop;
- [x] mobile;
- [x] menu Mais;
- [x] estado ativo;
- [x] footer;
- [x] teclado;
- [x] safe area;
- [x] shell sem glass/backdrop blur.

**Estado: Fase 4 concluída.**
