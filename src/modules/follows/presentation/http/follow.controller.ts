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
	ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/presentation/http/guards/jwt-auth.guard';
import { GetUser } from '@shared/common/decorators/get-user.decorator';
import { FollowUserCommand } from '../../application/commands/implements/follow-user.command';
import { UnfollowUserCommand } from '../../application/commands/implements/unfollow-user.command';
import { GetFollowersQuery } from '../../application/queries/implements/get-followers.query';
import { GetFollowingQuery } from '../../application/queries/implements/get-following.query';
import { GetFollowCountsQuery } from '../../application/queries/implements/get-follow-counts.query';
import { CheckIsFollowingQuery } from '../../application/queries/implements/check-is-following.query';
import { FollowUserDto } from './dtos/follow-user.dto';
import { GetFollowersDto } from './dtos/get-followers.dto';
import { GetFollowingDto } from './dtos/get-following.dto';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';

@ApiTags('Follows')
@ApiBearerAuth()
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

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Follow a user' })
	@ApiResponse({ status: 201, description: 'User followed successfully' })
	async followUser(
		@GetUser('userId') currentUserId: string,
		@Body() followUserDto: FollowUserDto,
	): Promise<{ message: string }> {
		const command = new FollowUserCommand(
			UserId.create(currentUserId),
			UserId.create(followUserDto.followeeId),
		);

		await this.commandBus.execute(command);

		return { message: 'User followed successfully' };
	}

	@Delete(':followeeId')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Unfollow a user' })
	@ApiResponse({ status: 200, description: 'User unfollowed successfully' })
	async unfollowUser(
		@GetUser('userId') currentUserId: string,
		@Param('followeeId', ParseUUIDPipe) followeeId: string,
	): Promise<{ message: string }> {
		const command = new UnfollowUserCommand(
			UserId.create(currentUserId),
			UserId.create(followeeId),
		);

		await this.commandBus.execute(command);

		return { message: 'User unfollowed successfully' };
	}
	r;
	@Get('followers')
	@ApiOperation({ summary: 'Get followers list' })
	@ApiResponse({ status: 200, description: 'Followers retrieved successfully' })
	async getFollowers(
		@GetUser('userId') currentUserId: string,
		@Query() dto: GetFollowersDto,
	) {
		const targetUserId = dto.userId || currentUserId;

		const query = new GetFollowersQuery(
			UserId.create(targetUserId),
			dto.size,
			(dto.page - 1) * dto.size,
		);

		return await this.queryBus.execute(query);
	}

	@Get('following')
	@ApiOperation({ summary: 'Get following list' })
	@ApiResponse({ status: 200, description: 'Following list retrieved successfully' })
	async getFollowing(
		@GetUser('userId') currentUserId: string,
		@Query() dto: GetFollowingDto,
	) {
		const targetUserId = dto.userId || currentUserId;

		const query = new GetFollowingQuery(
			UserId.create(targetUserId),
			dto.size,
			(dto.page - 1) * dto.size,
		);

		return await this.queryBus.execute(query);
	}

	@Get('counts/:userId')
	@ApiOperation({ summary: 'Get follow counts (followers and following)' })
	@ApiResponse({ status: 200, description: 'Follow counts retrieved successfully' })
	async getFollowCounts(@Param('userId') userId: string) {
		const targetUserId = userId;

		const query = new GetFollowCountsQuery(UserId.create(targetUserId));

		return await this.queryBus.execute(query);
	}

	@Get('counts')
	@ApiOperation({ summary: 'Get follow counts for current user' })
	@ApiResponse({ status: 200, description: 'Follow counts retrieved successfully' })
	async getCurrentUserFollowCounts(@GetUser('userId') currentUserId: string) {
		const query = new GetFollowCountsQuery(UserId.create(currentUserId));

		return await this.queryBus.execute(query);
	}

	@Get('is-following/:followeeId')
	@ApiOperation({ summary: 'Check if following a specific user' })
	@ApiResponse({ status: 200, description: 'Follow status retrieved successfully' })
	async checkIsFollowing(
		@GetUser() user: any,
		@Param('followeeId', ParseUUIDPipe) followeeId: string,
	) {
		const query = new CheckIsFollowingQuery(
			UserId.create(user.sub),
			UserId.create(followeeId),
		);

		return await this.queryBus.execute(query);
	}
}
