# IE-01 — FUNDAÇÃO DA INTELIGÊNCIA ELEITORAL

**Estado:** CONCLUÍDA  
**Data:** 2026-10-06  
**Repositório:** `Tokenizaa/Deputado-Carlos-Burigo`

## 1. Ponto de inserção confirmado

A aplicação já possui um Dashboard de Gabinete único em:

- rota: `/admin`;
- shell: `src/components/admin/AdminLayout.tsx`;
- workspace: `src/components/admin/AdminWorkspace.tsx`;
- autenticação: `AdminAuthView` + `InternalOnboardingGate`;
- estado global: `AppContext`.

O Dashboard utiliza hash para a navegação interna:

`/admin#<modulo>`

Portanto, a Inteligência Eleitoral deverá entrar nesse mesmo mecanismo. **Não existe justificativa arquitetural para criar outro dashboard.**

## 2. Arquitetura atual relevante

### Shell

`AdminLayout` concentra cabeçalho, sidebar, sessão do usuário, logout e conteúdo administrativo.

### Workspace

`AdminWorkspace` resolve o módulo ativo e renderiza suas páginas/subabas.

### Autorização

O frontend utiliza:

`src/config/adminPermissions.ts`

O backend utiliza:

`server/permissions.ts`

O Supabase possui catálogo persistido de permissões em:

`public.permission_definitions`

com presets em:

`public.role_permissions`

e overrides por usuário/convite.

### Banco

O projeto já mantém migrações Supabase em:

`supabase/migrations/`

A migração `20260922100000_rbac_effective_permissions.sql` estabeleceu a estrutura canônica de RBAC configurável.

## 3. Decisão arquitetural

A Inteligência Eleitoral será adicionada como um módulo administrativo do mesmo Dashboard.

Não será criado:

- segundo dashboard;
- segundo layout administrativo;
- segundo sistema de autenticação;
- segundo RBAC;
- aplicação separada;
- API pública de inteligência.

## 4. Estado do RBAC

A matriz atual possui os módulos:

- dashboard;
- cidadão;
- agenda;
- gestão documental;
- conteúdo;
- tarefas;
- atuação;
- administração;
- configurações.

A Inteligência Eleitoral **ainda não foi adicionada ao catálogo operacional** nesta etapa.

Isso é intencional: a criação da permissão será feita junto da definição do modelo de dados e do contrato de acesso do módulo, evitando cadastrar permissões sem implementação correspondente.

## 5. Fonte de dados eleitoral

A fonte primária definida é o **Portal de Dados Abertos do TSE**.

O grupo de Resultados disponibiliza conjuntos históricos com:

- votação nominal/partido;
- resultados por município e zona;
- resultados por zona/seção;
- votação por seção;
- boletins de urna;
- correspondências esperadas e efetivadas.

O portal já apresenta conjuntos de 2022 e 2024 com granularidade compatível com a análise planejada. Para 2026, o portal já disponibiliza conjuntos de preparação/correspondência e deverá ser acompanhado até a publicação do conjunto de resultados consolidado na mesma estrutura.

Fonte oficial:
https://dadosabertos.tse.jus.br/

## 6. Implicação para o modelo

O modelo não deve depender de um arquivo específico nem de uma eleição específica.

A unidade analítica deverá suportar:

**eleição → turno → cargo → UF → município → zona → seção → candidato → votação**

e permitir agregações superiores sem duplicar fatos.

Os dados de origem deverão permanecer identificáveis para permitir auditoria e reprocessamento.

## 7. Primeiro recorte de dados

A primeira carga deverá priorizar:

1. eleição em que Carlos Burigo foi eleito;
2. eleição de 2026;
3. mesmo cargo;
4. resultados por município;
5. resultados por zona;
6. resultados por seção;
7. demais candidatos do mesmo cargo;
8. eleitorado e comparecimento quando disponíveis no conjunto oficial correspondente.

## 8. Resultado da IE-01

A fundação está definida.

**Próxima etapa: IE-02 — Modelo de Dados.**

A próxima implementação deve começar pelo esquema canônico no Supabase e pela estratégia de ingestão, antes de criar as páginas da Inteligência Eleitoral.
