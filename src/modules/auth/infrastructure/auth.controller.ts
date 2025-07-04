import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ExchangeGoogleTokenDto } from './dto/exchange-token.dto';
import { ExchangeTokenCommand } from '../application/commands/implements/exchange-token.command';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
    constructor( private readonly commandBus: CommandBus ) {}

   @Get('google/oauth')
    async exchangeGoogleToken(
        @Body() exchangeGoogleTokenDto: ExchangeGoogleTokenDto
    ) {
        const { code } = exchangeGoogleTokenDto;
        return this.commandBus.execute(new ExchangeTokenCommand(code));
    }
}
