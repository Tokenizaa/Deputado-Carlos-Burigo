# Candidate / Workspace Context — Inteligência Eleitoral

**Status:** CANÔNICO — Fase 9C

## Objetivo

Desacoplar o motor eleitoral de qualquer candidato específico sem introduzir uma arquitetura SaaS desnecessária.

## Contexto mínimo

```text
workspace_id
candidate_id
election_id
office_id
state
round
year
```

## Papéis

### Workspace

Representa o contexto autorizado do cliente/gabinete.

Contém, conceitualmente:

- identidade visual;
- candidato principal;
- candidatos comparáveis permitidos;
- eleições/escopos autorizados;
- permissões.

### Candidate

É uma entidade eleitoral reutilizável. Pode ser principal ou comparável conforme o contexto.

`competitor` não é tipo permanente de candidato. Competição é uma relação calculada dentro de um contexto.

### Election / Office

Definem o universo comparável. Não devem ser inferidos pela UI quando o runtime já os conhece.

## Regra de acesso

```
PLATFORM CAPABILITY
        ≠
WORKSPACE AUTHORIZATION
```

O motor pode ter capacidade de comparar A, B, C e D. O workspace pode estar autorizado somente a A, B e C.

A autorização deve ser aplicada antes da consulta e continuar protegida por RLS no Supabase.

## Estado atual

O modelo eleitoral/projeção existente ainda representa a publicação analítica por ano e candidato. A Fase 9 não deve inventar colunas `workspace_id` nas tabelas eleitorais apenas para satisfazer o contrato.

O contexto deve inicialmente ser resolvido na camada de aplicação/permissão e projetado para o runtime somente quando necessário.

Uma futura persistência explícita de workspaces/candidatos autorizados exige ADR e validação do modelo existente.

## Proibições

- `Carlos Búrigo` não pode ser constante do motor;
- número eleitoral não pode depender de nome de UI;
- não duplicar fatos eleitorais por workspace;
- não criar uma base eleitoral por cliente;
- não criar multi-tenancy completo nesta fase.

## Preparação para white label

Quando um segundo cliente existir:

```
Workspace A → candidato X
Workspace B → candidato Y
          ↓
     mesmo motor
          ↓
     mesmos intents
          ↓
     mesmos métodos
```

Somente contexto, autorização e identidade visual mudam.
