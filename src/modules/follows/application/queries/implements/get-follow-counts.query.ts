import { IQuery } from '@nestjs/cqrs';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';

export class GetFollowCountsQuery implements IQuery {
	constructor(public readonly userId: UserId) {}
}
