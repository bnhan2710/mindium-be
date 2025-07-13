import { ICommand } from '@nestjs/cqrs';

export class ExchangeTokenCommand implements ICommand {
	constructor(public readonly code: string) {}
}
