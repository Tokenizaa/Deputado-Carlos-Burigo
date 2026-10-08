# OpenCode — Escopo local do Deputado Carlos Burigo

Este diretório contém skills específicas da plataforma parlamentar e do gabinete.

## Skills locais
- agent-dominio-admin
- agent-dominio-auditoria
- agent-dominio-configuracoes
- agent-dominio-conteudo
- agent-dominio-demandas
- agent-dominio-projetos
- agent-dominio-usuarios
- agent-dominio-votos

## Escopo
Esses domínios são específicos da plataforma parlamentar e não devem permanecer
como skills globais.

A skill `agent-dominio-govbr` permanece global, pois GOV.BR foi deliberadamente
classificado como capacidade transversal reutilizável em outros projetos.

A orquestração geral continua com o @supervisor global. Não criar uma segunda
camada de runtime, state machine ou agent-loop local.
