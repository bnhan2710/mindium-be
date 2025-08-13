import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '../value-objects/follow-id.vo';
import { UserFollowedEvent, UserUnfollowedEvent } from '../events/follow.event';
import { AggregateRoot } from '@shared/domain/base/base.aggregate-root';
export interface FollowProps {
	id: FollowId;
	followerId: UserId;
	followeeId: UserId;
	createdAt: Date;
}

export class Follow extends AggregateRoot {
	private readonly props: FollowProps;

	private constructor(props: FollowProps) {
		super(props.id.getValue());
		this.validateProps(props);
		this.props = props;
	}

	public static create(followerId: UserId, followeeId: UserId): Follow {
		const followId = FollowId.generate();
		const follow = new Follow({
			id: followId,
			followerId,
			followeeId,
			createdAt: new Date(),
		});

		follow.addDomainEvent(new UserFollowedEvent(followerId, followeeId));

		return follow;
	}

	public static reconstitute(props: FollowProps): Follow {
		return new Follow(props);
	}

	private validateProps(props: FollowProps): void {
		if (!props.id) {
			throw new Error('Follow ID is required');
		}
		if (!props.followerId) {
			throw new Error('Follower ID is required');
		}
		if (!props.followeeId) {
			throw new Error('Followee ID is required');
		}
		if (props.followerId.equals(props.followeeId)) {
			throw new Error('User cannot follow themselves');
		}
	}

	public createFollowEvent(): void {
		this.addDomainEvent(
			new UserFollowedEvent(this.props.followerId, this.props.followeeId),
		);
	}

	public createUnfollowEvent(): void {
		this.addDomainEvent(
			new UserUnfollowedEvent(this.props.followerId, this.props.followeeId),
		);
	}

	public getFollowerId(): UserId {
		return this.props.followerId;
	}

	public getFolloweeId(): UserId {
		return this.props.followeeId;
	}

	public getCreatedAt(): Date {
		return this.props.createdAt;
	}
}
