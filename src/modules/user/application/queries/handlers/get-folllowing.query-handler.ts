import { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { GetFollowingQuery } from '../implements/get-following.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '@modules/user/domain/ports/repositories/user.repository';
import { USER_TOKENS } from '@modules/user/user.tokens';
import { UserResponseDto } from '../../dtos/user-response.dto';
import { UserNotFoundError } from '@modules/user/domain/exceptions';

@QueryHandler(GetFollowingQuery)
export class GetFollowingQueryHandler implements IQueryHandler<GetFollowingQuery> {
	constructor(
		@Inject(USER_TOKENS.USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(query: GetFollowingQuery): Promise<UserResponseDto[]> {
		const { userId } = query;
		const follwings = await this.userRepository.findByIdWithFollowings(userId);
		if (!follwings) {
			throw new UserNotFoundError(userId);
		}
		return follwings.map((following) => UserResponseDto.fromDomain(following));
	}
}
