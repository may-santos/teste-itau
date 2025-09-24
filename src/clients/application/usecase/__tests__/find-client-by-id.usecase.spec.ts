import { Test, TestingModule } from '@nestjs/testing';
import { FindClientByIdUsecase } from '../find-client-by-id.usecase';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { Client } from '../../../domain/entities/client.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindClientByIdUsecase', () => {
  let useCase: FindClientByIdUsecase;
  let repository: ClientRepository;

  const mockClient = new Client('1', 'Test Client', 'test@example.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindClientByIdUsecase,
        {
          provide: ClientRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindClientByIdUsecase>(FindClientByIdUsecase);
    repository = module.get<ClientRepository>(ClientRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a client when found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(mockClient);

      const result = await useCase.execute('1');

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException when client is not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

      await expect(useCase.execute('999')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('999');
    });
  });
});
