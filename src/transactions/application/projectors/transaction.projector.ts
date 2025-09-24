import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { TransactionEvent } from './transaction.event';

@EventsHandler(TransactionEvent)
export class TransactionProjector implements IEventHandler<TransactionEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: TransactionEvent) {
    if (event.type === 'DEPOSIT') {
      await this.prisma.accountBalance.upsert({
        where: { accountId: event.clientId },
        update: { balance: { increment: event.amount } },
        create: {
          accountId: event.clientId,
          balance: event.amount,
        },
      });
    } else if (event.type === 'WITHDRAW') {
      await this.prisma.accountBalance.update({
        where: { accountId: event.clientId },
        data: { balance: { decrement: event.amount } },
      });
    }
  }
}
