import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from '../../domain/repositories/client.repository';

@Injectable()
export class FindClientByEmailUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(email: string) {
    const client = await this.clientRepository.findByEmail(email);
    if (!client) {
      throw new NotFoundException(`Client with email ${email} not found`);
    }
    return client;
  }
}
