import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateClientUseCase } from 'src/clients/application/usecase/create-client.usecase';
import { DeleteClientUseCase } from 'src/clients/application/usecase/delete-client.usecase';
import { FindAllClientsUseCase } from 'src/clients/application/usecase/find-all-clients.usecase';
import { FindClientByIdUsecase } from 'src/clients/application/usecase/find-client-by-id.usecase';
import { UpdateClientUseCase } from 'src/clients/application/usecase/update-client.usecase';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly deleteClient: DeleteClientUseCase,
    private readonly findAllClients: FindAllClientsUseCase,
    private readonly findClientById: FindClientByIdUsecase,
  ) {}

  @Post()
  async create(@Body() body: { name: string; email: string }) {
    return this.createClient.execute(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.updateClient.execute(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteClient.execute(id);
  }

  @Get()
  async findAll() {
    return this.findAllClients.execute();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.findClientById.execute(id);
  }
}
