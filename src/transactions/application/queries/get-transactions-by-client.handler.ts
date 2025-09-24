import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionRepository } from 'src/transactions/infra/repositories/transaction.repository';
import { GetTransactionsByClientQuery } from './get-transactions-by-client.query';

@QueryHandler(GetTransactionsByClientQuery)
export class GetTransactionsByClientHandler
  implements IQueryHandler<GetTransactionsByClientQuery>
{
  constructor(private readonly repository: TransactionRepository) {}

  async execute(query: GetTransactionsByClientQuery) {
    return this.repository.findByClientId(query.clientId);
  }
}
