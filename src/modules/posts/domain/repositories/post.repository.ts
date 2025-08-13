import { OffsetPagination } from '@libs/common/dtos';
import { Post } from '../entities/post.entity';
import { IPageRequest } from '@libs/common/types';

export interface IPostRepository {
	findById(postId: string): Promise<Post | null>;
	findByUserId(userId: string, pageRequest: IPageRequest): Promise<Post[]>;
	save(post: Post): Promise<string>;
	update(post: Post): Promise<string>;
	delete(postId: string): Promise<void>;
}
