import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import { CreateClientUseCase } from 'src/clients/application/usecase/create-client.usecase';
import { UpdateClientUseCase } from 'src/clients/application/usecase/update-client.usecase';
import { DeleteClientUseCase } from 'src/clients/application/usecase/delete-client.usecase';
import { FindAllClientsUseCase } from 'src/clients/application/usecase/find-all-clients.usecase';
import { FindClientByIdUsecase } from 'src/clients/application/usecase/find-client-by-id.usecase';
import { Client } from 'src/clients/domain/entities/client.entity';

describe('ClientController', () => {
  let controller: ClientController;
  let createClientUseCase: CreateClientUseCase;
  let updateClientUseCase: UpdateClientUseCase;
  let deleteClientUseCase: DeleteClientUseCase;
  let findAllClientsUseCase: FindAllClientsUseCase;
  let findClientByIdUseCase: FindClientByIdUsecase;

  const mockClient = new Client('1', 'Test Client', 'test@example.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: CreateClientUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockClient),
          },
        },
        {
          provide: UpdateClientUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockClient),
          },
        },
        {
          provide: DeleteClientUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: FindAllClientsUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue([mockClient]),
          },
        },
        {
          provide: FindClientByIdUsecase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockClient),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    createClientUseCase = module.get<CreateClientUseCase>(CreateClientUseCase);
    updateClientUseCase = module.get<UpdateClientUseCase>(UpdateClientUseCase);
    deleteClientUseCase = module.get<DeleteClientUseCase>(DeleteClientUseCase);
    findAllClientsUseCase = module.get<FindAllClientsUseCase>(
      FindAllClientsUseCase,
    );
    findClientByIdUseCase = module.get<FindClientByIdUsecase>(
      FindClientByIdUsecase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createDto = { name: 'Test Client', email: 'test@example.com' };

      await controller.create(createDto);

      expect(createClientUseCase.execute).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const id = '1';
      const updateDto = { name: 'Updated Client' };

      await controller.update(id, updateDto);

      expect(updateClientUseCase.execute).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a client', async () => {
      const id = '1';

      await controller.delete(id);

      expect(deleteClientUseCase.execute).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result = await controller.findAll();

      expect(findAllClientsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual([mockClient]);
    });
  });

  describe('findById', () => {
    it('should return a client by id', async () => {
      const id = '1';

      const result = await controller.findById(id);

      expect(findClientByIdUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockClient);
    });
  });
});
