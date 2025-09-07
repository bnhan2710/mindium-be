import { DomainEvent } from '@shared/domain/base/domain-event';
import { PostId } from '../value-objects/post-id';

export class PublishPostEvent extends DomainEvent {
	constructor(
		public readonly postId: string,
		public readonly authorId: string,
		public readonly title: string,
		public readonly slug: string,
		public readonly tags: string[] = [],
		public readonly summary: string,
		public readonly createdAt: Date,
	) {
		super(postId);
	}

	getEventName(): string {
		return 'post.published';
	}
}
