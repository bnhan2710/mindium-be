import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFollowersQuery } from '../implements/get-followers.query';
import { IFollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';
import { PageRequest } from '@libs/common/dtos';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdsQuery } from '@modules/users/application/queries/implements/get-user-by-ids.query';
import { UserProfileDto } from '../../dtos/user-profile.dto';
import { FollowersResponseDto } from '../../dtos/follower-response';

@QueryHandler(GetFollowersQuery)
export class GetFollowersHandler implements IQueryHandler<GetFollowersQuery> {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: IFollowRepository,
		private readonly queryBus: QueryBus,
	) {}

	async execute(query: GetFollowersQuery): Promise<FollowersResponseDto> {
		const { userId, pagination } = query;
		const pageRequest = PageRequest.of(pagination);

		const { followers, total } = await this.followRepository.findFollowersByUserId(
			userId,
			pageRequest,
		);

		const userIds = followers.map((follow) => follow.getFollowerId().getValue());
		const userProfiles: UserProfileDto[] = await this.queryBus.execute(
			new GetUserByIdsQuery(userIds),
		);

		const userProfilesMap = new Map(userProfiles.map((user) => [user.id, user]));

		const followersDto = followers.map((follow) => {
			const userProfile = userProfilesMap.get(follow.getFollowerId().getValue());
			return {
				followerId: follow.getFollowerId().getValue(),
				createdAt: follow.getCreatedAt(),
				userProfile: userProfile || null,
			};
		});

		return {
			followers: followersDto,
			total,
			page: parseInt(pagination.page.toString(), 10),
			size: parseInt(pagination.size.toString(), 10),
		};
	}
}
