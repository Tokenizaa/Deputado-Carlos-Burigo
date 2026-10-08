# FASE 9 — Chatbot e Interface de Inteligência

## Objetivo

Inserir a Inteligência Eleitoral dentro do dashboard existente do gabinete e disponibilizar o chatbot analítico como interface transversal.

Não criar dashboard paralelo.

## Posicionamento

O módulo pertence ao painel autenticado existente e deve respeitar autenticação, RBAC, RLS, navegação e identidade visual atuais.

Áreas: Visão Geral; Histórico; Território; Candidatos / Concorrência. O chatbot é transversal às quatro áreas.

## Pipeline da resposta

pergunta → resolução de escopo → intent → plano de orquestração → função determinística → resultado → RAG metodológico → interpretação

O número exibido ao usuário deve vir do resultado determinístico.

## Regras

O chatbot não pode inventar número, inventar fórmula, substituir o resultado calculado, consultar o banco local diretamente, consultar ZIP/CSV, misturar cargo ou turno, esconder o denominador ou resolver intent pendente como implementada.

## Contrato de resposta

answer, result, method, scope, evidence, limitations, status.

Quando a intent estiver pendente, status=pending e a resposta deve explicar a limitação metodológica.

## Fonte de dados

Em produção: Supabase — projeção analítica publicada.

Nunca: browser → PostgreSQL local.

O banco local continua sendo a origem de processamento e auditoria.

## Estado

O contrato da interface está fechado, mas a integração runtime permanece dependente da publicação da projeção analítica no Supabase e da conexão efetiva entre orquestrador, motor determinístico, RAG e provedor LLM.

Não criar uma interface que simule dados enquanto essa projeção não existir.
