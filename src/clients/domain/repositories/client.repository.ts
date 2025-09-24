import { Client } from '../entities/client.entity';

export abstract class ClientRepository {
  abstract create(client: Client): Promise<Client>;
  abstract findAll(): Promise<Client[]>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract update(id: string, client: Client): Promise<Client>;
  abstract delete(id: string): Promise<void>;
}
