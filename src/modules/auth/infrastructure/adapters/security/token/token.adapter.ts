import { Injectable } from '@nestjs/common';
import { ITokenPort } from '../../../../domain/ports/token/token.port';
import { EnvironmentKeyFactory } from '@shared/services';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenAdapter implements ITokenPort {
	constructor(private readonly envFactory: EnvironmentKeyFactory) {}

	async generateAccessToken(payload: Record<string, any>): Promise<string> {
		return jwt.sign(payload, this.envFactory.getJwtConfig().secret, {
			expiresIn: this.envFactory.getAccessTokenExpiration(),
		});
	}

	async generateRefreshToken(payload: Record<string, any>): Promise<string> {
		return jwt.sign(payload, this.envFactory.getJwtConfig().secret, {
			expiresIn: this.envFactory.getRefreshTokenExpiration(),
		});
	}

	async verifyAccessToken(token: string): Promise<Record<string, any>> {
		return jwt.verify(token, this.envFactory.getJwtConfig().secret);
	}

	async verifyRefreshToken(token: string): Promise<Record<string, any>> {
		return jwt.verify(token, this.envFactory.getJwtConfig().secret);
	}
}
