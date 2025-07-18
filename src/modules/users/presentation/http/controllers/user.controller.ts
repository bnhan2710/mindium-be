import { Body, Inject, Post } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '../../../application/queries/implements/get-user-profile.query';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetFollowerQuery } from '../../../application/queries/implements/get-follower.query';
import { ObjectIdValidationPipe } from '@shared/common/pipes/object-id-validation.pipe';
import { GetFollowingQuery } from '../../../application/queries/implements/get-following.query';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { CreateUserCommand } from '@modules/users/application/commands/implements/create-user.command';
import { CreateUserRequestDto, UpdateUserRequestDto } from '../dtos';

@ApiTags('Users')
@Controller({
	path: 'users',
	version: '1',
})
export class UserController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({
		status: 201,
		description: 'User created successfully',
	})
	async createUser(@Body() createUserDto: CreateUserRequestDto) {
		const { email, name, avatar } = createUserDto;
		await this.commandBus.execute(new CreateUserCommand(email, name, avatar));
	}

	@Get(':userId')
	@ApiOperation({ summary: 'Get user profile' })
	@ApiResponse({
		status: 200,
		description: 'User profile retrieved successfully',
		type: UserResponseDto,
	})
	async getUserProfile(
		@Param('userId', ObjectIdValidationPipe) userId: string,
	): Promise<UserResponseDto> {
		return await this.queryBus.execute(new GetUserProfileQuery(userId));
	}

	@Get('followers/:userId')
	@ApiOperation({ summary: 'Get user followers' })
	@ApiResponse({
		status: 200,
		description: 'User followers retrieved successfully',
		type: UserResponseDto,
		isArray: true,
	})
	async getFollowers(@Param('userId', ObjectIdValidationPipe) userId: string) {
		return await this.queryBus.execute(new GetFollowerQuery(userId));
	}

	@Get('followings/:userId')
	@ApiOperation({ summary: 'Get user followings' })
	@ApiResponse({
		status: 200,
		description: 'User followings retrieved successfully',
		type: UserResponseDto,
		isArray: true,
	})
	async getFollowings(@Param('userId', ObjectIdValidationPipe) userId: string) {
		return await this.queryBus.execute(new GetFollowingQuery(userId));
	}
}
