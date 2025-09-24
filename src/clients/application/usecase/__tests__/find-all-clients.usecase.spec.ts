import { Test, TestingModule } from '@nestjs/testing';
import { FindAllClientsUseCase } from '../find-all-clients.usecase';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { Client } from '../../../domain/entities/client.entity';

describe('FindAllClientsUseCase', () => {
  let useCase: FindAllClientsUseCase;
  let repository: ClientRepository;

  const mockClients = [
    new Client('1', 'Client 1', 'client1@example.com'),
    new Client('2', 'Client 2', 'client2@example.com'),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllClientsUseCase,
        {
          provide: ClientRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllClientsUseCase>(FindAllClientsUseCase);
    repository = module.get<ClientRepository>(ClientRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all clients', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce(mockClients);

      const result = await useCase.execute();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockClients);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no clients exist', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValueOnce([]);

      const result = await useCase.execute();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
});
