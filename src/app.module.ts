import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './common/auth/auth.module';

@Module({
  imports: [ClientsModule, TransactionsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
