import { Inject } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '../../application/queries/implements/get-user-profile.query';
import { ApiTags } from '@nestjs/swagger';
import { GetFollowerQuery } from '../../application/queries/implements/get-follower.query';
import { ObjectIdValidationPipe } from '@shared/common/pipes/object-id-validation.pipe';
import { GetFollowingQuery } from '../../application/queries/implements/get-following.query';

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

	@Get(':userId')
	async getUserProfile(@Param('userId', ObjectIdValidationPipe) userId: string) {
		return await this.queryBus.execute(new GetUserProfileQuery(userId))
	}

	@Get('followers/:userId')
	async getFollowers(@Param('userId', ObjectIdValidationPipe) userId: string) {
		return await this.queryBus.execute(new GetFollowerQuery(userId));
	}

	@Get('followings/:userId')
	async getFollowings(@Param('userId', ObjectIdValidationPipe) userId: string) {
		return await this.queryBus.execute(new GetFollowingQuery(userId));
	}
}
