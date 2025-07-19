import { LogoutCommand } from '../implements/logout.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ITokenPort } from '@modules/auth/domain/ports/token/token.port';
import { Inject } from '@nestjs/common';
import { AUTH_TOKENS } from '@modules/auth/auth.tokens';
import { ISessionRepository } from '@modules/auth/domain/ports/repositories/session.repository';
import { UnauthorizedException } from '@nestjs/common';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
	constructor(
		@Inject(AUTH_TOKENS.TOKEN_PORT)
		private readonly tokenPort: ITokenPort,
		@Inject(AUTH_TOKENS.SESSION_REPOSITORY)
		private readonly sessionRepository: ISessionRepository,
	) {}

	async execute(command: LogoutCommand): Promise<void> {
		const { refreshToken } = command;

		const jwtClaims = await this.tokenPort.verifyRefreshToken(refreshToken);
		if (!jwtClaims || !jwtClaims['sid'] || !jwtClaims['sub']) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		const sessionId = jwtClaims['sid'];
		const session = await this.sessionRepository.findBySessionId(sessionId);
		if (!session) {
			throw new UnauthorizedException('Session not found');
		}
		await this.sessionRepository.deleteBySessionId(sessionId);
	}
}
