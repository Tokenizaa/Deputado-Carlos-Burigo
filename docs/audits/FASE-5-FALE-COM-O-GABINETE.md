# Fase 5 — Fale com o Gabinete

**Data:** 2026-09-18  
**Base:** `main`  
**Objetivo:** transformar o contato com o gabinete em função de primeira classe, consolidando contato institucional e atendimento cidadão em um único fluxo.

## Diagnóstico

O projeto já possuía um fluxo funcional de demandas em `CitizenPortalView`, com:
- identificação;
- e-mail;
- telefone/WhatsApp;
- município;
- categoria;
- assunto;
- descrição;
- anexos;
- consentimento LGPD;
- protocolo;
- acompanhamento.

Também existia uma segunda `ContactView` com formulário separado por `mailto:`. Isso fragmentava a experiência de contato.

## Implementado

### Canal canônico

**Fale com o Gabinete** agora utiliza o fluxo de atendimento cidadão existente como fonte única.

A rota canônica é:

`/contato`

O caminho legado `/cidadao` permanece reconhecido como alias de compatibilidade, mas resolve para a mesma experiência.

### Desktop

O CTA **Fale com o Gabinete** permanece diretamente no header e também está disponível no footer.

### Mobile

Foi adicionada uma ação flutuante persistente:

**Fale com o Gabinete**

Características:
- texto explícito;
- alto contraste;
- área de toque adequada;
- posicionamento acima da bottom navigation;
- respeito ao `safe-area-inset-bottom`;
- ocultação na própria página de contato para evitar duplicação;
- navegação para o fluxo canônico.

### Formulário

O fluxo existente foi preservado, evitando criar uma segunda API ou banco:

1. identificação mínima;
2. canal de retorno;
3. assunto;
4. mensagem/demanda;
5. consentimento LGPD;
6. envio;
7. confirmação com protocolo;
8. consulta posterior do protocolo.

### Estados

O fluxo existente já trata:
- validação;
- carregamento/envio;
- sucesso;
- erro;
- confirmação;
- acompanhamento posterior.

### Acessibilidade

- controles de formulário foram ampliados para leitura de 16px;
- microtipografia foi removida do fluxo;
- textos de apoio foram ampliados;
- CTA móvel possui foco visível;
- o botão flutuante não depende somente de ícone;
- o canal permanece acessível por teclado.

## Arquitetura preservada

Não foi criada:
- nova tabela;
- nova API;
- nova arquitetura de atendimento;
- nova base de contatos;
- novo sistema de protocolo.

A implementação reutiliza `/api/citizen/demand` e o fluxo de protocolo existente.

## Preservação

- Home não foi reconstruída.
- Supabase permanece fonte de dados.
- Cloudflare permanece runtime.
- ContactView foi reduzida a um adaptador de compatibilidade para o fluxo cidadão.
- Nenhuma segunda experiência de atendimento foi criada.

## Critérios

- [x] CTA textual de alta visibilidade.
- [x] CTA no header.
- [x] CTA no mobile.
- [x] Botão flutuante mobile.
- [x] Safe area.
- [x] Fluxo único.
- [x] Identificação mínima.
- [x] Canal de retorno.
- [x] Assunto.
- [x] Mensagem.
- [x] Confirmação.
- [x] Estados de sucesso/erro/validação.
- [x] LGPD.
- [x] Compatibilidade com rota legada.
- [x] Sem nova arquitetura.

**Estado: Fase 5 concluída.**
