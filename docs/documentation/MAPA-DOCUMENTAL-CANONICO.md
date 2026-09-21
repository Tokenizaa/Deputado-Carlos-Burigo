# MAPA DOCUMENTAL CANÔNICO

## Objetivo

Definir o conjunto mínimo de documentos que um agente deve consultar para compreender o estado atual do projeto sem percorrer o histórico inteiro.

## Núcleo operacional

| Ordem | Documento | Autoridade |
|---|---|---|
| 1 | docs/roadmap/ROADMAP-CANONICO.md | sequência operacional |
| 2 | docs/documentation/MATRIZ-ESTADO-REAL.md | estado reconciliado |
| 3 | docs/documentation/RECONCILIACAO-DOCUMENTAL.md | regras de reconciliação |
| 4 | docs/documentation/AUDITORIA-DOCUMENTAL-D0-D3.md | resultado da auditoria documental |
| 5 | docs/documentation/INVENTARIO-DOCUMENTAL-COMPLETO.md | inventário e classificação |
| 6 | docs/documentation/RECONSTRUCAO-DOCUMENTAL-LINHA-DO-TEMPO.md | contexto temporal |

## Documentos de decisão

Os ADRs continuam sendo autoridade para decisões arquiteturais específicas:

- docs/adr/0001-canonical-single-source-public-platform.md
- docs/adr/0002-cloudflare-workers-production-runtime.md
- docs/adr/0003-auth-password-protection-enhancements.md

Um ADR explica uma decisão arquitetural. Ele não substitui a matriz de estado nem o roadmap.

## Evidências

Auditorias, documentos de manutenção e relatórios de validação são evidências datadas. Eles devem ser consultados quando for necessário comprovar como uma decisão ou implementação chegou ao estado atual.

Eles não substituem o estado reconciliado.

## Documentos históricos

Documentos de fases antigas, backlogs e relatórios de execução continuam preservados. Sua função é rastreabilidade.

Eles não podem:

- reabrir automaticamente uma fase;
- definir a próxima fase;
- transformar uma implementação posterior em pendência;
- criar uma segunda arquitetura.

## Regra para novos documentos

Antes de criar um documento:

1. procurar o documento canônico correspondente;
2. verificar se a informação realmente não cabe nele;
3. evitar criar uma segunda fonte para o mesmo estado;
4. se for histórico, registrar a data e o escopo;
5. se alterar uma decisão arquitetural, criar ou atualizar um ADR;
6. se alterar o estado operacional, atualizar a matriz e o roadmap correspondentes.

## Fluxo

EVIDÊNCIA → ESTADO REAL → DOCUMENTAÇÃO CANÔNICA → ROADMAP → EXECUÇÃO

O ciclo retorna à evidência após cada execução.
