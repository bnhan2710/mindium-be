import { ICommand } from '@nestjs/cqrs';
import { RefreshTokenDto } from '../../dtos/request';

export class RefreshTokenCommand implements ICommand {
	constructor(public readonly refreshTokenDto: RefreshTokenDto) {}
}
