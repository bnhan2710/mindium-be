import { ICommand } from '@nestjs/cqrs';
export class EditProfileCommand implements ICommand {
	constructor(
		public readonly userId: string,
		public readonly name?: string,
		public readonly avatar?: string,
		public readonly bio?: string,
	) {}
}
