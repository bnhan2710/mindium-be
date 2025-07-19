import { OffsetPagination } from '@shared/common/dtos';
import { Post } from '../../entities/post.entity';
import { IPageRequest } from '@shared/common/types';  

export interface IPostRepository {
	findById(postId: string): Promise<Post | null>
	findByUserId(userId: string, pageRequest: IPageRequest): Promise<Post[]>;
	save(post: Post): Promise<void>;
}
