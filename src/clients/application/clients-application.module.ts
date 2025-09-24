import { Module } from '@nestjs/common';
import { CreateClientUseCase } from './usecase/create-client.usecase';
import { UpdateClientUseCase } from './usecase/update-client.usecase';
import { DeleteClientUseCase } from './usecase/delete-client.usecase';
import { FindAllClientsUseCase } from './usecase/find-all-clients.usecase';
import { FindClientByIdUsecase } from './usecase/find-client-by-id.usecase';
import { FindClientByEmailUseCase } from './usecase/find-client-by-email.usecase';
import { ClientsRepository } from '../infra/repositories/clients.repository';
import { ClientRepository } from '../domain/repositories/client.repository';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Module({
  providers: [
    CreateClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    FindAllClientsUseCase,
    FindClientByIdUsecase,
    FindClientByEmailUseCase,
    {
      provide: ClientRepository,
      useClass: ClientsRepository,
    },
    PrismaService,
  ],
  exports: [
    CreateClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    FindAllClientsUseCase,
    FindClientByIdUsecase,
    FindClientByEmailUseCase,
  ],
})
export class ClientsApplicationModule {}
