import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from '../../domain/repositories/client.repository';

@Injectable()
export class UpdateClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: string, input: { name?: string; email?: string }) {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    if (input.name) {
      client.changeName(input.name);
    }

    if (input.email) {
      client.changeEmail(input.email);
    }

    return this.clientRepository.update(id, client);
  }
}
