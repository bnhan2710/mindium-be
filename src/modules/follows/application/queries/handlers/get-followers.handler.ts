import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFollowersQuery } from '../implements/get-followers.query';
import { FollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow-tokens';
import { PageRequest } from '@shared/common/dtos';
import { FollowListDto } from '../../dtos/followeer-list.dto';



@QueryHandler(GetFollowersQuery)
export class GetFollowersHandler implements IQueryHandler<GetFollowersQuery> {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: FollowRepository,
	) {}

	async execute(query: GetFollowersQuery): Promise<FollowListDto> {
		const { userId, pagination } = query;
		const pageRequest = PageRequest.of(pagination);

		const result = await this.followRepository.findFollowersByUserId(
			userId,
	        pageRequest
		);

		const { followers, total } = result;

		return FollowListDto.fromDomain(followers, total);
	
	}
}
 