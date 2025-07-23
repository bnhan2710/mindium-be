import { Follow } from '../entities/follow.entity';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '../value-objects/follow-id.vo';

export interface FollowRepository {
	save(follow: Follow): Promise<void>;
	delete(followId: FollowId): Promise<void>;
	deleteByFollowerAndFollowee(followerId: UserId, followeeId: UserId): Promise<void>;
	findByFollowerAndFollowee(
		followerId: UserId,
		followeeId: UserId,
	): Promise<Follow | null>;
	findFollowersByUserId(
		userId: UserId,
		limit?: number,
		offset?: number,
	): Promise<{
		followers: Follow[];
		total: number;
	}>;
	findFollowingByUserId(
		userId: UserId,
		limit?: number,
		offset?: number,
	): Promise<{
		following: Follow[];
		total: number;
	}>;
	isFollowing(followerId: UserId, followeeId: UserId): Promise<boolean>;
	getFollowCounts(userId: UserId): Promise<{
		followersCount: number;
		followingCount: number;
	}>;
}
