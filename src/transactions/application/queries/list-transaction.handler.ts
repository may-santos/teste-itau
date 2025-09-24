import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionRepository } from 'src/transactions/infra/repositories/transaction.repository';
import { ListTransactionsQuery } from './list-transaction.query';

@QueryHandler(ListTransactionsQuery)
export class ListTransactionsHandler
  implements IQueryHandler<ListTransactionsQuery>
{
  constructor(private readonly repo: TransactionRepository) {}

  async execute(query: ListTransactionsQuery) {
    return this.repo.findByAccount(query.accountId);
  }
}
