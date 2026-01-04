export class AwardXpCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly source: string,
    public readonly reason?: string,
  ) {}
}
