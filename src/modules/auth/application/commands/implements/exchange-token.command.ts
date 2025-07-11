import { ICommand } from '@nestjs/cqrs';
import { ExchangeGoogleTokenDto } from '../../dtos/request';

export class ExchangeTokenCommand implements ICommand {
	constructor(public readonly exchangeGoogleTokenDto: ExchangeGoogleTokenDto) {}
}
