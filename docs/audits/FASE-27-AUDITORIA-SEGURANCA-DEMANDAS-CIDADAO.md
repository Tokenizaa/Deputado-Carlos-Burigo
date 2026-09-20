# Auditoria de Segurança do Acompanhamento de Demandas do Cidadão

Data: 2026-09-20
Escopo: fluxo público de criação, consulta e acompanhamento de demandas.

## Resultado

Status: **BLOQUEADO PARA EXPOSIÇÃO PÚBLICA DE DADOS DE DEMANDAS**

O acompanhamento atual usa apenas o número de protocolo como credencial. O protocolo é enviado para `GET /api/citizen/lookup?protocol=...`, sem autenticação ou segundo fator.

A implementação atual permite que uma pessoa que conheça ou descubra um protocolo obtenha dados pessoais e o conteúdo da demanda.

## Fluxo atual verificado

1. O cidadão cria uma demanda em `POST /api/citizen/demand`.
2. O formulário exige nome, e-mail, telefone, município, categoria, assunto, descrição e consentimento LGPD.
3. O backend gera um protocolo no formato `#2026-XXXXXX`.
4. O backend calcula `tracking_token_hash = SHA-256(protocol + citizenEmail)`.
5. Apesar de existir esse hash, ele não é usado para autorizar o acompanhamento.
6. O endpoint público `GET /api/citizen/lookup` aceita somente o protocolo.
7. `getPublicDemandByProtocol` retorna a demanda completa, incluindo dados cadastrais, descrição, anexos e mensagens/histórico.
8. O DTO público também contém `trackingTokenHash`, embora esse valor não deva ser necessário no cliente.
9. O frontend `CitizenProtocolModal` consulta somente o protocolo e exibe os dados retornados.

## Dados potencialmente expostos

O DTO público atual inclui:

- nome do cidadão;
- e-mail;
- telefone;
- município;
- bairro;
- categoria;
- assunto;
- descrição;
- anexos;
- prioridade;
- status;
- datas de criação/atualização;
- mensagens da demanda;
- histórico de movimentações;
- identificadores internos relacionados ao registro;
- `trackingTokenHash`.

O histórico também expõe `actorId`, `actorName` e `actorRole`.

## Problema estrutural no Supabase

As tabelas reais estão com RLS habilitado, porém as políticas públicas atuais são excessivamente amplas:

### public.demands

A política `demands_public_select` permite SELECT para `anon` com condição `true`.

Isso significa que o papel anônimo pode consultar linhas de `demands` sem vínculo com o titular.

### public.demand_messages

A política `demand_messages_public_select` permite SELECT para `anon` sempre que existir a demanda relacionada.

Como a demanda possui SELECT público amplo, as mensagens também ficam acessíveis publicamente.

### public.demand_history

A política `demand_history_public_select` segue o mesmo modelo e permite SELECT anônimo vinculado apenas à existência da demanda.

Portanto, o problema não está somente no endpoint HTTP: o modelo de acesso público do banco também precisa ser corrigido.

## Evidência do banco em 2026-09-20

A tabela `public.demands` possui atualmente 3 registros reais.

Os 3 possuem:

- e-mail;
- telefone;
- `tracking_token_hash`.

Não foram criados registros de teste durante esta auditoria.

## Outros problemas encontrados

### 1. Protocolo como segredo

O formato `#2026-XXXXXX` possui somente seis dígitos aleatórios. O protocolo funciona simultaneamente como identificador público e credencial de acesso.

Isso torna a proteção dependente de segredo de baixa entropia e de não enumeração.

### 2. Hash de rastreamento não funciona como autenticação

O campo `tracking_token_hash` existe no banco, mas a consulta pública não exige o token original nem qualquer prova adicional de posse.

Além disso, o hash é incluído no DTO público.

### 3. Criação da demanda devolve a demanda completa

Após inserir a demanda, `POST /api/citizen/demand` chama `getPublicDemandByProtocol` e devolve `demand: fullDemand`.

Assim, a resposta de criação já contém os mesmos dados que o endpoint de acompanhamento expõe.

### 4. Mensagem complementar

O frontend tenta usar `POST /api/citizen/messages` para enviar uma mensagem complementar usando protocolo + nome do cidadão. Não foi localizada uma rota correspondente no `src/worker.ts` atual.

Isso precisa ser tratado separadamente antes de habilitar esse recurso.

### 5. Não existe conta de cidadão no fluxo atual

Não foi encontrada uma autenticação de cidadão vinculada às demandas. O login existente é o login do gabinete.

Isso não é, por si só, um problema. É possível manter o protocolo sem exigir cadastro, desde que o acompanhamento tenha autenticação/validação suficiente.

## Conclusão

O desenho atual deve ser considerado **inadequado para acompanhamento público de demandas contendo dados pessoais**.

A correção não deve começar criando uma conta obrigatória para todo cidadão.

O caminho a avaliar na próxima fase é:

1. manter criação de demanda sem cadastro;
2. remover o acesso baseado somente no protocolo;
3. introduzir uma segunda prova de posse usando um contato real já informado na demanda, ou outro mecanismo de autenticação apropriado;
4. retornar ao cidadão somente o mínimo necessário para acompanhamento;
5. retirar do DTO público identificadores e dados internos desnecessários;
6. corrigir as políticas RLS para impedir SELECT anônimo direto de demandas, mensagens e histórico;
7. proteger também o envio de mensagens complementares;
8. registrar e auditar os acessos ao acompanhamento;
9. revisar rate limiting, enumeração de protocolos e respostas de erro.

Nenhuma alteração de dados foi realizada nesta auditoria.

## Referência de segurança

A ANPD descreve controle de acesso como uma medida para garantir que dados sejam acessados somente por pessoas autorizadas, composta por autenticação, autorização e auditoria. A ANPD também orienta medidas técnicas e administrativas para proteção contra acessos não autorizados.

Fontes oficiais:
- https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-vf.pdf
- https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/portaria-anpd-no-35-de-4-de-novembro-de-2022
