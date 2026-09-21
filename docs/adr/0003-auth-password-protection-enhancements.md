# ADR 0003: Proteção de autenticação e senhas

## Status

**Accepted — implementação parcial concluída; melhorias adicionais permanecem futuras**

## Data

2026-09-21

## Contexto

A plataforma possui autenticação administrativa e cidadã baseada em Supabase Auth. Durante a Fase 4 foi identificada a necessidade de reforçar a política de senha e, separadamente, avaliar mecanismos adicionais de proteção de autenticação.

## Implementação efetivamente realizada

O commit `ca6e172cad5d2024e9c956a346934d547e03d763` implementou uma política centralizada de senha em:

- `src/lib/passwordValidation.ts`;
- endpoint de bootstrap administrativo;
- endpoint de cadastro cidadão;
- `AdminBootstrapView`;
- `CitizenPortalView`.

A política atual exige:

- mínimo de 12 caracteres;
- pelo menos uma letra maiúscula;
- pelo menos uma letra minúscula;
- pelo menos um dígito;
- pelo menos um caractere especial.

O commit registra validação por lint e build.

**Estado:** CONCLUÍDO para esse escopo.

## Itens adicionais ainda não tratados como concluídos

Os seguintes itens não devem ser interpretados como implementados apenas por constarem neste ADR anterior:

- histórico de senhas;
- rate limiting específico de autenticação;
- bloqueio de conta;
- fluxo completo de recuperação de senha;
- verificação de e-mail;
- estratégia adicional de gerenciamento/revogação de sessão;
- monitoramento específico de tentativas de autenticação.

Cada item deverá ser auditado no código atual antes de ser classificado como PENDENTE ou NÃO VALIDADO.

## Decisão

Manter a política reforçada de senha centralizada e reutilizável.

Não introduzir mecanismos adicionais de autenticação sem evidência de requisito e sem validação do comportamento atual do Supabase Auth.

## Regra documental

Este ADR descreve decisões e estado da implementação relacionada à proteção de autenticação. O roadmap operacional fica exclusivamente em:

`docs/roadmap/ROADMAP-CANONICO.md`

## Evidência

- Commit: `ca6e172cad5d2024e9c956a346934d547e03d763`
- Implementação: `src/lib/passwordValidation.ts`
