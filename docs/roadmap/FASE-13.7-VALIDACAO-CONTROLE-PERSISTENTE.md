# FASE 13.7 — VALIDAÇÃO DO PRIMEIRO CONTROLE PERSISTENTE

**Data:** 21/09/2026  
**Status:** concluída com validação de código e banco; validação HTTP externa limitada pelo ambiente de execução

## Objetivo

Validar a Fase 13.6 antes de criar qualquer novo controle operacional.

## 1. Código em `main`

Foi feita nova leitura do código atual em `main`.

### Configuração operacional

`/api/platform-settings`:
- GET lê `getPlatformSettings()`;
- PUT exige autenticação;
- PUT exige a permissão `manage_settings`;
- somente aceita `citizenDemandEnabled` como booleano;
- persiste por `updatePlatformSettings()`;
- registra alteração em `public.audit_logs` com `entity_type = platform_settings`.

### Bloqueio efetivo

`/api/citizen/demand`:
1. exige POST;
2. consulta `getPlatformSettings()`;
3. quando `citizenDemandEnabled = false`, responde HTTP 503;
4. somente depois realiza autenticação do cidadão e criação da demanda.

Portanto, o bloqueio efetivo está no servidor e não depende apenas da interface.

### Interface administrativa

`AdminSettingsTab`:
- consulta o estado atual;
- obtém a sessão Supabase;
- envia PUT autenticado;
- atualiza o estado após resposta bem-sucedida;
- impede interação enquanto carrega ou salva.

### Interface pública

`CitizenPortalView`:
- consulta o mesmo estado;
- apresenta carregamento enquanto verifica disponibilidade;
- apresenta indisponibilidade quando o canal está pausado;
- mantém o servidor como autoridade final.

## 2. Banco de dados

A estrutura `public.platform_settings` e suas políticas RLS foram verificadas no projeto Supabase.

Políticas existentes:
- `platform_settings_admin_select`: SELECT para usuários autenticados com papel ADMIN;
- `platform_settings_admin_update`: UPDATE para usuários autenticados com papel ADMIN, incluindo `WITH CHECK`.

A tabela possui controle de acesso compatível com o desenho da Fase 13.6.

## 3. Auditoria

A implementação utiliza exclusivamente a tabela canônica:

`public.audit_logs`

Não foi criada uma segunda estrutura de auditoria.

## 4. Validação de produção

Foi tentada a validação HTTP direta dos endpoints públicos da versão implantada.

O ambiente de execução desta auditoria não conseguiu resolver/acessar o hostname Cloudflare:

`deputado-carlos-burigo.olfnetto.workers.dev`

Por isso, não foi possível executar neste ambiente uma chamada HTTP real contra produção nem realizar o ciclo controlado `true → false → verificar bloqueio → true`.

Também não foi alterado o estado operacional de produção durante esta auditoria.

## 5. Resultado

A implementação foi considerada estruturalmente consistente com a Fase 13.6:
- persistência presente;
- RLS presente;
- autorização administrativa presente;
- auditoria presente;
- consumidor administrativo presente;
- consumidor público presente;
- bloqueio server-side presente;
- nenhum novo controle especulativo criado.

A única validação pendente é a confirmação HTTP externa do comportamento efetivo no Worker implantado.

## 6. Decisão para a próxima etapa

Não criar outro controle de Configurações até que a validação HTTP de produção seja realizada.

A Fase 13.7 encerra a auditoria de código e banco e deixa explicitamente registrada a limitação de acesso externo ao Worker neste ambiente.