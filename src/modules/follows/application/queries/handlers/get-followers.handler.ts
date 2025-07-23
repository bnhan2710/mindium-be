import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFollowersQuery } from '../implements/get-followers.query';
import { FollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';

export interface FollowerDto {
	followerId: string;
	createdAt: Date;
}

export interface GetFollowersResult {
	followers: FollowerDto[];
	total: number;
	limit?: number;
	offset?: number;
}

@QueryHandler(GetFollowersQuery)
export class GetFollowersHandler implements IQueryHandler<GetFollowersQuery> {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: FollowRepository,
	) {}

	async execute(query: GetFollowersQuery): Promise<GetFollowersResult> {
		const { userId, limit, offset } = query;

		const result = await this.followRepository.findFollowersByUserId(
			userId,
			limit,
			offset,
		);

		const followers: FollowerDto[] = result.followers.map((follow) => ({
			followerId: follow.getFollowerId().getValue(),
			createdAt: follow.getCreatedAt(),
		}));

		return {
			followers,
			total: result.total,
			limit,
			offset,
		};
	}
}
