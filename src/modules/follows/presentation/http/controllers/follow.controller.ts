import {
	Controller,
	Post,
	Delete,
	Get,
	Param,
	Body,
	Query,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/infrastructure/guards/jwt-auth.guard';
import { GetUser } from '@libs/common/decorators/get-user.decorator';
import { FollowUserCommand } from '../../../application/commands/implements/follow-user.command';
import { UnfollowUserCommand } from '../../../application/commands/implements/unfollow-user.command';
import { GetFollowersQuery } from '../../../application/queries/implements/get-followers.query';
import { GetFollowingQuery } from '../../../application/queries/implements/get-following.query';
import { GetFollowCountsQuery } from '../../../application/queries/implements/get-follow-counts.query';
import { CheckIsFollowingQuery } from '../../../application/queries/implements/check-is-following.query';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { OffsetPagination } from '@libs/common/dtos';
import { ObjectIdValidationPipe } from '@libs/common/pipes/object-id-validation.pipe';

@ApiTags('Follows')
@UseGuards(JwtAuthGuard)
@Controller({
	path: 'follows',
	version: '1',
})
export class FollowController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Post(':followeeId')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Follow a user' })
	@ApiResponse({ status: 201, description: 'User followed successfully' })
	async followUser(
		@GetUser('sub') userId: string,
		@Param('followeeId', ObjectIdValidationPipe) followeeId: string,
	): Promise<{ message: string }> {
		const command = new FollowUserCommand(
			UserId.create(userId),
			UserId.create(followeeId),
		);

		await this.commandBus.execute(command);

		return { message: 'User followed successfully' };
	}

	@Delete(':followeeId')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Unfollow a user' })
	@ApiResponse({ status: 200, description: 'User unfollowed successfully' })
	async unfollowUser(
		@GetUser('sub') userId: string,
		@Param('followeeId', ObjectIdValidationPipe) followeeId: string,
	): Promise<{ message: string }> {
		console.log('Unfollowing user:', {
			followerId: userId,
			followeeId: followeeId,
		});
		const command = new UnfollowUserCommand(
			UserId.create(userId),
			UserId.create(followeeId),
		);
		await this.commandBus.execute(command);
		return { message: 'User unfollowed successfully' };
	}

	@Get('followers')
	@ApiOperation({ summary: 'Get followers list' })
	@ApiResponse({ status: 200, description: 'Followers retrieved successfully' })
	async getFollowers(
		@Query('userId', ObjectIdValidationPipe) userId: string,
		@Query() pagination: OffsetPagination,
	) {
		return await this.queryBus.execute(
			new GetFollowersQuery(UserId.create(userId), pagination),
		);
	}

	@Get('following')
	@ApiOperation({ summary: 'Get following list' })
	@ApiResponse({ status: 200, description: 'Following list retrieved successfully' })
	async getFollowing(
		@Query('userId', ObjectIdValidationPipe) userId: string,
		@Query() pagination: OffsetPagination,
	) {
		return await this.queryBus.execute(
			new GetFollowingQuery(UserId.create(userId), pagination),
		);
	}

	@Get('counts/:userId')
	@ApiOperation({ summary: 'Get follow counts (followers and following)' })
	@ApiResponse({ status: 200, description: 'Follow counts retrieved successfully' })
	async getFollowCounts(@Param('userId', ObjectIdValidationPipe) userId: string) {
		const targetUserId = userId;

		const query = new GetFollowCountsQuery(UserId.create(targetUserId));

		return await this.queryBus.execute(query);
	}

	@Get('is-following/:followeeId')
	@ApiOperation({ summary: 'Check if following a specific user' })
	@ApiResponse({ status: 200, description: 'Follow status retrieved successfully' })
	async checkIsFollowing(
		@GetUser('sub') userId: string,
		@Param('followeeId', ObjectIdValidationPipe) followeeId: string,
	) {
		const query = new CheckIsFollowingQuery(
			UserId.create(userId),
			UserId.create(followeeId),
		);

		return await this.queryBus.execute(query);
	}
}
