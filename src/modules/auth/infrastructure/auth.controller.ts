import { Body, Controller, Delete, Get, Inject, Post, Query, Redirect, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ExchangeGoogleTokenDto } from './dto/exchange-token.dto';
import { ExchangeTokenCommand } from '../application/commands/implements/exchange-token.command';
import { EnvironmentKeyFactory } from '@shared/services';
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
    constructor( 
        private readonly commandBus: CommandBus ,
        private readonly envFactory: EnvironmentKeyFactory
    ) {}

   @Get('google/oauth')
   @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
   @Redirect()
    async exchangeGoogleToken(
        @Query() exchangeGoogleTokenBody: ExchangeGoogleTokenDto, 
    ): Promise<{ url: string }> {
           const { code } = exchangeGoogleTokenBody;
        const exchangeResult  = await this.commandBus.execute(new ExchangeTokenCommand(code));
        const params = new URLSearchParams({
        uid: exchangeResult.sub,
        access_token: exchangeResult.accessToken,
        refresh_token: exchangeResult.refreshToken
      });
      const redirectURL = `${this.envFactory.getClientUrl}/oauth/redirect?${params.toString()}`;
      return { url: redirectURL };
    }
}
