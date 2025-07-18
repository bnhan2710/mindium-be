import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '../implements/get-user-profile.query';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { USER_DI_TOKENS } from '@modules/users/user.di-tokens';
import { UserResponseDto } from '../../dtos/user-response.dto';
import { UserNotFoundError } from '@modules/users/domain/exceptions';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileQueryHandler implements IQueryHandler<GetUserProfileQuery> {
	constructor(
		@Inject(USER_DI_TOKENS.USER_REPOSITORY)
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
