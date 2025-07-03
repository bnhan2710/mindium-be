export interface ITokenPort {
  generateAccessToken(payload: any): string;
  generateRefreshToken(payload: any): string;
}