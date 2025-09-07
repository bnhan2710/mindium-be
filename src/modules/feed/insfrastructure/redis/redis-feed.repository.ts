import { IFeedRepository } from '@modules/feed/domain/repositories/feed.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_TOKENS } from '@shared/di-tokens';
import { RedisCacheRepository } from '@shared/infrastructure/cache/redis/redis-cache.repository';
import { IPageRequest } from '@libs/common/types';
import { FeedItem } from '@modules/feed/domain/entities/feed-item';
@Injectable()
export class RedisFeedRepository implements IFeedRepository {
	private readonly FEED_KEY_PREFIX = 'feed:user:';

	constructor(
		@Inject(CACHE_TOKENS.CACHE_REPOSITORY)
		private readonly redisCacheRepository: RedisCacheRepository,
	) {}

	async getUserFeed(userId: string, pageRequest: IPageRequest): Promise<FeedItem[]> {
		const feedKey = `${this.FEED_KEY_PREFIX}${userId}`;
		console.log('Fetching feed for key:', feedKey, 'with pagination:', pageRequest);
		const feedItems = await this.redisCacheRepository.zrevrange(
			feedKey, 
			pageRequest.offset, 
			pageRequest.offset + pageRequest.size - 1
		);
		
		console.log('Feed Items from Redis:', feedItems);

		if (!feedItems || feedItems.length === 0) {
			return [];
		}
	
		return feedItems.map(item => JSON.parse(item) as FeedItem);
		
		}
	}

