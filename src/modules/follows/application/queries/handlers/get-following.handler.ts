import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFollowingQuery } from '../implements/get-following.query';
import { FollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';

export interface FollowingDto {
	followeeId: string;
	createdAt: Date;
}

export interface GetFollowingResult {
	following: FollowingDto[];
	total: number;
	limit?: number;
	offset?: number;
}

@QueryHandler(GetFollowingQuery)
export class GetFollowingHandler implements IQueryHandler<GetFollowingQuery> {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: FollowRepository,
	) {}

	async execute(query: GetFollowingQuery): Promise<GetFollowingResult> {
		const { userId, limit, offset } = query;

		const result = await this.followRepository.findFollowingByUserId(
			userId,
			limit,
			offset,
		);

		const following: FollowingDto[] = result.following.map((follow) => ({
			followeeId: follow.getFolloweeId().getValue(),
			createdAt: follow.getCreatedAt(),
		}));

		return {
			following,
			total: result.total,
			limit,
			offset,
		};
	}
}
