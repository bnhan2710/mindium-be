import { ICacheRepository } from '@shared/domain/repositories/cache.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisCacheRepository implements ICacheRepository {
	constructor(
		@InjectRedis()
		private readonly redis: Redis,
	) {}

	async get<T>(key: string): Promise<T | null> {
		try {
			const value = await this.redis.get(key);
			if (!value) return null;
			return JSON.parse(value) as T;
		} catch (error) {
			return null;
		}
	}

	async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
		try {
			const serializedValue = JSON.stringify(value);
			if (ttlSeconds) {
				await this.redis.setex(key, ttlSeconds, serializedValue);
			} else {
				await this.redis.set(key, serializedValue);
			}
		} catch (error) {
			throw Error('Failed to set cache key');
		}
	}

	async addToSet(key: string, value: string): Promise<void> {
		try {
			await this.redis.sadd(key, value);
		} catch (error) {
			throw Error('Failed to add to set');
		}
	}

	async del(key: string): Promise<void> {
		try {
			await this.redis.del(key);
		} catch (error) {;
			throw error;
		}
	}

	async getByList(keys: string[]): Promise<string[] | null> {
		try {
			if (keys.length === 0) return [];
			const values = await this.redis.mget(...keys);
			return values.filter(Boolean) as string[];
		} catch (error) {
			return null;
		}
	}

	async setByList(keyValues: Record<string, string>, ttlSeconds?: number): Promise<void> {
		try {
			const pipeline = this.redis.pipeline();
			for (const [key, value] of Object.entries(keyValues)) {
				if (ttlSeconds) {
					pipeline.setex(key, ttlSeconds, value);
				} else {
					pipeline.zadd(key, value);
				}
			}
			await pipeline.exec();
		} catch (error) {
			throw Error('Failed to set multiple cache keys');
		}
	}

	async exists(key: string): Promise<boolean> {
		try {
			const result = await this.redis.exists(key);
			return result === 1;
		} catch (error) {
			return false;
		}
	}

	async expire(key: string, seconds: number): Promise<void> {
		try {
			await this.redis.expire(key, seconds);
		} catch (error) {
			throw error;
		}
	}

	async flushAll(): Promise<void> {
		try {
			await this.redis.flushall();
		} catch (error) {
			throw Error('Failed to flush all cache');
		}
	}
}
