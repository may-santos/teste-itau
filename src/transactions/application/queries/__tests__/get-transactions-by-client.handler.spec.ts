import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionsByClientHandler } from '../get-transactions-by-client.handler';
import { GetTransactionsByClientQuery } from '../get-transactions-by-client.query';
import { TransactionRepository } from '../../../infra/repositories/transaction.repository';

describe('GetTransactionsByClientHandler', () => {
  let handler: GetTransactionsByClientHandler;
  let repository: TransactionRepository;

  const mockTransactions = [
    {
      id: 'trans-1',
      type: 'DEPOSIT',
      amount: 100,
      clientId: 'client-123',
      createdAt: new Date(),
    },
    {
      id: 'trans-2',
      type: 'WITHDRAW',
      amount: 50,
      clientId: 'client-123',
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionsByClientHandler,
        {
          provide: TransactionRepository,
          useValue: {
            findByClientId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetTransactionsByClientHandler>(GetTransactionsByClientHandler);
    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should return transactions for a client', async () => {
      const query = new GetTransactionsByClientQuery('client-123');
      
      jest.spyOn(repository, 'findByClientId').mockResolvedValue(mockTransactions);
      
      const result = await handler.execute(query);
      
      expect(repository.findByClientId).toHaveBeenCalledWith('client-123');
      expect(result).toEqual(mockTransactions);
    });
    
    it('should return empty array when no transactions exist', async () => {
      const query = new GetTransactionsByClientQuery('empty-client');
      
      jest.spyOn(repository, 'findByClientId').mockResolvedValue([]);
      
      const result = await handler.execute(query);
      
      expect(repository.findByClientId).toHaveBeenCalledWith('empty-client');
      expect(result).toEqual([]);
    });
  });
});
