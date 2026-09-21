# Fase 13.5 — Reconstrução de Configurações

Status: concluída em 2026-09-21

## Objetivo

Reconstruir o módulo Configurações depois da limpeza de Conteúdo e do legado eleitoral da Fase 13.4.

## Estrutura

O módulo agora está organizado em cinco áreas operacionais:

1. Atendimento
2. Segurança e acesso
3. Privacidade
4. Logs e auditoria
5. Sistema

Também explicita a separação de Governança entre Configurações, Conteúdo e Equipe.

## O que foi removido

O painel não exibe mais modo campanha/mandato/institucional, dados eleitorais, contatos públicos, SEO ou conteúdo editorial.

## Princípio adotado

Não foram criados toggles ou parâmetros fictícios. Um controle somente deverá entrar em Configurações quando existir regra de negócio definida, consumidor real no sistema, persistência adequada, permissão compatível e auditoria da alteração quando aplicável.

## Estado atual

A interface apresenta o estado real já disponível: demandas pendentes, rastreamento de protocolos, sessão e papel do usuário, estrutura de permissões, existência da política pública e registros de public.audit_logs.

A configuração pública continua sendo carregada do Supabase sem reintroduzir o legado eleitoral no contrato frontend.

## Próximo passo

A Fase 13.6 deverá definir e implementar os primeiros controles comportamentais persistentes, somente depois de identificar cada regra real existente no código e no banco.
