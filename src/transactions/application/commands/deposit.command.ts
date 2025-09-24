export class DepositCommand {
  constructor(
    public readonly accountId: string,
    public readonly amount: number,
    public readonly clientId: string,
  ) {}
}
