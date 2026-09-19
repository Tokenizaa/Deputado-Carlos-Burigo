# Fase 10 — Navegação definitiva do Sistema de Gestão do Gabinete

**Data:** 2026-09-18  
**Status:** IMPLEMENTAÇÃO CONCLUÍDA

## Objetivo

Organizar a navegação interna pela lógica de trabalho do gabinete, sem recriar os módulos ou fontes de dados existentes.

## Navegação canônica

```
GABINETE
├── Início
├── Atendimento
├── Agenda
├── Mandato
├── Conteúdo
├── Tarefas
├── Equipe
└── Configurações
```

## Mapeamento

- **Início:** Central operacional da Fase 9.
- **Atendimento:** módulo existente de demandas.
- **Agenda:** módulo existente de compromissos.
- **Mandato:** resultados e municípios, usando as fontes existentes.
- **Conteúdo:** páginas, notícias, conteúdo institucional, vídeos e mídia.
- **Tarefas:** visão operacional sobre a tabela `tasks`; não cria outra entidade.
- **Equipe:** usuários e auditoria.
- **Configurações:** configurações existentes.
- O Page Builder continua como infraestrutura de páginas, não como eixo da navegação.

## Compatibilidade

Os IDs internos dos módulos existentes foram preservados quando possível para reduzir risco. A mudança principal é de nomenclatura e agrupamento da navegação.

## Regra

Não criar novos CMS, CRM, agenda, banco legislativo, fonte de verdade ou módulos paralelos para resolver necessidades já atendidas pela estrutura existente.
