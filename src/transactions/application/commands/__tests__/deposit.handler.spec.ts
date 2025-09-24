import { Test, TestingModule } from '@nestjs/testing';
import { DepositCommandHandler } from '../deposit.handler';
import { TransactionRepository } from '../../../infra/repositories/transaction.repository';
import { EventBus } from '@nestjs/cqrs/dist/event-bus';
import { DepositCommand } from '../deposit.command';

describe('DepositCommandHandler', () => {
  let handler: DepositCommandHandler;
  let repository: TransactionRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositCommandHandler,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DepositCommandHandler>(DepositCommandHandler);
    repository = module.get<TransactionRepository>(TransactionRepository);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should process a deposit transaction', async () => {
      const command = new DepositCommand('acc-123', 100, 'client-123');
      const transaction = {
        id: 'trans-123',
        type: 'DEPOSIT',
        amount: 100,
        clientId: 'client-123',
        createdAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockResolvedValue(transaction);

      const result = await handler.execute(command);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: expect.any(String),
          amount: expect.any(Number),
          clientId: expect.any(String),
          type: 'DEPOSIT',
        }),
      );
      expect(eventBus.publish).toHaveBeenCalledWith({
        type: 'DEPOSIT',
        amount: 100,
        clientId: 'client-123',
      });

      expect(result).toEqual({
        accountId: 'acc-123',
        clientId: 'client-123',
        type: 'DEPOSIT',
        amount: 100,
      });
    });

    it('should handle negative amount by converting to positive', async () => {
      const command = new DepositCommand('acc-123', 100, 'client-123');
      const transaction = {
        id: 'trans-123',
        type: 'DEPOSIT',
        amount: 100,
        clientId: 'client-123',
        createdAt: new Date(),
        accountId: 'acc-123',
      };

      jest.spyOn(repository, 'create').mockResolvedValue(transaction);

      const result = await handler.execute(command);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: 'acc-123',
          amount: 100,
          clientId: 'client-123',
          type: 'DEPOSIT',
        }),
      );
      expect(result.amount).toBe(100);
    });
  });
});
