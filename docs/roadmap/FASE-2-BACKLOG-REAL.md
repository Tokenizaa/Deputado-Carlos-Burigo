# FASE 2 — BACKLOG REAL

**Data:** 21/09/2026  
**Base:** Fase 1 — Auditoria Geral do Estado Congelado  
**Branch:** `main`  
**Regra:** esta fase organiza o trabalho; não implementa correções.

## 1. Objetivo

Transformar os achados comprovados da Fase 1 em uma única fila de execução, sem reabrir fases históricas e sem criar funcionalidades especulativas.

A prioridade abaixo é operacional: primeiro remover incertezas que impedem validar o sistema; depois validar segurança e fluxos reais; por último tratar melhorias de performance e qualidade.

## 2. Regras

- Nenhuma correção é implementada nesta fase.
- Nenhum schema é alterado nesta fase.
- Nenhuma policy é alterada apenas por estética.
- Nenhuma fase histórica é reaberta.
- Cada item precisa de critério objetivo de aceite.
- Correções de segurança devem ser validadas antes de serem marcadas como concluídas.
- Achados de performance só entram em implementação quando houver evidência de benefício ou risco real.

## 3. Backlog único

| ID | Prioridade | Área | Problema | Ação | Dependência | Critério de aceite |
|---|---|---|---|---|---|---|
| B2-01 | P0 | Build | Build/typecheck não foram validados no ciclo atual | Executar instalação, lint/typecheck e build em ambiente funcional | Ambiente com acesso às dependências | `npm run lint` e `npm run build` passam sem erro |
| B2-02 | P0 | Produção | HTTP do Worker não foi validado na auditoria | Executar smoke test real do domínio de produção e APIs essenciais | B2-01 | Home, health, API pública e autenticação respondem conforme esperado |
| B2-03 | P0 | Auth/Security | Proteção contra senhas comprometidas está desabilitada | Revisar configuração atual do Auth e habilitar a proteção, se compatível com o fluxo | Verificação da configuração atual | Configuração documentada e advisor sem esse alerta |
| B2-04 | P0 | RLS | `admin_bootstrap` está com RLS e nenhuma policy | Determinar se acesso direto deve continuar fechado; revisar grants e uso real | Inspeção do código que acessa a tabela | A tabela fica deliberadamente fechada ou possui policy mínima justificada; acesso não autorizado é impossível |
| B2-05 | P0 | RBAC | Permissões existem no código, mas não foram testadas por papel | Criar matriz de testes para ADMIN, EDITOR, COMUNICACAO, ATENDIMENTO e VISUALIZADOR | B2-01/B2-02 | Cada combinação crítica permitido/negado produz o resultado esperado |
| B2-06 | P1 | APIs | Rotas existem, mas o comportamento ponta a ponta não foi validado | Smoke/integration test das APIs públicas e administrativas | B2-01/B2-02 | Rotas críticas retornam status, payload e autorização esperados |
| B2-07 | P1 | Cidadão | Fluxo cidadão → demanda → equipe não foi validado integralmente | Executar cenário real com isolamento entre usuários | B2-05/B2-06 | Cidadão só acessa suas demandas; equipe acessa conforme papel; histórico/mensagens permanecem isolados |
| B2-08 | P1 | CMS | CMS → publicação → leitura pública não foi validado | Executar criação/edição/publicação/rollback e leitura pública | B2-05/B2-06 | Alteração publicada aparece no público e rollback restaura a versão anterior |
| B2-09 | P1 | Documentos | Upload, permissões, publicação e leitura pública não foram validados | Testar documento/evidência do upload à exposição pública | B2-02/B2-05 | Arquivos e metadados obedecem visibilidade e autorização |
| B2-10 | P1 | Mídia | Upload/ingestão e leitura não foram exercitados | Testar upload administrativo, storage, registro e consumo público | B2-05/B2-06 | Upload cria registro correto, arquivo é acessível conforme política e não há exposição indevida |
| B2-11 | P1 | Equipe | Convite, aprovação e bootstrap ADMIN não foram validados em produção | Executar fluxo operacional controlado | B2-02/B2-05 | Convite, aceite, atribuição de papel e auditoria funcionam sem bypass |
| B2-12 | P1 | Conteúdo/Config | Persistência existe, mas publicação/alteração real não foi validada | Testar configurações e conteúdo canônicos ponta a ponta | B2-02/B2-05 | Alterações persistem no Supabase e refletem no público/área correta |
| B2-13 | P1 | Acessibilidade | Suporte existe, mas não houve auditoria real | Rodar inspeção automatizada + revisão manual das superfícies principais | B2-01 | Problemas críticos documentados e correções priorizadas |
| B2-14 | P1 | Responsividade | Não houve validação visual sistemática | Validar viewport mobile, tablet e desktop das superfícies principais | B2-02 | Não há quebra funcional ou de navegação nos viewports definidos |
| B2-15 | P2 | RLS/Performance | Policies permissivas múltiplas foram detectadas | Mapear políticas por tabela e verificar se combinações são intencionais | B2-05 | Cada policy tem finalidade documentada; nenhuma permissão excessiva permanece sem justificativa |
| B2-16 | P2 | Performance DB | 18 FKs sem índice cobrindo coluna e 12 índices não utilizados | Medir consultas reais e decidir caso a caso | B2-06/B2-07 | Somente índices comprovadamente necessários são criados/removidos, com evidência |
| B2-17 | P2 | Observabilidade | Não há validação consolidada do comportamento em produção | Definir smoke checks e evidências mínimas de produção | B2-02 | Existe procedimento repetível para validar deploy sem depender de inspeção manual dispersa |
| B2-18 | P2 | Testes | Não há workflow `.github` detectado e não houve E2E validado | Decidir pipeline mínimo de validação após conhecer os testes existentes | B2-01/B2-06 | Existe comando reproduzível para validar o conjunto crítico antes do checkpoint |

## 4. Ordem de execução

### Bloco A — destravar validação

1. B2-01 — Build/typecheck
2. B2-02 — Smoke de produção

### Bloco B — segurança e autorização

3. B2-03 — Auth/password protection
4. B2-04 — admin_bootstrap/RLS
5. B2-05 — RBAC

### Bloco C — fluxos reais

6. B2-06 — APIs
7. B2-07 — Cidadão/demandas
8. B2-08 — CMS/publicação
9. B2-09 — Documentos/evidências
10. B2-10 — Mídia
11. B2-11 — Equipe
12. B2-12 — Conteúdo/configurações

### Bloco D — qualidade

13. B2-13 — Acessibilidade
14. B2-14 — Responsividade

### Bloco E — otimização e processo

15. B2-15 — revisão de policies
16. B2-16 — índices
17. B2-17 — observabilidade
18. B2-18 — pipeline/testes

## 5. O que não entra no backlog

Não foram identificados motivos para:

- trocar Supabase;
- trocar Cloudflare;
- criar banco paralelo;
- criar CMS paralelo;
- reconstruir o frontend;
- reabrir fases históricas apenas por numeração;
- criar funcionalidades novas sem demanda comprovada;
- remover índices ou policies somente porque advisors os classificaram como não utilizados/múltiplos.

## 6. Fonte de verdade

A fila acima deriva exclusivamente de:

- `docs/roadmap/FASE-1-AUDITORIA-GERAL.md`;
- código presente em `main`;
- configuração do Worker;
- schema/migrations do Supabase;
- policies/RLS reais;
- advisors reais do Supabase.

## 7. Critério de encerramento da Fase 2

- [x] todos os achados da Fase 1 convertidos em itens;
- [x] duplicidades removidas;
- [x] prioridades definidas;
- [x] dependências registradas;
- [x] critérios de aceite definidos;
- [x] itens especulativos excluídos;
- [x] nenhuma implementação funcional realizada.

**Próximo checkpoint:** Fase 3 será definida a partir deste backlog, começando pelo primeiro bloco executável, sem criar uma nova numeração paralela.
