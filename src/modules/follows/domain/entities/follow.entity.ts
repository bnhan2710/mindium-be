import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '../value-objects/follow-id.vo';
import { UserFollowedEvent, UserUnfollowedEvent } from '../events/follow.event';
import { AggregateRoot } from '@shared/domain/base/base.aggregate-root';
import { v4 } from 'uuid';
export interface FollowProps {
  followerId: UserId;
  followeeId: UserId;
}

export class Follow extends AggregateRoot<FollowId, FollowProps> {
  private constructor(
    id: FollowId,
    props: FollowProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, props, createdAt, updatedAt);
    this.validateProps(props);
  }

  public static create(followerId: UserId, followeeId: UserId): Follow {
    const followId = FollowId.create(v4());
    const follow = new Follow(followId, { followerId, followeeId }, new Date());

    follow.addDomainEvent(new UserFollowedEvent(followerId, followeeId));

    return follow;
  }

  public static reconstitute(
	props: FollowProps,
	id?: FollowId,
	createdAt?: Date,
	updatedAt?: Date,
  ): Follow {
	const followId = id || FollowId.create(v4());
	return new Follow(followId, props, createdAt, updatedAt);
  }


  private validateProps(props: FollowProps): void {
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
}
