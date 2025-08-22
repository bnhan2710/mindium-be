import { ICacheRepository } from "@shared/domain/repositories/cache.repository";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_TOKEN } from "@shared/di-tokens";

@Injectable()
export class RedisCacheRepository implements ICacheRepository {
    constructor(
        @Inject(CACHE_TOKEN)
        private readonly cacheRepository: ICacheRepository,
    ) {}

    async get<T>(key: string): Promise<T | null> {
        return this.cacheRepository.get<T>(key);
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        return this.cacheRepository.set<T>(key, value, ttlSeconds);
    }

    async del(key: string): Promise<void> {
        return this.cacheRepository.del(key);
    }
}
