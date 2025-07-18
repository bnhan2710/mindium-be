import { Post } from '../../entities/post.entity';

export interface IPostRepository {
	findById(postId: string): Promise<Post | null>;
	save(post: Post): Promise<void>;
}
