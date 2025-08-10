import { ICommand } from '@nestjs/cqrs';

export class EditPostCommand implements ICommand {
	constructor(
		public readonly postId: string,
		public readonly title?: string,
		public readonly content?: string,
		public readonly tags?: string[],
	) {}
}
