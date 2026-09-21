# AUDITORIA DE HORIZONTE DO ROADMAP

**Data:** 21/09/2026  
**Objetivo:** identificar o que realmente falta no roadmap sem abrir novas implementações nem prolongar a Fase 13.

## Conclusão executiva

A Fase 13 não deve continuar sendo expandida. A arquitetura de Conteúdo/Configurações já foi reconstruída e o primeiro controle persistente já existe em produção.

A partir desta auditoria, o trabalho deve voltar para as lacunas concretas do roadmap.

## Estado geral

| Fase | Estado auditado | Ação |
|---|---|---|
| 1–12 | concluídas conforme roadmap histórico | não reabrir |
| 13.1–13.7 | concluídas como ciclo arquitetural; 13.7 tem somente validação HTTP externa pendente | não criar 13.8 agora |
| 14 | não há artefato/execução identificável no roadmap atual | não inventar fase |
| 15 | concluída | não reabrir |
| 16 | não há artefato/execução identificável no roadmap atual | não inventar fase |
| 17 | baseline concluído | concluída |
| 18 | Dashboard operacional concluído | concluída |
| 19 | editor/Page Builder visual implementado; documentação registra validação final pendente | validar somente se houver necessidade operacional |
| 20 | Auth/RBAC implementado; build/testes finais pendentes segundo documento | validar |
| 21 | convites/aprovação implementados; build/lint final pendente | validar |
| 22 | RBAC por ação implementado; build/lint pendentes | validar |
| 23 | Notícias/Agenda canonizadas; build/lint pendentes | validar |
| 24 | Resultados/Municípios canonizados; build/lint pendentes | validar |
| 25 | Vídeos concluídos; Mídia explicitamente pendente de upload/ingestão real | implementar somente fluxo real de mídia |
| 26 | Documentos/Evidências concluídos na camada pública | não criar CRUD artificial |
| 27 | não há artefato/execução identificável no roadmap atual | não inventar fase |
| 28 | Conta do cidadão/demandas implementada; build final pendente | validar |
| 29 | bootstrap do primeiro ADMIN implementado; ativação operacional depende do cadastro real inicial | concluir operação quando necessário |
| 30 | fases 1–4 do editor visual concluídas; fase 5 de validação pendente | validar |
| 31 | Mandatos/visibilidade documental implementados; validação funcional descrita como pendente | validar |

## O que realmente está aberto

### 1. Bloco de validação técnica

Existe um conjunto de fases já implementadas que ainda carregam a mesma pendência documental de build/testes:

- 19
- 20
- 21
- 22
- 23
- 24
- 28
- 30
- 31

Isso não significa nove novas implementações. É uma fila de validação.

### 2. Mídia

A Fase 25 deixou uma lacuna legítima: `public.media` exige metadados e armazenamento real, enquanto a interface não possui fluxo completo de upload/ingestão.

Não devemos criar endpoint artificial apenas para marcar a fase como concluída.

### 3. Primeiro administrador

A Fase 29 possui implementação real, mas a própria documentação deixa uma etapa operacional: garantir que o ambiente não esteja preso aos usuários antigos e realizar o primeiro cadastro ADMIN real pelo fluxo `/primeiro-acesso`.

Isso é operação de bootstrap, não uma nova arquitetura.

### 4. Fase 13.7

A única pendência é validação HTTP externa do Worker. Não justifica criar novas subfases de Configurações.

## O que não deve ser feito

- criar Fase 13.8 apenas para continuar a arquitetura;
- inventar novos toggles de Configurações;
- criar CRUD administrativo para documentos/evidências sem necessidade real;
- criar segunda arquitetura de CMS;
- criar nova fonte de dados;
- criar fases 14, 16 ou 27 sem recuperar um requisito real que as justifique;
- reabrir fases concluídas somente por ausência de teste externo.

## Próxima ordem de trabalho

1. **Validação consolidada** das fases implementadas que ainda têm build/testes pendentes.
2. **Mídia**, somente se o fluxo real de upload/ingestão for necessário.
3. **Bootstrap do primeiro ADMIN**, quando o ambiente estiver pronto para o cadastro real.
4. **Validação final do editor visual e Mandatos.**
5. Somente depois disso, abrir uma nova fase baseada em uma necessidade funcional real.

## Decisão

O roadmap deve deixar de ser tratado como uma sequência infinita de microfases.

A partir deste ponto, cada fase nova só será criada quando houver:
- problema concreto;
- consumidor real;
- fonte de dados real;
- persistência necessária;
- regra de autorização;
- critério objetivo de conclusão.

O próximo trabalho recomendado é uma **validação consolidada das fases 19–31**, e não uma nova expansão da Fase 13.