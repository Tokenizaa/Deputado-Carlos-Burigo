# Fase 15 — QA funcional e conteúdo

**Status:** CONCLUÍDA PARCIALMENTE  
**Data:** 2026-09-18  
**Base:** `f87e958923147b7b67231b05d9aeced2b9a3acdf`

## Escopo

QA funcional e de conteúdo sobre o estado real de `main`, cobrindo:

- build oficial;
- rotas públicas;
- dados públicos;
- estados de carregamento/erro/vazio;
- comunicação cidadã;
- documentos e transparência;
- proteção das superfícies administrativas.

## Resultado

### 1. Dados públicos — PASS

Validação direta no Supabase canônico `wktanxbpijurimdjgone`:

| Fonte | Registros | Campos essenciais ausentes |
|---|---:|---:|
| news | 5 | 0 |
| events | 5 | 0 |
| documents | 224 | 0 |
| legislative_items | 22 | 0 |
| results | 4 | 0 |

Não foram encontrados títulos ausentes nem datas obrigatórias ausentes nos conjuntos auditados. Documentos também possuem `original_url` preenchida no conjunto consultado.

### 2. Arquitetura e rotas — PASS

A aplicação continua usando:

- React/Vite;
- Cloudflare Worker como runtime;
- Supabase como fonte de dados;
- rotas SPA canônicas no `App.tsx`;
- APIs públicas no `worker.ts`.

Não foi criada segunda arquitetura, banco paralelo ou API paralela durante esta fase.

### 3. Achado funcional/de segurança — CORRIGIDO

A auditoria do `worker.ts` identificou que endpoints administrativos de demandas, usuários e auditoria não estavam passando pelo helper `requireAuth`, apesar de serem tratados como superfícies administrativas.

Foram protegidos:

- `/api/auth/me`;
- `/api/auth/switch-user`;
- `/api/demands`;
- `/api/demands/:id`;
- `/api/audit-logs`.

Correção integrada diretamente em `main`:

`f87e958923147b7b67231b05d9aeced2b9a3acdf`

### 4. Comunicação cidadã — IMPLEMENTAÇÃO AUDITADA

O fluxo público existente permanece em:

- `POST /api/citizen/demand`;
- `GET /api/citizen/lookup`.

O endpoint de criação exige os campos mínimos e consentimento LGPD antes de persistir a demanda.

**Validação real de envio ainda pendente**, pois a execução desta fase não dispõe de navegador operacional para submeter o formulário em ambiente publicado.

### 5. Documentos/transparência — DADOS PASS

O acervo possui 224 documentos e a consulta estrutural não encontrou títulos ou URLs de origem ausentes.

**Abertura física dos arquivos ainda requer validação de navegador/rede**, portanto não foi marcada como teste manual aprovado.

### 6. Build — PENDENTE DE EXECUÇÃO REAL

O `package.json` mantém o script oficial:

`npm run build`

O ambiente desta execução não possui uma cópia executável do repositório com dependências instaladas nem acesso de rede suficiente para reconstruir o workspace e rodar o build local.

O relatório histórico `VALIDATION_REPORT.md` registra um build/deploy anterior como aprovado, mas ele não substitui a execução do build sobre o commit atual.

### 7. Browser / jornada E2E — PENDENTE

Permanecem para execução em navegador real:

- Home;
- todas as rotas públicas;
- abertura de notícia;
- agenda;
- atuação;
- documentos/transparência;
- formulário Fale com o Deputado;
- lookup por protocolo;
- estados de erro/vazio;
- navegação mobile.

Não foram marcados como aprovados por inferência.

## Bloqueadores

A Fase 15 não deve ser declarada integralmente concluída enquanto os seguintes testes reais não forem executados:

1. `npm run build` no estado atual de `main`;
2. jornada E2E em navegador;
3. envio real de manifestação;
4. abertura real de documento público.

## Observação de banco

Os advisors do Supabase registraram:

- 1 aviso de segurança sobre proteção contra senhas vazadas desabilitada;
- avisos de performance sobre índices de foreign keys e múltiplas políticas permissivas.

Esses avisos não foram alterados nesta fase porque não constituem correção necessária para o QA funcional do portal e mudanças de banco não devem ser introduzidas sem escopo próprio.

## Critério de conclusão

- [x] auditoria de dados públicos;
- [x] auditoria estrutural das rotas;
- [x] revisão dos estados de API existentes;
- [x] identificação e correção da exposição de endpoints administrativos;
- [ ] build oficial no commit final;
- [ ] E2E em navegador;
- [ ] envio real do contato;
- [ ] abertura real dos documentos.

**Conclusão:** Fase 15 avançou e teve uma correção funcional importante integrada em `main`, mas permanece **CONCLUÍDA PARCIALMENTE** até que os testes que dependem de execução real sejam realizados.
