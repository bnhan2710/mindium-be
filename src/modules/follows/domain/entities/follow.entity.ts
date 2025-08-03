import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '../value-objects/follow-id.vo';
import { DomainEvent } from '@shared/domain/domain-event';
import { UserFollowedEvent, UserUnfollowedEvent } from '../domain-events/follow.event';

export interface FollowProps {
	id: FollowId;
	followerId: UserId;
	followeeId: UserId;
	createdAt: Date;
}

export class Follow {
	private readonly props: FollowProps;
	private _domainEvents: DomainEvent[] = [];

	private constructor(props: FollowProps) {
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

	public addDomainEvent(event: DomainEvent): void {
		this._domainEvents.push(event);
	}

	public getDomainEvents(): DomainEvent[] {
		return [...this._domainEvents];
	}

	public clearDomainEvents(): void {
		this._domainEvents = [];
	}

	public createUnfollowEvent(): void {
		this.addDomainEvent(
			new UserUnfollowedEvent(this.props.followerId, this.props.followeeId),
		);
	}

	public getId(): FollowId {
		return this.props.id;
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

	public equals(other: Follow): boolean {
		return this.props.id.equals(other.getId());
	}
}
