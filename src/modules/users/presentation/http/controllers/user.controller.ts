import { Body, Inject, Post, Put } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '../../../application/queries/implements/get-user-profile.query';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '@shared/common/pipes/object-id-validation.pipe';
import { UserResponseDto } from '@modules/users/application/dtos/user-response.dto';
import { CreateUserCommand } from '@modules/users/application/commands/implements/create-user.command';
import { CreateUserRequestDto, UpdateUserRequestDto } from '../dtos';
import { EditProfileCommand } from '@modules/users/application/commands/implements/edit-profile.command';

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
		const { email, name, avatar, bio } = createUserDto;
		await this.commandBus.execute(new CreateUserCommand(email, name, avatar, bio));
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

	@Put(':userId/')
	@ApiOperation({ summary: 'Update user profile' })
	@ApiResponse({
		status: 200,
		description: 'User profile updated successfully',
	})
	async updateUserProfile(
		@Param('userId', ObjectIdValidationPipe) userId: string,
		@Body() updateUserDto: UpdateUserRequestDto,
	): Promise<void> {
		const { name, avatar, bio } = updateUserDto;
		await this.commandBus.execute(new EditProfileCommand(userId, name, avatar, bio));
	}
}
