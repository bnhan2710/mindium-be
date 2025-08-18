import { DomainEvent } from "@shared/domain";
import { PostId } from "../value-objects/post-id";

export class PublishPostEvent extends DomainEvent{
    constructor(
        public readonly postId: PostId,
        public readonly authorId: string,
        public readonly title: string,
        public readonly content: string,
        public readonly tags: string[] = [],
        public readonly summary: string,
        public readonly publishedAt: Date = new Date(),

    ) {
        super(postId.getValue());
    }

    getEventName(): string {
        return 'post.published';
    }

}
