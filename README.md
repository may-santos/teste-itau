# Arquitetura Bancária com Clean Architecture, CQRS e Event Sourcing

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" /></a>
</p>

## Descrição

Este documento descreve a arquitetura do sistema bancário implementado, detalhando o design baseado em Clean Architecture, CQRS (Command Query Responsibility Segregation) e Event Sourcing.

## Diagrama da Arquitetura

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌─────────────────────┐                                          │
│  │   Presentation      │                                          │
│  │   ┌─────────────┐   │                                          │
│  │   │ Controllers │   │                                          │
│  │   └─────────────┘   │                                          │
│  └──────────┬──────────┘                                          │
│             │                                                     │
│             ▼                                                     │
│  ┌─────────────────────┐        CQRS Pattern                      │
│  │    Application      │     ┌─────────────────────┐              │
│  │  ┌──────────────┐   │     │                     │              │
│  │  │  Use Cases   │   │     │  ┌───────────────┐  │              │
│  │  └──────────────┘   │     │  │   Commands    │──┼──► Events ──┐ │
│  │  ┌──────────────┐   │     │  │   Handlers    │  │             │ │
│  │  │Command/Query │◄──┼─────┼──┘               │  │             │ │
│  │  │  Handlers    │   │     │                  │  │             │ │
│  │  └──────────────┘   │     │  ┌───────────────┐  │             │ │
│  └──────────┬──────────┘     │  │    Queries    │  │             │ │
│             │                │  │    Handlers   │  │             │ │
│             ▼                │  └───────────────┘  │             │ │
│  ┌─────────────────────┐     └─────────────────────┘             │ │
│  │      Domain         │                                         │ │
│  │  ┌──────────────┐   │                 Event Sourcing          │ │
│  │  │   Entities   │   │               ┌─────────────────┐       │ │
│  │  └──────────────┘   │               │                 │       │ │
│  │  ┌──────────────┐   │               │  ┌───────────┐  │       │ │
│  │  │ Repositories │   │               │  │   Event   │◄─┼───────┘ │
│  │  │ Interfaces   │   │               │  │   Store   │  │         │
│  │  └──────────────┘   │               │  └───────────┘  │         │
│  └──────────┬──────────┘               │                 │         │
│             │                          │  ┌───────────┐  │         │
│             ▼                          │  │Projections│◄─┼─────────┘
│  ┌─────────────────────┐               │  └───────────┘  │
│  │  Infrastructure     │               └─────────────────┘
│  │ ┌───────────────┐   │
│  │ │ Repositories  │   │
│  │ │Implementation │   │
│  │ └───────────────┘   │
│  │ ┌───────────────┐   │
│  │ │External       │   │
│  │ │Services       │   │
│  │ └───────────────┘   │
│  └─────────────────────┘
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Visão Geral da Arquitetura

O projeto foi construído seguindo os princípios da Clean Architecture, organizando o código em camadas concêntricas com dependências apontando para dentro (em direção ao domínio). A implementação também incorpora CQRS e Event Sourcing para proporcionar um sistema robusto, escalável e auditável para operações financeiras.

### Estrutura de Camadas

A aplicação é estruturada nas seguintes camadas:

1. **Presentation Layer (Controllers)**
   - Responsável pela interface com o usuário/API
   - Gerencia autenticação e autorização
   - Converte DTOs em comandos e consultas

2. **Application Layer (Use Cases, Command/Query Handlers)**
   - Implementa a lógica de negócios específica da aplicação
   - Orquestra entidades e serviços de domínio
   - Gerencia transações e consistência de dados

3. **Domain Layer (Entities, Repositories Interfaces)**
   - Contém as regras de negócio centrais
   - Define entidades e suas relações
   - Especifica interfaces para repositórios

4. **Infrastructure Layer (Repositories Implementations, External Services)**
   - Implementa interfaces do domínio
   - Gerencia persistência de dados
   - Integra-se com serviços externos

## CQRS: Command Query Responsibility Segregation

### Por que CQRS?

O CQRS foi escolhido para este projeto por diversos motivos:

1. **Separação de responsabilidades**: Segregar operações de leitura e escrita permite otimizá-las separadamente.

2. **Escalabilidade**: Os modelos de leitura e escrita podem ser escalados independentemente conforme a demanda.

3. **Performance**: Consultas podem ser otimizadas sem comprometer o modelo de domínio.

4. **Flexibilidade**: Facilita a evolução independente dos modelos de leitura e escrita.

### Implementação do CQRS

#### Commands (Operações de Escrita)

Os commands representam intenções de mudança no estado do sistema:

- `DepositCommand`: Adiciona fundos a uma conta
- `WithdrawCommand`: Remove fundos de uma conta

Cada command é processado por um handler específico, que aplica a lógica de negócios e gera eventos:

```typescript
@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand> {
  // ...
  async execute(command: WithdrawCommand) {
    const balance = await this.repo.getBalance(command.clientId);
    if (balance < command.amount) throw new Error('Saldo insuficiente');
    
    // Criar transação e publicar evento
    // ...
  }
}
```

#### Queries (Operações de Leitura)

As queries obtêm dados sem modificar o estado do sistema:

- `GetAccountBalanceQuery`: Obtém o saldo atual de uma conta
- `GetTransactionsByClientQuery`: Lista transações de um cliente

Cada query é processada por um handler que consulta modelos de leitura otimizados:

```typescript
@QueryHandler(GetAccountBalanceQuery)
export class GetAccountBalanceHandler implements IQueryHandler<GetAccountBalanceQuery> {
  // ...
  async execute(query: GetAccountBalanceQuery) {
    return this.repo.getBalance(query.clientId);
  }
}
```

## Event Sourcing

### Por que Event Sourcing?

O Event Sourcing foi escolhido pelas seguintes razões:

1. **Auditoria completa**: Cada mudança no sistema é registrada como um evento imutável, proporcionando um histórico completo.

2. **Reconstrução de estado**: O estado atual pode ser reconstruído reproduzindo os eventos históricos.

3. **Capacidade temporal**: É possível determinar o estado do sistema em qualquer ponto do tempo.

4. **Desacoplamento**: Os eventos permitem um desacoplamento entre as ações e seus efeitos.

### Implementação do Event Sourcing

#### Eventos

Os eventos representam fatos ocorridos no sistema:

- `TransactionCreated`: Registra a criação de uma transação (depósito ou saque)

#### Projetores (Projectors)

Os projetores consomem eventos e atualizam modelos de leitura:

```typescript
@EventsHandler()
export class TransactionProjector implements IEventHandler<TransactionEvent> {
  // ...
  async handle(event: TransactionEvent) {
    if (event.type === 'DEPOSIT') {
      // Atualizar saldo em modelo de leitura
    } else if (event.type === 'WITHDRAW') {
      // Decrementar saldo em modelo de leitura
    }
  }
}
```

#### Armazenamento de Eventos

Os eventos são armazenados na tabela `events`, permitindo:

- Reconstrução do estado atual
- Análise histórica
- Diagnóstico de problemas

## Autenticação e Segurança

O sistema utiliza autenticação JWT com Auth0 para garantir a segurança das operações:

- Os tokens JWT são validados pelo `JwtStrategy`
- O `AuthGuard` protege rotas sensíveis
- A autorização baseada em claims do token determina o acesso

## Tecnologias Utilizadas

- **NestJS**: Framework para construção da aplicação
- **Fastify**: Server HTTP de alta performance
- **Prisma**: ORM para acesso ao banco de dados
- **SQLite**: Banco de dados relacional (pode ser substituído por PostgreSQL, MySQL etc.)
- **Jest**: Framework para testes unitários e de integração

## Benefícios da Arquitetura Adotada

1. **Manutenibilidade**: Código organizado em camadas facilita manutenção.

2. **Testabilidade**: Dependências claramente definidas facilitam mockar componentes nos testes.

3. **Escalabilidade**: CQRS permite escalar leitura e escrita independentemente.

4. **Observabilidade**: Event Sourcing proporciona histórico completo de todas as operações.

5. **Resiliência**: Eventos garantem que nenhuma transação seja perdida, mesmo em caso de falhas.

6. **Evolução**: A arquitetura modular facilita evoluir diferentes partes do sistema independentemente.

## Considerações sobre Consistência

A implementação utiliza consistência eventual:

- Commands validam regras de negócio e geram eventos
- Projectors consomem eventos e atualizam modelos de leitura
- Pode haver um pequeno delay entre a execução de um command e a atualização do modelo de leitura

Para operações que exigem consistência forte (como verificar saldo antes de um saque), utilizamos consulta direta ao modelo de eventos.

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

## Conclusão

A combinação de Clean Architecture, CQRS e Event Sourcing proporciona uma base sólida para um sistema bancário que é:

- **Robusto**: Capaz de lidar com falhas e manter a integridade dos dados
- **Escalável**: Pode crescer para acomodar aumento de usuários e transações
- **Auditável**: Mantém histórico completo de todas as operações
- **Evoluível**: Permite adaptar-se a novos requisitos sem redesenhar todo o sistema

Esta arquitetura é particularmente adequada para sistemas financeiros, onde rastreabilidade, segurança e integridade dos dados são críticos.
## Testando a Autenticação JWT com Auth0

Este projeto inclui um script utilitário para testar tokens JWT do Auth0, ajudando a diagnosticar problemas de autenticação.

### Como usar o script de teste JWT

1. Obtenha um token JWT do Auth0 (via sua aplicação frontend ou usando cURL para a API Auth0)
2. Execute o script fornecendo o token:

```bash
node scripts/test-jwt-auth.js YOUR_AUTH0_JWT_TOKEN
```

O script irá:
- Decodificar o token e exibir suas informações principais
- Verificar se o audience e issuer do token correspondem às configurações no `.env`
- Tentar chamar endpoints protegidos da API para verificar se o token é aceito
- Fornecer dicas de solução de problemas caso a autenticação falhe

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

4. **Logs de depuração**:
   - A JwtStrategy agora inclui logs detalhados que podem ajudar a identificar problemas
   - Verifique os logs do servidor para mensagens como "Audience incorreto" ou "Issuer incorreto"

### Ambiente de teste vs. produção

Para facilitar o desenvolvimento e testes automatizados, a JwtStrategy foi modificada para detectar automaticamente o ambiente:

- Em ambiente de produção: usa a configuração completa do Auth0 com JWKS
- Em ambiente de teste: usa uma chave simples para permitir tokens de teste

Para forçar o modo de teste, você pode definir a variável de ambiente:
```bash
NODE_ENV=test npm run start:dev
```
