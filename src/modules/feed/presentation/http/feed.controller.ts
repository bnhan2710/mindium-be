import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserFeedQuery } from '@modules/feed/application/queries/implements/get-user-feed.query';
import { JwtAuthGuard } from '@shared/infrastructure/guards/jwt-auth.guard';
import { GetUser } from '@libs/common/decorators/get-user.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OffsetPagination } from '@libs/common/dtos';
import { FeedDto } from '@modules/feed/application/dtos/feed.dto';

@ApiTags('Feed')
@Controller({
	path: 'feed',
	version: '1',
})
@UseGuards(JwtAuthGuard)
export class FeedController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	@ApiOperation({ summary: 'Get user feed' })
	@ApiResponse({ 
		status: 200, 
		description: 'User feed retrieved successfully',
		type: [FeedDto]
	})
	async getUserFeed(
		@GetUser('sub') userId: string,
		@Query() pagination: OffsetPagination
	): Promise<FeedDto[]> {
		const query = new GetUserFeedQuery(userId, pagination);
		return await this.queryBus.execute(query);
	}
}
