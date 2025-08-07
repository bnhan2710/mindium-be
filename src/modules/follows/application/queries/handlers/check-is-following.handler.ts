import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CheckIsFollowingQuery } from '../implements/check-is-following.query';
import { IFollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';

export interface CheckIsFollowingResult {
	isFollowing: boolean;
}

@QueryHandler(CheckIsFollowingQuery)
export class CheckIsFollowingHandler implements IQueryHandler<CheckIsFollowingQuery> {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: IFollowRepository,
	) {}

	async execute(query: CheckIsFollowingQuery): Promise<CheckIsFollowingResult> {
		const { followerId, followeeId } = query;

		const isFollowing = await this.followRepository.isFollowing(
			followerId,
			followeeId,
		);

		return {
			isFollowing,
		};
	}
}
