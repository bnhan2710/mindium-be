import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditProfileCommand } from '@modules/users/application/commands/implements/edit-profile.command';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { User } from '@modules/users/domain/entities/user.entity';
import { UserNotFoundError } from '@modules/users/domain/exceptions';
import { Inject } from '@nestjs/common';
import { USER_TOKENS } from '@modules/users/user.tokens';

@CommandHandler(EditProfileCommand)
export class EditProfileCommandHandler implements ICommandHandler<EditProfileCommand> {
    constructor(
        @Inject(USER_TOKENS.REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    async execute(command: EditProfileCommand): Promise<void> {
        const { userId, name, avatar, bio } = command;
        
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            throw new UserNotFoundError(userId);
        }

        user.editProfile(name, avatar, bio);

        await this.userRepository.update(userId, user);
    }

}
