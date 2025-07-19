import { ICommand } from '@nestjs/cqrs';

export class GetPostDetailQuery implements ICommand {
	constructor(public readonly postId: string) {}
}
