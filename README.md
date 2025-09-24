# Arquitetura Bancária com Clean Architecture, CQRS e Event Sourcing

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" /></a>
</p>

## Descrição

Este documento descreve a arquitetura do sistema bancário implementado, detalhando o design baseado em Clean Architecture, CQRS (Command Query Responsibility Segregation) e Event Sourcing.


## Visão Geral da Arquitetura

O projeto foi construído seguindo os princípios da Clean Architecture, organizando o código em camadas concêntricas com dependências apontando para dentro (em direção ao domínio). A implementação também incorpora CQRS e Event Sourcing para proporcionar um sistema robusto, escalável e auditável para operações financeiras.


## Configuração do Projeto

```bash
$ npm install
```

## Compilar e Executar o Projeto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Executar Testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Solução de problemas comuns com Auth0

1. **Token sendo rejeitado (401 Unauthorized)**:
   - Verifique se o `AUTH0_AUDIENCE` no `.env` corresponde ao configurado no Auth0
   - Confirme que o `AUTH0_DOMAIN` está correto
   - Certifique-se de que o token não está expirado

2. **Problemas com audience**:
   - No Auth0 Dashboard, verifique a configuração da sua API
   - O identifier da API deve corresponder exatamente ao `AUTH0_AUDIENCE` no `.env`

3. **Problemas com CORS**:
   - Se estiver testando com uma aplicação frontend, certifique-se de que as origens permitidas estão configuradas no Auth0
```
