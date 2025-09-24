import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/transactions/infra/repositories/transaction.repository';
import { DepositCommand } from './deposit.command';
import { TransactionDto } from '../dto/transaction.dto';
import { ICommandHandler, EventBus, CommandHandler } from '@nestjs/cqrs';
import { TransactionEvent } from '../projectors/transaction.event';

@Injectable()
@CommandHandler(DepositCommand)
export class DepositCommandHandler implements ICommandHandler<DepositCommand> {
  constructor(
    private readonly repo: TransactionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DepositCommand) {
    const transaction: TransactionDto = {
      accountId: command.accountId,
      clientId: command.clientId,
      type: 'DEPOSIT',
      amount: command.amount,
    };

    await this.repo.create(transaction);

    this.eventBus.publish(
      new TransactionEvent('DEPOSIT', transaction.clientId, transaction.amount),
    );

    return transaction;
  }
}
