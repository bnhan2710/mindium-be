import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../implements/create-user.command';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserAlreadyExistsError } from '@modules/users/domain/exceptions/user-already-exists.error';
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
	constructor(
		private readonly userRepository: IUserRepository,
	) {}

	async execute(command: CreateUserCommand): Promise<void> {
		const { email, name, avatar } = command;

		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new UserAlreadyExistsError(email);
		}
		
		const user = User.create({
			email,
			name,
			avatar,
		});

		await this.userRepository.save(user);
	}
}
