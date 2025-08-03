import { Follow } from '../entities/follow.entity';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '../value-objects/follow-id.vo';
import { IPageRequest } from '@shared/common/types';


export interface FollowRepository {
	save(follow: Follow): Promise<void>;
	delete(followId: FollowId): Promise<void>;
	deleteByFollowerAndFollowee(followerId: UserId, followeeId: UserId): Promise<void>;
	findFollowersByUserId(
		userId: UserId,
		pageRequest: IPageRequest,
	): Promise<{
		followers: Follow[];
		total: number;
	}>;
	findFollowingByUserId(
		userId: UserId,
		pageRequest: IPageRequest,
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
