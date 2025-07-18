import { Post } from '@modules/posts/domain/entities/post.entity';
import { Tag } from '@modules/posts/domain/value-objects/tag';
import { PostDocument } from '../adapters/persistence/schemas/post.schema';
import { Types } from 'mongoose';

export class PostMapper {
	static toDomain(postDoc: PostDocument): Post {
		return Post.create(
			postDoc.title,
			postDoc.content,
			postDoc.tags,
			postDoc.author.toString(),
		);
	}

	static toPersistence(post: Post): Partial<PostDocument> {
		return {
			_id: new Types.ObjectId(post.getId().getValue()),
			title: post.getTitle(),
			content: post.getContent(),
			slug: post.getSlug().getValue(),
			tags: post.getTags().map((tag) => tag.getValue()),
			summary: post.getSummary(),
			author: new Types.ObjectId(post.getAuthor()),
		};
	}

	static toPersistenceCreate(post: Post): Partial<PostDocument> {
		return {
			title: post.getTitle(),
			content: post.getContent(),
			slug: post.getSlug().getValue(),
			tags: post.getTags().map((tag) => tag.getValue()),
			summary: post.getSummary(),
			author: new Types.ObjectId(post.getAuthor()),
		};
	}

	static toPersistenceUpdate(post: Post): Partial<PostDocument> {
		return {
			title: post.getTitle(),
			content: post.getContent(),
			slug: post.getSlug().getValue(),
			tags: post.getTags().map((tag) => tag.getValue()),
			summary: post.getSummary(),
		};
	}
}
