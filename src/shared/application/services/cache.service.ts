import { Injectable, Inject } from '@nestjs/common';
import { ICacheRepository } from '@shared/domain/repositories/cache.repository';
import { CACHE_TOKENS } from '@shared/di-tokens';

@Injectable()
export class CacheService {
	constructor(
		@Inject(CACHE_TOKENS.CACHE_REPOSITORY)
		private readonly cacheRepository: ICacheRepository,
	) {}

	async cachePost(postId: string, post: any, ttl: number = 1800): Promise<void> {
		const key = this.getPostCacheKey(postId);
		await this.cacheRepository.set(key, post, ttl);
	}

	async getCachedPost<T>(postId: string): Promise<T | null> {
		const key = this.getPostCacheKey(postId);
		return this.cacheRepository.get<T>(key);
	}

	async invalidatePostCache(postId: string): Promise<void> {
		const key = this.getPostCacheKey(postId);
		await this.cacheRepository.del(key);
	}


	async cacheFeeds(userIds: string[], feed: any[], ttl: number = 9000): Promise<void> {
		await this.cacheRepository.setByList(
				  userIds.reduce((acc, userId) => {
					  const key = this.getFeedCacheKey(userId);
					  acc[key] = JSON.stringify(feed);
					  return acc;
				  }, {} as Record<string, string>),
				  ttl,		
		)
	}

	async getCachedFeed<T>(userId: string): Promise<T[] | null> {
		const key = this.getFeedCacheKey(userId);
		return this.cacheRepository.get<T[]>(key);
	}

	async invalidateFeed(userId: string): Promise<void> {
		const key = this.getFeedCacheKey(userId);
		await this.cacheRepository.del(key);
	}


	private getPostCacheKey(postId: string): string {
		return `post:${postId}`;
	}


	private getFeedCacheKey(userId: string): string {
		return `feed:${userId}`;
	}

	async clearAllCache(): Promise<void> {
		await this.cacheRepository.flushAll();
	}

	async cacheExists(key: string): Promise<boolean> {
		return this.cacheRepository.exists(key);
	}
}
