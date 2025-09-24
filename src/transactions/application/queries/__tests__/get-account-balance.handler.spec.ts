import { Test, TestingModule } from '@nestjs/testing';
import { GetAccountBalanceHandler } from '../get-account-balance.handler';
import { GetAccountBalanceQuery } from '../get-account-balance.query';
import { TransactionRepository } from '../../../infra/repositories/transaction.repository';

describe('GetAccountBalanceHandler', () => {
  let handler: GetAccountBalanceHandler;
  let repository: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAccountBalanceHandler,
        {
          provide: TransactionRepository,
          useValue: {
            getBalance: jest.fn(),
            create: jest.fn(),
            findByAccountId: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetAccountBalanceHandler>(GetAccountBalanceHandler);
    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should return account balance', async () => {
      const query = new GetAccountBalanceQuery('client-123');
      const mockBalance = { balance: 1000 };

      jest.spyOn(repository, 'getBalance').mockResolvedValue(mockBalance);

      const result = await handler.execute(query);

      expect(repository.getBalance).toHaveBeenCalledWith('client-123');
      expect(result).toBe(mockBalance);
    });

    it('should return 0 when account has no balance', async () => {
      const query = new GetAccountBalanceQuery('empty-account');

      jest.spyOn(repository, 'getBalance').mockResolvedValue({ balance: 0 });

      const result = await handler.execute(query);

      expect(repository.getBalance).toHaveBeenCalledWith('empty-account');
      expect(result).toEqual({ balance: 0 });
    });
  });
});
