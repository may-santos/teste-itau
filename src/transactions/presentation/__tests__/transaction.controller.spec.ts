import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindClientByEmailUseCase } from 'src/clients/application/usecase/find-client-by-email.usecase';
import { Client } from 'src/clients/domain/entities/client.entity';
import { DepositCommand } from '../../application/commands/deposit.command';
import { WithdrawCommand } from '../../application/commands/withdraw.command';
import { GetAccountBalanceQuery } from '../../application/queries/get-account-balance.query';
import { ListTransactionsQuery } from '../../application/queries/list-transaction.query';

describe('TransactionController', () => {
  let controller: TransactionController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let findClientByEmailUseCase: FindClientByEmailUseCase;

  const mockClient = new Client(
    'client-123',
    'Test Client',
    'test@example.com',
  );
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
  const mockBalance = 150;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindClientByEmailUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    findClientByEmailUseCase = module.get<FindClientByEmailUseCase>(
      FindClientByEmailUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('should handle deposit successfully', async () => {
      const body = { amount: 100 };
      const req = { user: { email: 'test@example.com' } };

      jest
        .spyOn(findClientByEmailUseCase, 'execute')
        .mockResolvedValueOnce(mockClient);
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({
        id: 'trans-3',
        type: 'DEPOSIT',
        amount: 100,
        accountId: mockClient.id,
        clientId: mockClient.id,
      });

      const result = await controller.deposit(body, req);

      expect(findClientByEmailUseCase.execute).toHaveBeenCalledWith(
        req.user.email,
      );
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DepositCommand),
      );
      expect(result).toBeDefined();
    });
  });

  describe('withdraw', () => {
    it('should handle withdraw successfully', async () => {
      const body = { amount: 50 };
      const req = { user: { email: 'test@example.com' } };

      jest
        .spyOn(findClientByEmailUseCase, 'execute')
        .mockResolvedValueOnce(mockClient);
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce({
        id: 'trans-4',
        type: 'WITHDRAW',
        amount: 50,
        accountId: mockClient.id,
        clientId: mockClient.id,
      });

      const result = await controller.withdraw(body, req);

      expect(findClientByEmailUseCase.execute).toHaveBeenCalledWith(
        req.user.email,
      );
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(WithdrawCommand),
      );
      expect(result).toBeDefined();
    });
  });

  describe('getBalance', () => {
    it('should return account balance', async () => {
      const req = { user: { email: 'test@example.com' } };

      jest
        .spyOn(findClientByEmailUseCase, 'execute')
        .mockResolvedValueOnce(mockClient);
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(mockBalance);

      const result = await controller.getBalance(req);

      expect(findClientByEmailUseCase.execute).toHaveBeenCalledWith(
        req.user.email,
      );
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetAccountBalanceQuery(mockClient.id),
      );
      expect(result).toBe(mockBalance);
    });
  });

  describe('getTransactions', () => {
    it('should return all transactions for authenticated client', async () => {
      const req = { user: { email: 'test@example.com' } };

      jest
        .spyOn(findClientByEmailUseCase, 'execute')
        .mockResolvedValueOnce(mockClient);
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(mockTransactions);

      const result = await controller.getTransactions(req);

      expect(findClientByEmailUseCase.execute).toHaveBeenCalledWith(
        req.user.email,
      );
      expect(queryBus.execute).toHaveBeenCalledWith(
        new ListTransactionsQuery(mockClient.id),
      );
      expect(result).toEqual(mockTransactions);
    });
  });
});
