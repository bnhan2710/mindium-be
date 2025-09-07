import { Module, Global } from '@nestjs/common';
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';
import { RedisCacheRepository } from './redis-cache.repository';
import { CACHE_TOKENS } from '@shared/di-tokens';

@Global()
@Module({
	imports: [
		IORedisModule.forRootAsync({
			inject: [EnvironmentKeyFactory],
			useFactory: (environmentKeyFactory: EnvironmentKeyFactory) => ({
				type: 'single',
				url: `redis://${environmentKeyFactory.getRedisConfig().host}:${environmentKeyFactory.getRedisConfig().port}`,
			}),
		}),
	],
	providers: [
		{
			provide: CACHE_TOKENS.CACHE_REPOSITORY,
			useClass: RedisCacheRepository,
		},
	],
	exports: [CACHE_TOKENS.CACHE_REPOSITORY],
})
export class RedisModule {}
