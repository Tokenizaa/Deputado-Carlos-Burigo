# FASE 13.6 — PRIMEIRO CONTROLE PERSISTENTE DE COMPORTAMENTO

**Status:** concluída em 21/09/2026

## Objetivo

Transformar Configurações em um ponto de controle comportamental real, sem criar uma coleção especulativa de toggles.

O primeiro comportamento escolhido foi o **recebimento de novas demandas pelo canal cidadão**, porque já existe:

- um fluxo público real em `/contato` e `/cidadao`;
- uma API real em `/api/citizen/demand`;
- persistência em `public.demands`;
- rastreamento por protocolo;
- autenticação de cidadão;
- necessidade operacional legítima de pausar novas entradas sem apagar ou alterar demandas existentes.

## Implementação

### 1. Nova configuração operacional

Foi criada a tabela mínima `public.platform_settings`, com uma única configuração:

`citizen_demand_enabled boolean not null default true`

A tabela possui RLS e somente administradores podem consultá-la diretamente pela camada autenticada do banco.

### 2. Consumidores reais

A configuração possui dois consumidores:

- **Portal cidadão:** `CitizenPortalView` consulta o estado e informa quando o canal está temporariamente indisponível.
- **Worker:** `/api/citizen/demand` verifica a configuração antes de criar uma nova demanda e responde HTTP 503 quando o canal está pausado.

O bloqueio no servidor é a regra efetiva; a interface pública é apenas o reflexo dessa regra.

### 3. Administração

`/api/platform-settings` passou a permitir:

- GET público apenas do estado seguro `citizenDemandEnabled`;
- PUT autenticado exclusivamente para quem possui `manage_settings`.

A tela **Configurações → Atendimento** agora apresenta o controle:

**Recebimento de novas demandas — Ativo/Pausado**

A alteração é persistida no Supabase.

### 4. Auditoria

Cada alteração gera registro na tabela canônica `public.audit_logs`:

- `entity_type = platform_settings`;
- `entity_id = true`;
- ação `update`;
- novo estado registrado em `details`.

Nenhuma segunda estrutura de auditoria foi criada.

## O que não foi feito

Não foram adicionados:

- modo manutenção genérico;
- múltiplos feature flags;
- configuração de protocolo;
- limites arbitrários de atendimento;
- configuração de e-mail/WhatsApp sem consumidor real;
- parâmetros técnicos sem necessidade operacional.

## Critério para os próximos controles

Um novo item só entra em Configurações quando houver simultaneamente:

1. regra operacional definida;
2. consumidor real no código;
3. persistência adequada;
4. permissão compatível;
5. auditoria quando a alteração afetar operação ou acesso.

## Resultado

A área **Configurações** deixou de ser apenas um painel de estado e passou a conter o primeiro controle persistente que altera um comportamento real da plataforma, mantendo a separação:

- **Conteúdo:** o que o cidadão vê;
- **Configurações:** como a plataforma se comporta;
- **Administração:** quem pode operar;
- **Operação:** demandas, tarefas, agenda e fluxos.
