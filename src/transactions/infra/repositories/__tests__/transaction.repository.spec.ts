import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from '../transaction.repository';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { TransactionDto } from 'src/transactions/application/dto/transaction.dto';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;

  const mockPrismaClient = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const transaction: TransactionDto = {
        accountId: 'acc-123',
        clientId: 'client-123',
        type: 'DEPOSIT',
        amount: 100,
      };

      const mockCreatedEvent = {
        id: 'event-123',
        type: 'DEPOSIT',
        amount: 100,
        clientId: 'client-123',
        createdAt: new Date(),
      };

      mockPrismaClient.event.create.mockResolvedValue(mockCreatedEvent);

      const result = await repository.create(transaction);

      expect(mockPrismaClient.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: transaction.type,
          amount: transaction.amount,
          clientId: transaction.clientId,
        }),
      });
      expect(result).toEqual(mockCreatedEvent);
    });
  });

  describe('findByAccount', () => {
    it('should find transactions by client ID', async () => {
      const clientId = 'client-123';

      const mockEvents = [
        {
          id: 'event-123',
          type: 'DEPOSIT',
          amount: 100,
          clientId: 'client-123',
          createdAt: new Date(),
        },
        {
          id: 'event-456',
          type: 'WITHDRAW',
          amount: 50,
          clientId: 'client-123',
          createdAt: new Date(),
        },
      ];

      mockPrismaClient.event.findMany.mockResolvedValue(mockEvents);

      const result = await repository.findByAccount(clientId);

      expect(mockPrismaClient.event.findMany).toHaveBeenCalledWith({
        where: { clientId },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(mockEvents);
    });
  });

  describe('findByClientId', () => {
    it('should find transactions by client ID', async () => {
      const clientId = 'client-123';

      const mockEvents = [
        {
          id: 'event-123',
          type: 'DEPOSIT',
          amount: 100,
          clientId: 'client-123',
          createdAt: new Date(),
        },
        {
          id: 'event-456',
          type: 'WITHDRAW',
          amount: 50,
          clientId: 'client-123',
          createdAt: new Date(),
        },
      ];

      mockPrismaClient.event.findMany.mockResolvedValue(mockEvents);

      const result = await repository.findByClientId(clientId);

      expect(mockPrismaClient.event.findMany).toHaveBeenCalledWith({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getBalance', () => {
    it('should calculate balance correctly from transactions', async () => {
      const clientId = 'client-123';

      const mockEvents = [
        {
          id: 'event-123',
          type: 'DEPOSIT',
          amount: 100,
          clientId: 'client-123',
          createdAt: new Date(),
        },
        {
          id: 'event-456',
          type: 'WITHDRAW',
          amount: 50,
          clientId: 'client-123',
          createdAt: new Date(),
        },
        {
          id: 'event-789',
          type: 'DEPOSIT',
          amount: 25,
          clientId: 'client-123',
          createdAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'findByAccount').mockResolvedValue(mockEvents);

      const result = await repository.getBalance(clientId);

      expect(repository.findByAccount).toHaveBeenCalledWith(clientId);
      expect(result).toEqual({ balance: 75 });
    });

    it('should return zero for an account with no transactions', async () => {
      const clientId = 'empty-account';

      jest.spyOn(repository, 'findByAccount').mockResolvedValue([]);

      const result = await repository.getBalance(clientId);

      expect(repository.findByAccount).toHaveBeenCalledWith(clientId);
      expect(result).toEqual({ balance: 0 });
    });
  });
});
