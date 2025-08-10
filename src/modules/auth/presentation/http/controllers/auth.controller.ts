import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Redirect,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ExchangeTokenCommand } from '../../../application/commands/implements/exchange-token.command';
import { LogoutCommand } from '../../../application/commands/implements/logout.command';
import { RefreshTokenCommand } from '../../../application/commands/implements/refresh-token.command';
// import { TokenPair } from '../../../domain/value-objects/token-pair.vo';
import { ExchangeGoogleTokenDto, RefreshTokenDto, LogoutDto } from '../dtos';
import { TokenResponseDto } from '@modules/auth/application/dtos';
import { EnvironmentKeyFactory } from '@configs/environment-key.factory';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
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
			new ExchangeTokenCommand(exchangeGoogleTokenDto.code),
		);
		const params = new URLSearchParams({
			uid: exchangeResult.sub,
			access_token: exchangeResult.accessToken,
			refresh_token: exchangeResult.refreshToken,
		});
		const redirectURL = `${this.envFactory.getClientUrl()}/oauth/redirect?${params.toString()}`;
		return { url: redirectURL };
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	@ApiOperation({ summary: 'Logout user' })
	async logout(@Body() logoutDto: LogoutDto): Promise<void> {
		await this.commandBus.execute(new LogoutCommand(logoutDto.refresh_token));
	}

	@Post('refresh')
	@ApiOperation({ summary: 'Refresh access token' })
	@ApiResponse({
		status: 200,
		description: 'Access token refreshed successfully',
		type: TokenResponseDto,
	})
	async refreshToken(
		@Body() refreshTokenDto: RefreshTokenDto,
	): Promise<TokenResponseDto> {
		const tokenPair = await this.commandBus.execute(
			new RefreshTokenCommand(refreshTokenDto.refresh_token),
		);
		return tokenPair;
	}
}
