export class UserProfile {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly picture?: string,
  ) {}
}