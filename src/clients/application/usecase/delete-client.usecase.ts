import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from '../../domain/repositories/client.repository';

@Injectable()
export class DeleteClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: string): Promise<void> {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    await this.clientRepository.delete(id);
  }
}
