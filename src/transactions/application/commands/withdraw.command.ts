export class WithdrawCommand {
  constructor(
    public readonly accountId: string,
    public readonly amount: number,
    public readonly clientId: string,
  ) {}
}
