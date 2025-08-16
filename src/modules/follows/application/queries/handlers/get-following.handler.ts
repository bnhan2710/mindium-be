import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFollowingQuery } from '../implements/get-following.query';
import { IFollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';
import { PageRequest } from '@libs/common/dtos';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdsQuery } from '@modules/users/application/queries/implements/get-user-by-ids.query';
import { UserProfileDto } from '../../dtos/user-profile.dto';
import { FollowingResponseDto } from '../../dtos/following-response';

@QueryHandler(GetFollowingQuery)
export class GetFollowingHandler implements IQueryHandler<GetFollowingQuery> {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: IFollowRepository,
		private readonly queryBus: QueryBus,
	) {}

	async execute(query: GetFollowingQuery): Promise<FollowingResponseDto> {
		const { userId, pagination } = query;
		const pageRequest = PageRequest.of(pagination);

		const { following, total } = await this.followRepository.findFollowingByUserId(
			userId,
			pageRequest,
		);

		const userIds = following.map((follow) => follow.getFolloweeId().getValue());
		const userProfiles: UserProfileDto[] = await this.queryBus.execute(
			new GetUserByIdsQuery(userIds),
		);

		const userProfilesMap = new Map(userProfiles.map((user) => [user.id, user]));

		const followingDto = following.map((follow) => {
			const userProfile = userProfilesMap.get(follow.getFolloweeId().getValue());
			return {
				followeeId: follow.getFolloweeId().getValue(),
				createdAt: follow.getCreatedAt(),
				userProfile: userProfile || null,
			};
		});

		return {
			following: followingDto,
			total,
			page: parseInt(pagination.page.toString(), 10),
			size: parseInt(pagination.size.toString(), 10),
		};
	}
}
