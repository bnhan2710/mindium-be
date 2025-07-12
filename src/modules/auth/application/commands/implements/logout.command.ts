import { ICommand } from '@nestjs/cqrs';
import { LogoutDto } from '../../dtos/request';

export class LogoutCommand implements ICommand {
	constructor(public readonly logoutDto: LogoutDto) {}
}
