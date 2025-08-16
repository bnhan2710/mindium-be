export interface ITokenPort {
	generateAccessToken(payload: Record<string, any>): Promise<string>;
	generateRefreshToken(payload: Record<string, any>): Promise<string>;
	verifyAccessToken(token: string): Promise<Record<string, any>>;
	verifyRefreshToken(token: string): Promise<Record<string, any>>;
}
