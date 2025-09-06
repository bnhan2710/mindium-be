import { IFeedRepository } from "@modules/feed/domain/repositories/feed.repository";
import { Inject } from "@nestjs/common";
import { CACHE_TOKENS } from "@shared/di-tokens";
import { RedisCacheRepository } from "@shared/infrastructure/cache/redis/redis-cache.repository";

export class RedisFeedRepository implements IFeedRepository {
    constructor( 
        @Inject(CACHE_TOKENS.CACHE_REPOSITORY)
        private readonly redisCacheRepository: RedisCacheRepository
    ) {}

    async getUserFeed(userId: string): Promise<any[]> {
        return [] 
    }
}