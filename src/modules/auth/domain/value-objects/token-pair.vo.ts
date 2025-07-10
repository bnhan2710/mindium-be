export class TokenPair {
	constructor(
		public readonly accessToken: string,
		public readonly refreshToken: string,
		public readonly sub: string,
	) {}

	static create(accessToken: string, refreshToken: string, sub: string): TokenPair {
		return new TokenPair(accessToken, refreshToken, sub);
	}
}
