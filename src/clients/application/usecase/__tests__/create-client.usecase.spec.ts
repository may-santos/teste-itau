import { Test, TestingModule } from '@nestjs/testing';
import { CreateClientUseCase } from '../create-client.usecase';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { Client } from '../../../domain/entities/client.entity';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let repository: ClientRepository;

  const mockClient = new Client('1', 'Test Client', 'test@example.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClientUseCase,
        {
          provide: ClientRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockClient),
            findByEmail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateClientUseCase>(CreateClientUseCase);
    repository = module.get<ClientRepository>(ClientRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a client successfully', async () => {
      const createDto = { name: 'Test Client', email: 'test@example.com' };
      
      const result = await useCase.execute(createDto);
      
      expect(repository.findByEmail).toHaveBeenCalledWith(createDto.email);
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(mockClient);
    });

    it('should throw an error if client with the same email already exists', async () => {
      const createDto = { name: 'Test Client', email: 'test@example.com' };
      
      jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(mockClient);
      
      await expect(useCase.execute(createDto)).rejects.toThrow();
      expect(repository.findByEmail).toHaveBeenCalledWith(createDto.email);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});
