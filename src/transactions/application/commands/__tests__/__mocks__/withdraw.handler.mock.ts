import { WithdrawCommand } from '../../withdraw.command';

export interface TransactionDto {
  id?: string;
  accountId: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  clientId: string;
  createdAt?: Date;
}

export class MockWithdrawHandler {
  constructor(
    private readonly repo: any,
    private readonly eventBus: any,
  ) {}

  async execute(command: WithdrawCommand) {
    const amount = Math.abs(command.amount);

    const balance = await this.repo.getBalance(command.clientId);
    if (balance < amount) throw new Error('Saldo insuficiente');

    const transaction: TransactionDto = {
      accountId: command.accountId,
      clientId: command.clientId,
      type: 'WITHDRAW',
      amount: amount,
    };

    await this.repo.create(transaction);

    this.eventBus.publish({
      type: 'TransactionCreated',
      transaction,
    });

    return transaction;
  }
}
