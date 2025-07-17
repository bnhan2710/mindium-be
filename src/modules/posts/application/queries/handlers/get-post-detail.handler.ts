import { QueryHandler } from '@nestjs/cqrs';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetPostDetailQuery } from '../implements/get-post-detail.query';
import { IPostRepository } from '../../../domain/port/repositories/post.repository';
import { PostNotFoundError } from '../../../domain/exceptions';

@QueryHandler(GetPostDetailQuery)
export class GetPostDetailHandler implements IQueryHandler<GetPostDetailQuery> {
	constructor(private readonly postRepository: IPostRepository) {}

	async execute(query: GetPostDetailQuery): Promise<any> {
		const post = await this.postRepository.findById(query.postId);
		if (!post) {
			throw new PostNotFoundError();
		}
		return post;
	}
}
