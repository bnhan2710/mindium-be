import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import {
	FanoutService,
} from '@modules/feed/domain/services/fanout.service';
import { FEED_TOKENS } from '@modules/feed/feed.tokens';
import { FeedItem } from '@modules/feed/domain/entities/feed-item';

@Injectable()
export class PostPublishedSubscriber {
	private readonly logger = new Logger(PostPublishedSubscriber.name);

	constructor(
		@Inject(FEED_TOKENS.FANOUT_SERVICE)
		private readonly fanoutPipeline: FanoutService,
	) {}

	@RabbitSubscribe({
		exchange: 'blog.events',
		routingKey: 'post.published',
		queue: 'feed.post.published.queue',
		queueOptions: {
			durable: true,
		},
	})
	async handleMessage(msg: any) {
		const eventPayload = msg.payload;
		this.logger.log(
			`Received event: post.published with payload: ${JSON.stringify(eventPayload)}`,
		);

		const postData = new FeedItem({
			postId: eventPayload.postId._value || eventPayload.postId,
			authorId: eventPayload.authorId,
			title: eventPayload.title,
			summary: eventPayload.summary,
			tags: eventPayload.tags || [],
			slug: eventPayload.slug,
			createdAt: new Date(eventPayload.createdAt),
		});


		console.log('Post Data:', postData);

		await this.fanoutPipeline.run(postData);
	}
}
