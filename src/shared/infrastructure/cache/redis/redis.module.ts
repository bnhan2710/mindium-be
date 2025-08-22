import { Module, Global, OnModuleInit, Inject, OnModuleDestroy } from '@nestjs/common';
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';
import Redis from 'ioredis';
import { Logger } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (enviromentKeyFactory: EnvironmentKeyFactory) => {
        return new Redis({
            host: enviromentKeyFactory.getRedisConfig().host,
            port: enviromentKeyFactory.getRedisConfig().port,
            password: enviromentKeyFactory.getRedisConfig().password,
            db: enviromentKeyFactory.getRedisConfig().db,
            });
      },
      inject: [EnvironmentKeyFactory],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule implements OnModuleDestroy, OnModuleInit {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
    private readonly logger = new Logger(RedisModule.name);


    onModuleInit() {
        this.logger.log('Redis module initialized');
    }

    onModuleDestroy() {
        this.redisClient.quit();
        this.logger.log('Redis module destroyed');
    }
}