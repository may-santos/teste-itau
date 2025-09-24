import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { Client } from '../../domain/entities/client.entity';

@Injectable()
export class CreateClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: { name: string; email: string }) {
    const client = new Client(null, input.name, input.email);
    const existingClient = await this.clientRepository.findByEmail(
      client.getEmail(),
    );
    if (existingClient) {
      throw new Error('Client with this email already exists');
    }
    return this.clientRepository.create(client);
  }
}
