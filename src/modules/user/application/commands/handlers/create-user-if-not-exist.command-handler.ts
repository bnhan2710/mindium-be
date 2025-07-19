import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserIfNotExistCommand } from '../implements/create-user-if-not-exist.command';
import { Inject } from '@nestjs/common';
import { USER_TOKENS } from '@modules/user/user.tokens';
import { IUserRepository } from '@modules/user/domain/ports/repositories/user.repository';
import { User } from '@modules/user/domain/entities/user.entity'; 

@CommandHandler(CreateUserIfNotExistCommand)
export class CreateUserIfNotExistCommandHandler
    implements ICommandHandler<CreateUserIfNotExistCommand>
{
    constructor(
        @Inject(USER_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository, 
    ) {}

    async execute(command: CreateUserIfNotExistCommand): Promise<User> {
        const { email, name, avatar } = command;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            return existingUser; 
        }
        const user = User.create({
            email,
            name,
            avatar,
        });
        await this.userRepository.save(user);

        return user;
    }
}