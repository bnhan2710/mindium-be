import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExchangeTokenCommand } from '../implements/exchange-token.command';
import { TokenPair } from '@modules/auth/domain/value-objects/token-pair.vo';
import { IOAuthProvider } from '@modules/auth/domain/ports/oauth/oauth-provider';
import { AuthService } from '@modules/auth/domain/services/authentication-domain.service';
import { Inject } from '@nestjs/common';
import { AUTH_DI_TOKENS } from '@modules/auth/auth.di-tokens';
import { USER_DI_TOKENS } from '@modules/users/user.di-tokens';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { TokenResponseDto } from '../../dtos';

@CommandHandler(ExchangeTokenCommand)
export class ExchangeTokenCommandHandler implements ICommandHandler<ExchangeTokenCommand> {
	constructor(
		@Inject(AUTH_DI_TOKENS.OAUTH_PROVIDER)
		private readonly oAuthProvider: IOAuthProvider,
		@Inject(USER_DI_TOKENS.USER_REPOSITORY)
		private readonly userRepository: IUserRepository,

		private readonly authService: AuthService,
	) {}
	async execute(command: ExchangeTokenCommand): Promise<TokenResponseDto> {
		const { code } = command;

		const idpToken = await this.oAuthProvider.exchangeAuthorizationCode(code);

		if (!idpToken || !idpToken.idToken || !idpToken.accessToken) {
			throw new UnauthorizedException('Invalid or expired authorization code');
		}

		const userProfile = await this.oAuthProvider.fetchProfile({
			idToken: idpToken.idToken,
			accessToken: idpToken.accessToken,
		});

		const user = await this.userRepository.createUserIfNotExists(
			userProfile.email,
			userProfile.name,
			userProfile.picture,
		);

		const tokenPair = await this.authService.createSessionAndTokens({
			id: user.getId().getValue(),
			email: user.getEmail(),
			name: user.getName(),
			picture: user.getAvatarUrl(),
		});

		return tokenPair;
	}
}
