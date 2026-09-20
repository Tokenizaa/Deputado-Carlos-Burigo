# FASE 28 — CONTA DO CIDADÃO E PROPRIEDADE DAS DEMANDAS

## Objetivo

Substituir o acompanhamento público por protocolo por um modelo em que cada demanda pertence a uma conta de cidadão autenticada.

## Fluxo definido

1. O cidadão abre **Fale com o Gabinete** e preenche a demanda.
2. Antes do envio definitivo, o formulário pergunta se já possui conta.
3. Se já possui, autentica-se.
4. Se não possui, cria a conta no próprio fluxo com e-mail, telefone/WhatsApp, senha e confirmação da senha.
5. A demanda é criada já vinculada ao usuário autenticado.
6. O acompanhamento passa a ocorrer em **Minhas demandas**.
7. O protocolo permanece como identificador, nunca como credencial.
8. Nesta primeira versão não haverá confirmação do telefone por código.

## Modelo de segurança

- Reutilizar Supabase Auth existente.
- `public.demands.citizen_user_id` referencia `auth.users.id`.
- Cidadão autenticado somente pode consultar demandas cujo `citizen_user_id = auth.uid()`.
- Mensagens e histórico seguem a mesma regra de propriedade.
- O gabinete continua com acesso administrativo via RBAC existente.
- Acesso público por protocolo será removido da experiência do cidadão.
- Não haverá dados, registros, protocolos ou URLs fictícios.

## Dados existentes

As demandas existentes sem `citizen_user_id` não serão atribuídas automaticamente a contas por coincidência de e-mail. Elas permanecem preservadas e acessíveis ao gabinete até existir um fluxo seguro de vinculação.

## Etapas

### Etapa 1 — Fundação e segurança
- adicionar propriedade da demanda;
- remover RLS público de leitura/escrita de acompanhamento;
- criar políticas de proprietário para cidadão;
- documentar a arquitetura.

### Etapa 2 — Criação de conta no fluxo
- incorporar criação/login ao formulário;
- criar a demanda já autenticada;
- armazenar telefone normalizado;
- preservar os dados reais preenchidos.

### Etapa 3 — Área do cidadão
- criar login do cidadão;
- criar **Minhas demandas**;
- permitir abertura da própria demanda;
- permitir mensagens somente na própria demanda;
- remover o acompanhamento público por protocolo e seus textos de teste.

## Observação

A criação usa e-mail + senha no Supabase Auth. A configuração atual de confirmação de e-mail deve ser verificada antes de definir o comportamento final pós-cadastro; não será criado um mecanismo paralelo de autenticação.

## Execução atual

### Etapa 1 — concluída
- `demands.citizen_user_id` criado no Supabase.
- RLS público de leitura/escrita removido de demandas, mensagens e histórico.
- Políticas de propriedade por `auth.uid()` criadas.
- As 3 demandas reais existentes permanecem preservadas e sem vinculação automática.

### Etapa 2 — implementada
- Criação de conta integrada ao formulário de Fale com o Gabinete.
- Login existente integrado ao envio da demanda.
- Conta criada no Supabase Auth no servidor, com e-mail confirmado para permitir conclusão imediata do fluxo.
- Telefone normalizado para formato internacional compatível com WhatsApp, sem confirmação por código.
- API de criação exige sessão e grava `citizen_user_id`.

### Etapa 3 — implementada
- Área `/minhas-demandas` criada.
- Listagem limitada às demandas da conta autenticada.
- Abertura da demanda e mensagens protegidas por sessão + propriedade.
- Acompanhamento público por protocolo removido da interface e o componente antigo foi excluído.

## Verificação

A estrutura e as políticas foram verificadas diretamente no Supabase. O build local não pôde ser executado nesta rodada porque o ambiente de execução não conseguiu resolver `github.com`; portanto, o build permanece pendente de verificação no ambiente local do projeto.
