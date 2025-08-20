import { Post } from '@modules/posts/domain/entities/post.entity';
import { Tag } from '@modules/posts/domain/value-objects/tag';
import { PostDocument } from '../persistence/schemas/post.schema';
import { Slug } from '@modules/posts/domain/value-objects/slug';
import { Types } from 'mongoose';
import { PostId } from '@modules/posts/domain/value-objects/post-id';

export class PostMapper {
	static toDomain(postDoc: PostDocument): Post {
		const postId = PostId.create((postDoc._id as any).toString());
		return new Post(
			postId,
			{
				title: postDoc.title,
				content: postDoc.content,
				slug: Slug.create(postDoc.slug),
				tags: postDoc.tags.map((tag) => Tag.create(tag)),
				summary: postDoc.summary || '',
				authorId: (postDoc.authorId as any).toString(),
			},
			(postDoc as any).createdAt,
			(postDoc as any).updatedAt,
		)
	}

	static toPersistence(post: Post): Partial<PostDocument> {
		return {
			_id: new Types.ObjectId(),
			title: post.getTitle(),
			content: post.getContent(),
			slug: post.getSlug().getValue(),
			tags: post.getTags().map((tag) => tag.getValue()),
			summary: post.getSummary(),
			authorId: new Types.ObjectId(post.getAuthorId()),
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
