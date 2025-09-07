import { Injectable, Inject, Logger } from '@nestjs/common';
import {
	FanoutService,
} from '@modules/feed/domain/services/fanout.service';
import { IFollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { ICacheRepository } from '@shared/domain/repositories/cache.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow.tokens';
import { CACHE_TOKENS } from '@shared/di-tokens';
import { FeedItem } from '@modules/feed/domain/entities/feed-item';
@Injectable()
export class RabbitMQFanout implements FanoutService {
	constructor(
		@Inject(FOLLOW_TOKENS.REPOSITORY)
		private readonly followRepository: IFollowRepository,
		@Inject(CACHE_TOKENS.CACHE_REPOSITORY)
		private readonly cacheReposiotory: ICacheRepository,
	) {}	

	async run(feedItem: FeedItem): Promise<void> {
		const followers = await this.followRepository.getFollowerIds(feedItem.authorId);
		if (followers.length === 0) {
			return;
		}

		const score = feedItem.createdAt.getTime()

		await this.cacheReposiotory.setByList(
			followers.reduce(
				(acc, followerId) => {
					const feedKey = `feed:user:${followerId}`;
					const postEntry = JSON.stringify({
						postId: feedItem.postId,
						authorId: feedItem.authorId,
						title: feedItem.title,
						summary: feedItem.summary,
						tags: feedItem.tags,
						createdAt: feedItem.createdAt,
					});
					acc[feedKey] = postEntry;
					return acc;
				},
				{} as Record<string, string>,
			),
			score,
			2592000,// 30 days
		);
	}
}
