import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { TransactionController } from './presentation/transaction.controller';
import { DepositCommandHandler } from './application/commands/deposit.handler';
import { ListTransactionsHandler } from './application/queries/list-transaction.handler';
import { TransactionRepository } from './infra/repositories/transaction.repository';
import { TransactionProjector } from './application/projectors/transaction.projector';
import { GetTransactionsByClientHandler } from './application/queries/get-transactions-by-client.handler';
import { GetAccountBalanceHandler } from './application/queries/get-account-balance.handler';
import { ClientsApplicationModule } from 'src/clients/application/clients-application.module';
import { WithdrawHandler } from './application/commands/withdraw.handler';

export const CommandHandlers = [DepositCommandHandler, WithdrawHandler];
export const QueryHandlers = [
  ListTransactionsHandler,
  GetTransactionsByClientHandler,
  GetAccountBalanceHandler,
];
export const Projectors = [TransactionProjector];

@Module({
  imports: [CqrsModule, PrismaModule, ClientsApplicationModule],
  controllers: [TransactionController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...Projectors,
    TransactionRepository,
  ],
})
export class TransactionsModule {}
