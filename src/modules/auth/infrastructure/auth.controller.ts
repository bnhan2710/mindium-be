import { Body, Controller, Get, Post, Query, Redirect, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ExchangeTokenCommand } from '../application/commands/implements/exchange-token.command';
import { EnvironmentKeyFactory } from '@shared/services';
import { LogoutCommand } from '../application/commands/implements/logout.command';
import { RefreshTokenCommand } from '../application/commands/implements/refresh-token.command';
import { TokenPair } from '../domain/value-objects/token-pair.vo';
import { ExchangeGoogleTokenDto, RefreshTokenDto, LogoutDto } from '../application/dtos/request';

@ApiTags('Auth')
@Controller({
	path: 'auth',
	version: '1',
})
export class AuthController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly envFactory: EnvironmentKeyFactory,
	) {}

	@Get('google/oauth')
	@Redirect()
	async exchangeGoogleToken(
		@Query() exchangeGoogleTokenDto: ExchangeGoogleTokenDto,
	): Promise<{ url: string }> {
		const exchangeResult = await this.commandBus.execute(
			new ExchangeTokenCommand(exchangeGoogleTokenDto),
		);
		const params = new URLSearchParams({
			uid: exchangeResult.sub,
			access_token: exchangeResult.accessToken,
			refresh_token: exchangeResult.refreshToken,
		});
		const redirectURL = `${this.envFactory.getClientUrl()}/oauth/redirect?${params.toString()}`;
		return { url: redirectURL };
	}

	@Post('logout')
	async logout(@Body() logoutDto: LogoutDto): Promise<void> {
		await this.commandBus.execute(new LogoutCommand(logoutDto));
	}

	@Post('refresh')
	async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
		const tokenPair : TokenPair = await this.commandBus.execute(
			new RefreshTokenCommand(refreshTokenDto),
		);
		return tokenPair;
	}
}
