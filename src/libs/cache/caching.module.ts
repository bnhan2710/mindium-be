import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@shared/infrastructure/cache/redis/redis.module';
@Global()
@Module({
	imports: [RedisModule],
	exports: [RedisModule],
})
export class CachingModule {}


