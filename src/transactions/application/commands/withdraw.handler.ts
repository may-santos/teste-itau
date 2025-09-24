import { Injectable } from '@nestjs/common';
import { WithdrawCommand } from './withdraw.command';
import { TransactionRepository } from 'src/transactions/infra/repositories/transaction.repository';
import { TransactionDto } from '../dto/transaction.dto';
import { EventBus, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { TransactionEvent } from '../projectors/transaction.event';

@Injectable()
@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand> {
  constructor(
    private readonly repo: TransactionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: WithdrawCommand) {
    const amount = Math.abs(command.amount);

    const { balance } = await this.repo.getBalance(command.clientId);
    if (balance < amount) throw new Error('Saldo insuficiente');

    const transaction: TransactionDto = {
      accountId: command.accountId,
      clientId: command.clientId,
      type: 'WITHDRAW',
      amount: amount,
    };

    await this.repo.create(transaction);

    this.eventBus.publish(
      new TransactionEvent(
        'WITHDRAW',
        transaction.clientId,
        transaction.amount,
      ),
    );

    return transaction;
  }
}
