# AGENTS — GOVERNANÇA DO REPOSITÓRIO

**Estado:** reconciliado em D6 da reconstrução documental
**Branch de referência:** main

## Finalidade

Este arquivo define regras operacionais para agentes que trabalham no repositório. Ele não é fonte de verdade sobre o estado funcional do produto.

O estado do produto é determinado por:
1. código em main;
2. banco e configuração reais, quando aplicável;
3. validações executadas;
4. documentação canônica derivada dessas evidências.

A sequência operacional está exclusivamente em docs/roadmap/ROADMAP-CANONICO.md.

## Arquitetura atual

- Frontend: React 19 + Vite + TypeScript.
- Runtime de produção: Cloudflare Workers.
- Persistência e autenticação: Supabase.
- Servidor: Worker em src/worker.ts, com módulos de acesso ao Supabase em server/.
- Contratos e tipos compartilhados: src/types.ts e src/contracts/.
- Autorização administrativa: src/config/adminPermissions.ts + autenticação do Worker.
- Documentação canônica: docs/documentation/, ADRs em docs/adr/ e roadmap em docs/roadmap/ROADMAP-CANONICO.md.

## Regras de governança

1. Não criar uma segunda arquitetura para substituir a existente.
2. Não criar runtime de produção paralelo ao Cloudflare Worker.
3. Não reintroduzir api/ como camada de produção paralela ao Worker.
4. Não recriar fontes de dados removidas quando existir uma fonte canônica documentada.
5. Antes de alterar um domínio, localizar a implementação e a documentação canônica existentes.
6. Não interpretar documentação histórica como estado atual.
7. Não classificar como ausente algo apenas porque ainda não foi validado.
8. Toda mudança de arquitetura relevante deve ter ADR.
9. Alterações em autenticação, autorização ou RLS devem ser acompanhadas de validação objetiva.
10. Não duplicar páginas, módulos, mapeadores ou fluxos existentes sem necessidade comprovada.
11. Preservar histórico Git; correções documentais são feitas por reconciliação, não por reescrita destrutiva.
12. Backlogs e identificadores históricos permanecem históricos e não definem novas fases.

## Domínios funcionais

Os domínios devem ser tratados a partir da implementação real, sem pressupor a topologia de agentes descrita em versões antigas deste arquivo:
- autenticação, autorização e equipe;
- demandas e atendimento cidadão;
- conteúdo/CMS;
- comunicação pública;
- domínio legislativo;
- documentos e evidências;
- agenda, resultados, municípios e vídeos;
- configurações e infraestrutura.

Um agente pode atuar em mais de um domínio quando uma mudança transversal exigir isso. O limite é definido pelo código atual e pelas regras de governança, não por uma lista fixa de agentes.

## Segurança

- Credenciais e chaves de serviço não devem ser expostas no frontend.
- Endpoints protegidos devem validar a sessão e a autorização aplicável.
- Alterações de senha devem respeitar a política centralizada em src/lib/passwordValidation.ts.
- Mudanças de RLS devem ser tratadas como alterações de segurança e validadas no Supabase.
- Logs de auditoria não devem ser tratados como substitutos de autorização.

## Documentação

Antes de criar um novo documento:
1. consultar docs/documentation/README.md;
2. localizar a fonte canônica existente;
3. atualizar a fonte existente quando o conteúdo pertencer ao mesmo assunto;
4. criar novo documento somente quando houver uma finalidade distinta.

Documentos históricos podem ser preservados para rastreabilidade, mas não devem ser usados para reabrir trabalho automaticamente.

## Histórico da topologia anterior

As definições anteriores de Supervisor, Architecture Review, Context Manager e agentes de domínio permanecem preservadas no histórico Git. A topologia descrita na versão anterior deste arquivo não é mais considerada uma especificação operacional atual.

## Critério de conclusão

Uma tarefa só deve ser marcada como concluída quando houver evidência objetiva apropriada ao seu tipo:
- implementação no código;
- migration/configuração aplicada;
- teste ou validação executada;
- smoke de produção, quando aplicável.

NÃO VALIDADO não significa NÃO IMPLEMENTADO.
