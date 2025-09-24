import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionRepository } from 'src/transactions/infra/repositories/transaction.repository';
import { GetAccountBalanceQuery } from './get-account-balance.query';

@QueryHandler(GetAccountBalanceQuery)
export class GetAccountBalanceHandler
  implements IQueryHandler<GetAccountBalanceQuery>
{
  constructor(private readonly repo: TransactionRepository) {}

  async execute(query: GetAccountBalanceQuery) {
    return this.repo.getBalance(query.accountId);
  }
}
