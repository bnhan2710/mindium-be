import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFollowCountsQuery } from '../implements/get-follow-counts.query';
import { IFollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';

export interface GetFollowCountsResult {
	followersCount: number;
	followingCount: number;
}

@QueryHandler(GetFollowCountsQuery)
export class GetFollowCountsHandler implements IQueryHandler<GetFollowCountsQuery> {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: IFollowRepository,
	) {}

	async execute(query: GetFollowCountsQuery): Promise<GetFollowCountsResult> {
		const { userId } = query;

		const counts = await this.followRepository.getFollowCounts(userId);

		return {
			followersCount: counts.followersCount,
			followingCount: counts.followingCount,
		};
	}
}
