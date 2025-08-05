import { ICommand } from '@nestjs/cqrs';
export class GetPostDetailsQuery implements ICommand {
	constructor(public readonly postId: string) {}
}
