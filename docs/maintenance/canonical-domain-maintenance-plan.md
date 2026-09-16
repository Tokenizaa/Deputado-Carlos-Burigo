# Plano de manutenção — canonização dos domínios

**Projeto:** `Tokenizaa/Deputado-Carlos-Burigo`  
**Data:** 2026-09-16  
**Estado:** Plano aprovado para execução sequencial

## Objetivo

Alinhar banco Supabase, backend/API, contratos e frontend em torno dos domínios já existentes, sem recomeçar o projeto, sem substituir a arquitetura e sem criar uma segunda fonte de verdade.

O Supabase permanece como fonte de verdade dos dados persistidos. O backend será a fronteira de tradução entre o schema do banco e contratos consumidos pelo frontend.

## Regras de execução

1. Não recriar funcionalidades existentes.
2. Não criar uma segunda arquitetura.
3. Não substituir o banco sem evidência técnica que exija isso.
4. Não criar mocks quando existir infraestrutura real.
5. Não alterar o schema durante a primeira rodada de canonização sem necessidade comprovada.
6. Cada alteração de código ou documentação deve terminar em commit próprio.
7. Cada fase deve ser auditada, implementada, validada e registrada antes da próxima.
8. O frontend não deve conhecer detalhes do schema do Supabase.
9. APIs públicas devem expor contratos canônicos e não duplicar nomes snake_case/camelCase.
10. Uma entidade não deve possuir duas fontes concorrentes sem uma relação explícita de projeção/read model.

## Domínios canônicos em avaliação

### 1. Identidade / Administração

- `profiles`
- `user_roles`
- `audit_logs`
- `site_settings`

### 2. Atuação Legislativa

- `legislative_items`
- `legislative_events`
- `legislative_votes`
- `legislative_roles`

### 3. Acervo Documental

- `documents`
- `evidence`
- `media`
- `videos`

### 4. Comunicação Pública

- `news`
- `events`
- `pages`
- `page_blocks`
- `page_versions`

### 5. Território

- `municipalities`

### 6. Cidadão

- `demands`
- `demand_messages`
- `demand_history`

## Fases

### Fase 0 — Baseline

Registrar o estado exato do repositório e do Supabase antes da manutenção.

Entregas:

- SHA do `main` usado como baseline.
- migrations presentes.
- tabelas e contagens atuais.
- estado dos advisors de segurança.
- APIs e contratos existentes.
- registro de lacunas sem alteração funcional.

### Fase 1 — Mapa dos domínios

Relacionar cada tabela, API, mapper e tela ao domínio responsável.

### Fase 2 — Duplicidades e fontes concorrentes

Identificar entidades representadas por mais de uma tabela, endpoint ou modelo. O primeiro caso conhecido é `projects` em relação a `legislative_items`.

### Fase 3 — Contratos Backend → Frontend

Padronizar DTOs e eliminar contratos que retornem simultaneamente nomes snake_case e camelCase.

### Fase 4 — Camada mínima de contratos/mappers

Centralizar tradução Supabase → DTO sem criar framework ou abstração excessiva.

### Fase 5 — Redução do AppContext

Retirar gradualmente do `AppContext` responsabilidades de acesso direto a todos os domínios, mantendo nele apenas estado realmente global/orquestração.

### Fase 6 — Canonização Legislativa

Alinhar `legislative_items`, eventos, votos e papéis com as APIs e telas públicas/admin.

### Fase 7 — Canonização de Comunicação Pública

Alinhar notícias, agenda e Page Builder com as tabelas efetivamente usadas como fonte de verdade.

### Fase 8 — Canonização do Acervo

Alinhar documentos, evidências, mídia e vídeos, incluindo proveniência.

### Fase 9 — Canonização do Cidadão

Alinhar demandas, mensagens e histórico.

### Fase 10 — Dashboard

Fazer o dashboard consumir os domínios já canonizados, sem criar um domínio paralelo de dashboard.

### Fase 11 — Auditoria de nomenclatura

Pesquisar termos concorrentes e consolidar nomes canônicos por domínio.

### Fase 12 — Validação cruzada

Validar o fluxo `Supabase → API → frontend público → dashboard` para cada domínio.

### Fase 13 — Integridade final

Executar testes de consistência, incluindo casos com dados reais e estados vazios legítimos.

## Critério de passagem entre fases

Uma fase só termina quando:

- o problema foi identificado com evidência;
- a alteração necessária foi feita, quando aplicável;
- a implementação foi validada;
- não existem mudanças paralelas não documentadas;
- o resultado foi commitado;
- o SHA do commit foi registrado no acompanhamento da manutenção.

## Primeiro foco técnico

Depois do baseline, investigar e resolver a relação entre:

```text
projects
    ↕
legislative_items
```

Antes de qualquer mudança, confirmar no schema e no código se `projects` é entidade independente ou projeção de `legislative_items`. Não assumir a resposta apenas pelo nome da tabela.

## Resultado esperado

```text
Supabase — fonte de verdade
        ↓
Backend / adapters / mappers
        ↓
Contratos canônicos
        ↓
Frontend público + Dashboard
```

O objetivo é ter uma única linguagem por domínio, sem duplicação de entidades, sem vazamento do schema do banco para a UI e sem perda dos dados reais já catalogados.
