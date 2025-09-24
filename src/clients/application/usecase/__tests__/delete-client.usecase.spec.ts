import { Test, TestingModule } from '@nestjs/testing';
import { DeleteClientUseCase } from '../delete-client.usecase';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { Client } from '../../../domain/entities/client.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteClientUseCase', () => {
  let useCase: DeleteClientUseCase;
  let repository: ClientRepository;

  const mockClient = new Client('1', 'Test Client', 'test@example.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteClientUseCase,
        {
          provide: ClientRepository,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteClientUseCase>(DeleteClientUseCase);
    repository = module.get<ClientRepository>(ClientRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a client when found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(mockClient);
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await useCase.execute('1');

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when client is not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

      await expect(useCase.execute('999')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('999');
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
