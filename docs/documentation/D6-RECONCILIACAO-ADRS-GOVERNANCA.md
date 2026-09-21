# D6 — RECONCILIAÇÃO DE ADRs E GOVERNANÇA

**Status:** CONCLUÍDO
**Data:** 21/09/2026

## Objetivo

Reconciliar os documentos de decisão arquitetural e a governança de agentes com a arquitetura efetivamente existente em main.

## ADRs

### ADR 0001 — Fonte canônica legislativa

Permanece **Accepted**.

A decisão de usar public.legislative_items como fonte canônica do domínio legislativo público continua compatível com a migration de canonização e com a ausência de public.projects como fonte operacional.

Tipos ou referências históricas remanescentes não reabrem a decisão nem autorizam uma segunda fonte de dados.

### ADR 0002 — Cloudflare Workers

Permanece **Accepted**.

O runtime de produção continua sendo Cloudflare Workers. A documentação de governança foi alinhada para não tratar Vercel Functions ou uma camada api/ paralela como arquitetura atual.

### ADR 0003 — Proteção de autenticação e senhas

Permanece **Accepted — implementação parcial concluída; melhorias adicionais futuras**.

A política centralizada de senha continua concluída no escopo do commit registrado. Os mecanismos adicionais permanecem dependentes de auditoria e validação objetiva.

## Governança — AGENTS.md

A versão anterior de AGENTS.md continha uma topologia de agentes e escopos baseados em caminhos que não correspondem à arquitetura atual, incluindo referências a api/*.ts, agentes de domínio rígidos e dependências circulares entre agentes.

A nova versão:
- trata AGENTS.md como governança, não como fonte de estado funcional;
- registra React/Vite + Cloudflare Workers + Supabase como arquitetura atual;
- elimina escopos de arquivos que não representam a estrutura atual;
- mantém regras de segurança e não duplicação;
- preserva a topologia antiga apenas como histórico Git;
- permite atuação transversal quando a implementação exigir;
- mantém a sequência do roadmap exclusivamente no documento canônico.

## Regra resultante

ADR decide arquitetura.
AGENTS define governança de trabalho.
Matriz de estado registra o estado reconciliado.
Roadmap define a sequência operacional.

Nenhum desses documentos substitui evidência de código, banco/configuração ou validação.

## Evidências

- AGENTS.md reconciliado em D6.
- docs/adr/0001-canonical-single-source-public-platform.md.
- docs/adr/0002-cloudflare-workers-production-runtime.md.
- docs/adr/0003-auth-password-protection-enhancements.md.
- docs/documentation/MATRIZ-ESTADO-REAL.md.
- docs/roadmap/ROADMAP-CANONICO.md.

## Próxima etapa

**D7 — validação documental final.**
