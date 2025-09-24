import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { TransactionDto } from 'src/transactions/application/dto/transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: TransactionDto) {
    return this.prisma.event.create({
      data: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        clientId: transaction.clientId,
      },
    });
  }

  async findByAccount(clientId: string) {
    return this.prisma.event.findMany({
      where: { clientId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getBalance(clientId: string) {
    const transactions = await this.findByAccount(clientId);
    return {
      balance: transactions.reduce(
        (acc, t) => acc + (t.type === 'DEPOSIT' ? t.amount : -t.amount),
        0,
      ),
    };
  }

  async findByClientId(clientId: string) {
    return this.prisma.event.findMany({
      where: {
        clientId: clientId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
