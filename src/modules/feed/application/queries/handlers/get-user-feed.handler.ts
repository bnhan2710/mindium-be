import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserFeedQuery } from '../implements/get-user-feed.query';
import { IFeedRepository } from '@modules/feed/domain/repositories/feed.repository';
import { FEED_TOKENS } from '@modules/feed/feed.tokens';
import { PageRequest } from '@libs/common/dtos';
import { FeedDto } from '../../dtos/feed.dto';
@QueryHandler(GetUserFeedQuery)
export class GetUserFeedHandler implements IQueryHandler<GetUserFeedQuery> {
	constructor(
		@Inject(FEED_TOKENS.FEED_REPOSITORY)
		private readonly feedRepository: IFeedRepository,
	) {}

	async execute(query: GetUserFeedQuery): Promise<FeedDto[]> {
		const { userId, pagination } = query;
		const pageRequest = PageRequest.of(pagination);

		const feed = await this.feedRepository.getUserFeed(userId, pageRequest);
		
		return feed.map(item => ({
			postId: item.postId,
			authorId: item.authorId,
			title: item.title,
			tags: item.tags,
			slug: item.slug,
			summary: item.summary,
			createdAt: item.createdAt,
		}));
	}
}
