import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserRepository } from '@modules/users/domain/ports/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { USER_TOKENS } from '@modules/users/user.tokens';
import { GetUserByIdsQuery } from '../implements/get-user-by-ids.query';
import { UserResponseDto } from '../../dtos/user-response.dto';

@QueryHandler(GetUserByIdsQuery)
export class GetUserByIdsQueryHandler implements IQueryHandler<GetUserByIdsQuery> {
	constructor(
		@Inject(USER_TOKENS.REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(query: GetUserByIdsQuery): Promise<UserResponseDto[]> {
		const { userIds } = query;
		const users = await this.userRepository.findByIds(userIds);

		if (!users || users.length === 0) {
			return [];
		}

		return UserResponseDto.fromDomainList(users);
	}
}
