import { IQuery } from '@nestjs/cqrs';

export class GetFollowingQuery implements IQuery {
	constructor(public readonly userId: string) {}
}
