import { Injectable, Inject } from '@nestjs/common';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { Follow } from '../entities/follow.entity';
import { FollowRepository } from '../repositories/follow.repository';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';
import { USER_TOKENS } from '@modules/users/user.tokens';
import {
	FollowSelfException,
	UserNotFoundException,
	AlreadyFollowingException,
	NotFollowingException,
} from '../exceptions';
import { UserFollowedEvent, UserUnfollowedEvent } from '../domain-events/follow.event';

@Injectable()
export class FollowDomainService {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: FollowRepository,
		@Inject(USER_TOKENS.REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async createFollowRelationship(
		followerId: UserId,
		followeeId: UserId,
	): Promise<Follow> {

		if (followerId.equals(followeeId)) {
			throw new FollowSelfException();
		}

		await this.ensureUsersExist(followerId, followeeId);

		await this.ensureNotAlreadyFollowing(followerId, followeeId);

		const follow = Follow.create(followerId, followeeId);
		
		follow.addDomainEvent(new UserFollowedEvent(followerId, followeeId));

		await this.followRepository.save(follow);

		return follow;
	}

	async removeFollowRelationship(
		followerId: UserId,
		followeeId: UserId,
	): Promise<void> {

		const existingFollow = await this.followRepository.isFollowing(
			followerId,
			followeeId,
		);

		console.log('Existing follow:', existingFollow);
		if (!existingFollow) {
			throw new NotFollowingException();
		}

		new UserUnfollowedEvent(followerId, followeeId)
		
		await this.followRepository.deleteByFollowerAndFollowee(followerId, followeeId);
	}


	private async ensureUsersExist(
		followerId: UserId,
		followeeId: UserId,
	): Promise<void> {
		const [follower, followee] = await Promise.all([
			this.userRepository.findById(followerId.getValue()),
			this.userRepository.findById(followeeId.getValue()),
		]);

		if (!follower) {
			throw new UserNotFoundException();
		}

		if (!followee) {
			throw new UserNotFoundException();
		}
	}

	private async ensureNotAlreadyFollowing(
		followerId: UserId,
		followeeId: UserId,
	): Promise<void> {
		const isAlreadyFollowing = await this.followRepository.isFollowing(
			followerId,
			followeeId,
		);

		if (isAlreadyFollowing) {
			throw new AlreadyFollowingException();
		}
	}
}
