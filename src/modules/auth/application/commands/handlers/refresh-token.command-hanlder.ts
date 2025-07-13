import { Injectable } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../implements/refresh-token.command';
import { ITokenPort } from '@modules/auth/domain/ports/token/token.port';
import { ISessionRepository } from '@modules/auth/domain/ports/repositories/session.repository';
import { UnauthorizedException } from '@nestjs/common';
import { AUTH_DI_TOKENS } from '@modules/auth/auth.di-tokens';
import { TokenPair } from '@modules/auth/domain/value-objects/token-pair.vo';
import { Inject } from '@nestjs/common';

@CommandHandler(RefreshTokenCommand)
@Injectable()
export class RefreshTokenCommandHanlder implements ICommandHandler<RefreshTokenCommand> {
	constructor(
		@Inject(AUTH_DI_TOKENS.TOKEN_PORT)
		private readonly tokenPort: ITokenPort,
		@Inject(AUTH_DI_TOKENS.SESSION_REPOSITORY)
		private readonly sessionRepository: ISessionRepository,
	) {}

	async execute(command: RefreshTokenCommand): Promise<TokenPair> {
		const { refreshToken } = command;

		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token is required');
		}

		const jwtClaims = await this.tokenPort.verifyRefreshToken(refreshToken);
		if (!jwtClaims || !jwtClaims['sid'] || !jwtClaims['sub']) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		const sessionId = jwtClaims['sid'];
		const subject = jwtClaims['sub'];
		const session = await this.sessionRepository.findBySessionId(sessionId);
		if (!session) {
			throw new UnauthorizedException('Session not found');
		}

		const jwtPayload = {
			_id: subject,
			sub: subject,
			sid: sessionId,
		};

		const newAcessToken = await this.tokenPort.generateAccessToken(jwtPayload);
		const newRefreshToken = await this.tokenPort.generateRefreshToken(jwtPayload);
		return new TokenPair(newAcessToken, newRefreshToken, subject);
	}
}
