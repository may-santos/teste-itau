import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { Client } from '../../domain/entities/client.entity';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Injectable()
export class ClientsRepository implements ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    return client ? new Client(client.id, client.name, client.email) : null;
  }

  async findAll(): Promise<Client[]> {
    const clients = await this.prisma.client.findMany();
    return clients.map((c) => new Client(c.id, c.name, c.email));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }

  async create(client: Client): Promise<Client> {
    const created = await this.prisma.client.create({
      data: {
        name: client.getName(),
        email: client.getEmail(),
      },
    });
    return new Client(created.id, created.name, created.email);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { email },
    });
    if (!client) return null;
    return new Client(client.id, client.name, client.email);
  }

  async update(id: string, client: Client): Promise<Client> {
    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        name: client.getName(),
        email: client.getEmail(),
      },
    });
    return new Client(updated.id, updated.name, updated.email);
  }
}
