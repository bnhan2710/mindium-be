import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFollowerQuery } from '../implements/get-follower.query';
import { IUserRepository } from '@modules/user/domain/ports/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { USER_TOKENS } from '@modules/user/user.tokens';
import { UserResponseDto } from '../../dtos/user-response.dto';
import { UserNotFoundError } from '@modules/user/domain/exceptions';

@QueryHandler(GetFollowerQuery)
export class GetFollowerQueryHandler implements IQueryHandler<GetFollowerQuery> {
	constructor(
		@Inject(USER_TOKENS.USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}
	async execute(query: GetFollowerQuery): Promise<UserResponseDto[]> {
		const { userId } = query;
		const followers = await this.userRepository.findByIdWithFollowers(userId);
		if (!followers) {
			throw new UserNotFoundError(userId);
		}
		return UserResponseDto.fromDomainList(followers);
	}
}
