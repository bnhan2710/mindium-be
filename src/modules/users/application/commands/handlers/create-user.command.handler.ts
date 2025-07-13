import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../implements/create-user.command';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
	constructor() {}

	async execute(command: CreateUserCommand): Promise<void> {
		const { email, password, name, avatar } = command;
	}
}
