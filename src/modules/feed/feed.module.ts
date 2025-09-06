import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostPublishedSubscriber } from './insfrastructure/rabbitmq/post.published.subscriber';
import { RabbitMQFanout } from './insfrastructure/rabbitmq/fanout/rabbitmq.fanout';
import { FEED_TOKENS } from './feed.tokens';
import { FollowModule } from '@modules/follows/follow.module';
import { RedisCacheRepository } from '@shared/infrastructure/cache/redis/redis-cache.repository';
import { GetUserFeedHandler } from './application/queries/handlers/get-user-feed.handler';
import { FeedController } from './presentation/http/feed.controller';
import { CACHE_TOKENS } from '@shared/di-tokens';
import { RedisModule } from '@shared/infrastructure/cache/redis/redis.module'; 

const QueryHandlers = [GetUserFeedHandler];

const Repositories = [ ]

@Module({
	imports: [
		CqrsModule,
		FollowModule, 
		RedisModule
	],
	// controllers: [FeedController],
	providers: [
	// 	...QueryHandlers,
		PostPublishedSubscriber,
		{
			provide: FEED_TOKENS.FANOUT_SERVICE,
			useClass: RabbitMQFanout,
		},
	// 	{
	// 		provide: CACHE_TOKENS.CACHE_REPOSITORY,
	// 		useClass: RedisCacheRepository,
	// 	}
	],
})

export class FeedModule {}