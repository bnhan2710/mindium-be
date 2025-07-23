import { IQuery } from '@nestjs/cqrs';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';

export class CheckIsFollowingQuery implements IQuery {
	constructor(
		public readonly followerId: UserId,
		public readonly followeeId: UserId,
	) {}
}
