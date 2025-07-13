import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFollowerQuery } from '../implements/get-follower.query';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { USER_DI_TOKENS } from '@modules/users/user.di-tokens';
import { UserApplicationDto } from '../../dtos/user-application.dto';
import { UserNotFoundError } from '@modules/users/domain/errors';

@QueryHandler(GetFollowerQuery)
export class GetFollowerQueryHandler implements IQueryHandler<GetFollowerQuery> {
	constructor(
		@Inject(USER_DI_TOKENS.USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}
	async execute(query: GetFollowerQuery): Promise<UserApplicationDto[]> {
		const { userId } = query;
		const followers = await this.userRepository.findByIdWithFollowers(userId);
		if (!followers) {
			throw new UserNotFoundError(userId);
		}
		return UserApplicationDto.fromDomainList(followers);

	}
}
