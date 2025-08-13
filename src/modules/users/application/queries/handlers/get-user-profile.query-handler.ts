import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '../implements/get-user-profile.query';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { USER_TOKENS } from '@modules/users/user.tokens';
import { UserResponseDto } from '../../dtos/user-response.dto';
import { UserNotFoundError } from '@modules/users/domain/exceptions';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileQueryHandler implements IQueryHandler<GetUserProfileQuery> {
	constructor(
		@Inject(USER_TOKENS.REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(query: GetUserProfileQuery): Promise<UserResponseDto> {
		const { userId } = query;
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new UserNotFoundError(userId);
		}

		return UserResponseDto.fromDomain(user);
	}
}
