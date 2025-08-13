import { Injectable } from '@nestjs/common';
import { ITokenPort } from '../../../domain/token/token.port';
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenAdapter implements ITokenPort {
	constructor(private readonly envFactory: EnvironmentKeyFactory) {}

	async generateAccessToken(payload: Record<string, any>): Promise<string> {
		return jwt.sign(payload, this.envFactory.getAuthConfig().jwtSecret, {
		expiresIn: this.envFactory.getAuthConfig().accessTokenExpiration,
		});
	}

	async generateRefreshToken(payload: Record<string, any>): Promise<string> {
		return jwt.sign(payload, this.envFactory.getAuthConfig().jwtSecret, {
			expiresIn: this.envFactory.getAuthConfig().refreshTokenExpiration,
		});
	}

	async verifyAccessToken(token: string): Promise<Record<string, any>> {
		return jwt.verify(token, this.envFactory.getAuthConfig().jwtSecret);
	}

	async verifyRefreshToken(token: string): Promise<Record<string, any>> {
		return jwt.verify(token, this.envFactory.getAuthConfig().jwtSecret);
	}
}
