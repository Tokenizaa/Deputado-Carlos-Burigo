# Fase 9 — Interface da Inteligência Eleitoral

**Status:** CONTRATOS TÉCNICOS FORMALIZADOS — implementação iniciada em blocos  
**Base:** Fases 0–8 e runtime determinístico eleitoral já publicados  
**Última atualização:** 2026-10-08

## Objetivo

Transformar o motor determinístico eleitoral em uma interface profissional, com duas superfícies sobre a mesma inteligência:

```
RESULTADO ANALÍTICO
       ↓
PRESENTATION CONTRACT
       ├── Dashboard
       └── Chatbot
             └── Voz
       ↓
PDF / CSV / XLSX quando aplicável
```

Carlos Búrigo é o primeiro workspace/candidato de uso. Nenhuma camada nova pode assumir seu nome como identidade estrutural do motor.

## Escopo

### 9A — Presentation Contract

Contrato único para transformar resultados analíticos em artefatos de apresentação:

- text
- kpi
- chart
- table
- map
- timeline
- comparison
- report
- download

O resultado determinístico é a única fonte dos valores apresentados.

### 9B — Conversational Contract

Contrato para:

- entrada em linguagem natural;
- resolução de intent e parâmetros;
- conversa guiada;
- continuidade contextual;
- produção dos mesmos artefatos do dashboard;
- síntese específica para voz.

A LLM interpreta e explica. Não calcula métricas nem altera método, denominador ou fórmula.

### 9C — Candidate / Workspace Context

Contexto mínimo compartilhado:

- workspace_id
- candidate_id
- election_id
- office_id
- state
- round
- year

Permissões de workspace determinam o subconjunto autorizado de candidatos, eleições e escopos. A capacidade do motor não define autorização.

Não criar agora uma arquitetura SaaS multi-tenant. O contrato existe para impedir acoplamento ao primeiro cliente e permitir evolução futura.

### 9D — Implementação

A interface entra no Dashboard existente do gabinete e reutiliza:

- autenticação;
- RBAC;
- RLS;
- shell administrativo;
- Worker;
- Supabase remoto.

Não criar dashboard, autenticação ou API pública paralelos.

## Biblioteca de templates

Templates são famílias reutilizáveis, não 100 templates por intent:

- ranking
- historical-series
- comparison
- variation
- distribution
- concentration
- analytical-table
- municipal-map
- growth-map
- decline-map
- candidate-profile
- territorial-profile
- competition
- territorial-evolution
- composite-index
- executive-summary

Um intent escolhe método e resultado; o template escolhe a apresentação adequada.

## Fluxo obrigatório

```
PERGUNTA
  ↓
INTENT
  ↓
MÉTODO / SKILL
  ↓
RUNTIME DETERMINÍSTICO
  ↓
RESULTADO ESTRUTURADO
  ↓
PRESENTATION CONTRACT
  ├── dashboard
  └── chatbot
       ├── visual
       └── voice summary
```

## Exportação

PDF é relatório estruturado, nunca screenshot.

Quando aplicável, o resultado também poderá gerar CSV ou XLSX. Exportadores consomem o resultado estruturado e seus metadados de metodologia/evidência.

## Voz

```
STT → pergunta textual → pipeline eleitoral → resultado
                                      ├── UI
                                      └── resumo TTS
```

STT/TTS são adaptadores de interface. Não existe motor eleitoral de voz separado.

## Critérios de aceite da Fase 9

1. Dashboard e chatbot produzem o mesmo resultado para o mesmo contexto e filtros.
2. Nenhum número é calculado pela LLM.
3. Nenhum candidato é hardcoded no núcleo.
4. Toda apresentação informa contexto suficiente para evitar interpretação errada.
5. Metodologia e evidência são acessíveis sob demanda.
6. Exportação nasce do resultado estruturado.
7. Voz usa a mesma análise e apenas uma síntese específica.
8. O módulo permanece dentro do Dashboard existente.
9. RBAC/RLS continuam sendo as barreiras de autorização.
10. Não é criada uma segunda base eleitoral.

## Blocos de implementação

A implementação seguirá quatro blocos coerentes:

1. contratos e tipos compartilhados;
2. acesso ao resultado/projeção e apresentação no Dashboard;
3. chatbot sobre o mesmo pipeline;
4. exportação e adaptadores de voz.

Cada bloco exige teste e evidência antes do próximo.
