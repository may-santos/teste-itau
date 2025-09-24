import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from 'src/clients/domain/entities/client.entity';
import { ClientRepository } from 'src/clients/domain/repositories/client.repository';

@Injectable()
export class FindClientByIdUsecase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: string): Promise<Client | null> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return new Client(client.id, client.getName(), client.getEmail());
  }
}
