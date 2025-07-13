import { Session } from '../../domain/entities/session.entity';
import { TokenPair } from '../../domain/value-objects/token-pair.vo';
import { ISessionRepository } from '../../domain/ports/repositories/session.repository';
import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { AUTH_DI_TOKENS } from '@modules/auth/auth.di-tokens';
import { UserProfile } from '../../domain/ports/oauth/oauth-provider';
import { ITokenPort } from '@modules/auth/domain/ports/token/token.port';
@Injectable()
export class AuthService {
	constructor(
		@Inject(AUTH_DI_TOKENS.SESSION_REPOSITORY)
		private readonly sessionRepository: ISessionRepository,
		@Inject(AUTH_DI_TOKENS.TOKEN_PORT)
		private readonly tokenPort: ITokenPort,
	) {}

	async createSessionAndTokens(user: UserProfile): Promise<TokenPair> {
		const session = Session.create(user.id);
		await this.sessionRepository.save(session);

		const payload = {
			_id: user.id,
			sub: user.id,
			sid: session.getSessionId(),
		};

		const accessToken = await this.tokenPort.generateAccessToken(payload);
		const refreshToken = await this.tokenPort.generateRefreshToken(payload);

		return new TokenPair(accessToken, refreshToken, user.id);
	}
}
