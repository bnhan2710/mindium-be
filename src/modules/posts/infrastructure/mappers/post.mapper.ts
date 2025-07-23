import { Post } from '@modules/posts/domain/entities/post.entity';
import { Tag } from '@modules/posts/domain/value-objects/tag';
import { PostDocument } from '../adapters/persistence/schemas/post.schema';
import { Types } from 'mongoose';
import { PostId } from '@modules/posts/domain/value-objects/post-id';

export class PostMapper {
	static toDomain(postDoc: PostDocument): Post {
		const postId = PostId.create((postDoc._id as any).toString());
		return Post.create(
			postDoc.title,
			postDoc.content,
			postDoc.tags,
			postDoc.author.toString(),
			postId,
			(postDoc as any).createdAt,
			(postDoc as any).updatedAt,
		);
	}

	static toPersistence(post: Post): Partial<PostDocument> {
		return {
			_id: new Types.ObjectId(),
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
