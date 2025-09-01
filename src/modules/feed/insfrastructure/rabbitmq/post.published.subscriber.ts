import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { PublishPostEventHandler } from "@modules/feed/application/events/handlers/post.created.event-handler";

@Injectable()
@RabbitSubscribe({
    exchange: 'blog.events',
    routingKey: 'post.published',
    queue: 'feed.queue',
})
export class PostPublishedSubscriber{
    private readonly logger = new Logger(PostPublishedSubscriber.name);

    constructor(private readonly eventBus: EventBus){}

    async handleMessage(msg: any){
        this.logger.log(`Received message: ${JSON.stringify(msg)}`);
        // const event = new PublishPostEventHandler();
        // this.eventBus.publish(event);
    }
}