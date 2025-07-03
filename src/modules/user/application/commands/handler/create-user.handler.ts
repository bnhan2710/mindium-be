import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../implements/create-user.command";
import { IUserRepository } from "@modules/user/domain/repositories/user.repository";
import { UserEntity } from "@modules/user/domain/entities/user.entity";


@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor() {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { email, password, name, avatar } = command;
    // Here you would typically call a user repository to save the user
    // For example:

  }
}