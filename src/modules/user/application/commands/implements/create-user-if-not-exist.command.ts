import { ICommand } from '@nestjs/cqrs';

export class CreateUserIfNotExistCommand implements ICommand {
    constructor(
        public readonly email: string,
        public readonly name: string,
        public readonly avatar?: string,
    ) {}
}