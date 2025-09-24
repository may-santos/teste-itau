import { Module } from '@nestjs/common';
import { ClientController } from './presentation/controllers/client.controller';
import { ClientsApplicationModule } from './application/clients-application.module';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  imports: [ClientsApplicationModule, AuthModule],
  controllers: [ClientController],
})
export class ClientsModule {}
