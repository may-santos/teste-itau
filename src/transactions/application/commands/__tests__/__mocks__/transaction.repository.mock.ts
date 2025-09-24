export const mockTransactionRepository = {
  getBalance: jest.fn(),
  create: jest.fn(),
  findByAccount: jest.fn(),
  findByClientId: jest.fn(),
};
