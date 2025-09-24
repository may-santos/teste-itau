export class TransactionEvent {
  constructor(
    public readonly type: string,
    public readonly clientId: string,
    public readonly amount: number,
  ) {}
}
