import { IQuery } from '@nestjs/cqrs';
export class GetPostDetailsQuery implements IQuery {
	constructor(public readonly postId: string) {}
}
