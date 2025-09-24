import { WithdrawCommand } from '../withdraw.command';
import { mockTransactionRepository } from './__mocks__/transaction.repository.mock';
import { mockEventBus } from './__mocks__/event-bus.mock';
import { MockWithdrawHandler } from './__mocks__/withdraw.handler.mock';

describe('WithdrawHandler', () => {
  let handler: MockWithdrawHandler;
  let repository: any;
  let eventBus: any;

  beforeEach(() => {
    repository = { ...mockTransactionRepository };
    eventBus = { ...mockEventBus };
    handler = new MockWithdrawHandler(repository, eventBus);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should process a valid withdrawal', async () => {
      const command = new WithdrawCommand('acc-123', 50, 'client-123');
      const transactionInput = {
        accountId: 'acc-123',
        type: 'WITHDRAW',
        amount: 50,
        clientId: 'client-123',
      };

      const transactionOutput = {
        ...transactionInput,
        id: 'trans-123',
        createdAt: new Date(),
      };

      jest.spyOn(repository, 'getBalance').mockResolvedValue(100);
      jest.spyOn(repository, 'create').mockResolvedValue(transactionOutput);

      const result = await handler.execute(command);

      expect(repository.getBalance).toHaveBeenCalledWith(command.clientId);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: command.accountId,
          type: 'WITHDRAW',
          amount: command.amount,
          clientId: command.clientId,
        }),
      );
      expect(eventBus.publish).toHaveBeenCalledWith({
        type: 'TransactionCreated',
        transaction: expect.any(Object),
      });
      expect(result).toEqual(expect.objectContaining(transactionInput));
    });

    it('should throw error when insufficient balance', async () => {
      const command = new WithdrawCommand('acc-123', 150, 'client-123');

      jest.spyOn(repository, 'getBalance').mockResolvedValue(100);

      await expect(handler.execute(command)).rejects.toThrow(
        'Saldo insuficiente',
      );
      expect(repository.getBalance).toHaveBeenCalledWith(command.clientId);
      expect(repository.create).not.toHaveBeenCalled();
      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should allow withdrawal when balance equals amount', async () => {
      const command = new WithdrawCommand('acc-123', 100, 'client-123');
      const transactionInput = {
        accountId: 'acc-123',
        type: 'WITHDRAW',
        amount: 100,
        clientId: 'client-123',
      };

      const transactionOutput = {
        ...transactionInput,
        id: 'trans-123',
        createdAt: new Date(),
      };

      jest.spyOn(repository, 'getBalance').mockResolvedValue(100);
      jest.spyOn(repository, 'create').mockResolvedValue(transactionOutput);

      const result = await handler.execute(command);

      expect(repository.getBalance).toHaveBeenCalledWith(command.clientId);
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(transactionInput));
    });

    it('should handle positive amount correctly', async () => {
      const command = new WithdrawCommand('acc-123', 50, 'client-123');
      const transactionInput = {
        accountId: 'acc-123',
        type: 'WITHDRAW',
        amount: 50,
        clientId: 'client-123',
      };

      const transactionOutput = {
        ...transactionInput,
        id: 'trans-123',
        createdAt: new Date(),
      };

      jest.spyOn(repository, 'getBalance').mockResolvedValue(100);
      jest.spyOn(repository, 'create').mockResolvedValue(transactionOutput);

      const result = await handler.execute(command);

      expect(result.amount).toBe(50);
    });

    it('should handle negative amount by making it positive', async () => {
      const command = new WithdrawCommand('acc-123', -30, 'client-123');
      const transactionInput = {
        accountId: 'acc-123',
        type: 'WITHDRAW',
        amount: 30,
        clientId: 'client-123',
      };

      const transactionOutput = {
        ...transactionInput,
        id: 'trans-123',
        createdAt: new Date(),
      };

      jest.spyOn(repository, 'getBalance').mockResolvedValue(100);
      jest.spyOn(repository, 'create').mockResolvedValue(transactionOutput);

      const result = await handler.execute(command);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 30,
        }),
      );
      expect(result.amount).toBe(30);
    });
  });
});
