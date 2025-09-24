export class TransactionDto {
  id?: string;
  accountId: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  clientId: string;
  createdAt?: Date;
}
