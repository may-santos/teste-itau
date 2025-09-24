import { Test, TestingModule } from '@nestjs/testing';
import { FindClientByEmailUseCase } from '../find-client-by-email.usecase';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { Client } from '../../../domain/entities/client.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindClientByEmailUseCase', () => {
  let useCase: FindClientByEmailUseCase;
  let repository: ClientRepository;

  const mockClient = new Client('1', 'Test Client', 'test@example.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindClientByEmailUseCase,
        {
          provide: ClientRepository,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindClientByEmailUseCase>(FindClientByEmailUseCase);
    repository = module.get<ClientRepository>(ClientRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a client when found by email', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(mockClient);

      const result = await useCase.execute('test@example.com');

      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException when client is not found by email', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(null);

      await expect(useCase.execute('nonexistent@example.com')).rejects.toThrow(NotFoundException);
      expect(repository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });
  });
});
