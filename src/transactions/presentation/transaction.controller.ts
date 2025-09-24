import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DepositCommand } from '../application/commands/deposit.command';
import { WithdrawCommand } from '../application/commands/withdraw.command';
import { GetAccountBalanceQuery } from '../application/queries/get-account-balance.query';
import { ListTransactionsQuery } from '../application/queries/list-transaction.query';
import { JwtAuthGuard } from 'src/common/auth/guard/auth.guard';
import { FindClientByEmailUseCase } from 'src/clients/application/usecase/find-client-by-email.usecase';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly findClientByEmailUseCase: FindClientByEmailUseCase,
  ) {}

  @Post('deposit')
  async deposit(@Body() body: { amount: number }, @Request() req) {
    const userEmail = req.user.email;
    const client = await this.findClientByEmailUseCase.execute(userEmail);
    return this.commandBus.execute(
      new DepositCommand(client.id, body.amount, client.id),
    );
  }

  @Post('withdraw')
  async withdraw(@Body() body: { amount: number }, @Request() req) {
    const userEmail = req.user.email;
    const client = await this.findClientByEmailUseCase.execute(userEmail);
    return this.commandBus.execute(
      new WithdrawCommand(client.id, body.amount, client.id),
    );
  }

  @Get('balance')
  async getBalance(@Request() req) {
    const userEmail = req.user.email;
    const client = await this.findClientByEmailUseCase.execute(userEmail);
    return this.queryBus.execute(new GetAccountBalanceQuery(client.id));
  }

  @Get()
  async getTransactions(@Request() req) {
    const userEmail = req.user.email;
    const client = await this.findClientByEmailUseCase.execute(userEmail);
    return this.queryBus.execute(new ListTransactionsQuery(client.id));
  }
}
