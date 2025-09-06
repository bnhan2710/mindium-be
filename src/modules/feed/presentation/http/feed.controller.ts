import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserFeedQuery } from '@modules/feed/application/queries/implements/get-user-feed.query';
import { JwtAuthGuard } from '@shared/infrastructure/guards/jwt-auth.guard';
import { GetUser } from '@libs/common/decorators/get-user.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get()
    @ApiOperation({ summary: 'Get user feed' })
    @ApiResponse({ status: 200, description: 'User feed retrieved successfully' })
    async getUserFeed(
        @GetUser('userId') userId: string,
    ) {
        const query = new GetUserFeedQuery(userId);
        return await this.queryBus.execute(query);
    }
}
