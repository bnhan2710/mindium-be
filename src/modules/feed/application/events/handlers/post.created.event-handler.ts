import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PublishPostEvent } from "@modules/posts/domain/events/post-published.event";

@EventsHandler(PublishPostEvent)
export class PublishPostEventHandler implements IEventHandler<PublishPostEvent> {
    handle(event: PublishPostEvent): void {
       console.log(`Post published: ${event.title} by Author ID: ${event.authorId}`);
    }
}