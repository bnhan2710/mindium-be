import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs'; // Thêm ICommandBus
import { ExchangeTokenCommand } from '../implements/exchange-token.command';
import { IOAuthProvider } from '@modules/auth/domain/ports/oauth/oauth-provider';
import { AuthService } from '@modules/auth/domain/services/authentication-domain.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { AUTH_TOKENS } from '@modules/auth/auth.tokens';
import { TokenResponseDto } from '../../dtos';
import { CreateUserIfNotExistCommand } from '@modules/users/application/commands/implements/create-user-if-not-exist.command';
import { User } from '@modules/users/domain/entities/user.entity';
@CommandHandler(ExchangeTokenCommand)
export class ExchangeTokenCommandHandler
	implements ICommandHandler<ExchangeTokenCommand>
{
	constructor(
		@Inject(AUTH_TOKENS.OAUTH_PROVIDER)
		private readonly oAuthProvider: IOAuthProvider,
		private readonly authService: AuthService,
		private readonly commandBus: CommandBus,
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

		const user: User = await this.commandBus.execute(
			new CreateUserIfNotExistCommand(
				userProfile.email,
				userProfile.name,
				userProfile.picture,
			),
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
