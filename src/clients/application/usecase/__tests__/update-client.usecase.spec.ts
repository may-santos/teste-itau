import { Test, TestingModule } from '@nestjs/testing';
import { UpdateClientUseCase } from '../update-client.usecase';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { Client } from '../../../domain/entities/client.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateClientUseCase', () => {
  let useCase: UpdateClientUseCase;
  let repository: ClientRepository;

  const mockClient = new Client('1', 'Test Client', 'test@example.com');
  const updatedClient = new Client('1', 'Updated Client', 'updated@example.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateClientUseCase,
        {
          provide: ClientRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateClientUseCase>(UpdateClientUseCase);
    repository = module.get<ClientRepository>(ClientRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a client when found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(mockClient);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(updatedClient);

      const id = '1';
      const updateData = { name: 'Updated Client', email: 'updated@example.com' };

      const result = await useCase.execute(id, updateData);

      expect(repository.findById).toHaveBeenCalledWith(id);
      expect(repository.update).toHaveBeenCalledWith(id, expect.any(Client));
      expect(result).toEqual(updatedClient);
    });

    it('should update only the name when only name is provided', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(mockClient);
      const updatedNameOnly = new Client('1', 'Updated Client', 'test@example.com');
      jest.spyOn(repository, 'update').mockResolvedValueOnce(updatedNameOnly);

      const id = '1';
      const updateData = { name: 'Updated Client' };

      const result = await useCase.execute(id, updateData);

      expect(repository.findById).toHaveBeenCalledWith(id);
      expect(repository.update).toHaveBeenCalledWith(id, expect.any(Client));
      expect(result).toEqual(updatedNameOnly);
    });

    it('should update only the email when only email is provided', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(mockClient);
      const updatedEmailOnly = new Client('1', 'Test Client', 'updated@example.com');
      jest.spyOn(repository, 'update').mockResolvedValueOnce(updatedEmailOnly);

      const id = '1';
      const updateData = { email: 'updated@example.com' };

      const result = await useCase.execute(id, updateData);

      expect(repository.findById).toHaveBeenCalledWith(id);
      expect(repository.update).toHaveBeenCalledWith(id, expect.any(Client));
      expect(result).toEqual(updatedEmailOnly);
    });

    it('should throw NotFoundException when client is not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);

      const id = '999';
      const updateData = { name: 'Updated Client' };

      await expect(useCase.execute(id, updateData)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(id);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
