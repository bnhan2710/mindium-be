import { ICommand } from '@nestjs/cqrs';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';

export class FollowUserCommand implements ICommand {
	constructor(
		public readonly followerId: UserId,
		public readonly followeeId: UserId,
	) {}
}
