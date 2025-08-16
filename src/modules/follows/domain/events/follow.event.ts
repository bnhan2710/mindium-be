import { DomainEvent } from '@shared/domain/events/domain-event';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';

export class UserFollowedEvent extends DomainEvent {
	public readonly followerId: UserId;
	public readonly followeeId: UserId;

	constructor(followerId: UserId, followeeId: UserId) {
		super(followerId.toString());
		this.followerId = followerId;
		this.followeeId = followeeId;
	}

	getEventName(): string {
		return 'user.followed';
	}
}

export class UserUnfollowedEvent extends DomainEvent {
	public readonly followerId: UserId;
	public readonly followeeId: UserId;

	constructor(followerId: UserId, followeeId: UserId) {
		super(followerId.toString());
		this.followerId = followerId;
		this.followeeId = followeeId;
	}

	getEventName(): string {
		return 'user.unfollowed';
	}
}
