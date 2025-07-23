import { IQuery } from '@nestjs/cqrs';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';

export class GetFollowersQuery implements IQuery {
	constructor(
		public readonly userId: UserId,
		public readonly limit?: number,
		public readonly offset?: number,
	) {}
}
