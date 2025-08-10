import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserIfNotExistCommand } from '../implements/create-user-if-not-exist.command';
import { Inject } from '@nestjs/common';
import { USER_TOKENS } from '@modules/users/user.tokens';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
@CommandHandler(CreateUserIfNotExistCommand)
export class CreateUserIfNotExistCommandHandler
	implements ICommandHandler<CreateUserIfNotExistCommand>
{
	constructor(
		@Inject(USER_TOKENS.REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(command: CreateUserIfNotExistCommand): Promise<User> {
		const { email, name, avatar } = command;

		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			return existingUser;
		}

		const userCreate = User.create({
			email,
			name,
			avatar,
		});
		
		const createdId = await this.userRepository.save(userCreate);

		const userCreated = User.create({
			email,
			name,
			avatar,
		},
			UserId.create(createdId) 
		);
		
		return userCreated;
	}
}
