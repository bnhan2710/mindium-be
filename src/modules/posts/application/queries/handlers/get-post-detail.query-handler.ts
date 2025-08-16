import { QueryHandler } from '@nestjs/cqrs';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetPostDetailsQuery } from '../implements/get-post-detail.query';
import { IPostRepository } from '../../../domain/repositories/post.repository';
import { PostNotFoundError } from '../../../domain/exceptions';
import { POST_TOKENS } from '@modules/posts/post.tokens';
import { Inject } from '@nestjs/common';
import { PostResponseDto } from '../../dtos/post-response.dto';

@QueryHandler(GetPostDetailsQuery)
export class GetPostDetailsQueryHandler implements IQueryHandler<GetPostDetailsQuery> {
	constructor(
		@Inject(POST_TOKENS.POST_REPOSITORY)
		private readonly postRepository: IPostRepository,
	) {}

	async execute(query: GetPostDetailsQuery): Promise<any> {
		const { postId } = query;
		const post = await this.postRepository.findById(postId);
		if (!post) {
			throw new PostNotFoundError();
		}
		return PostResponseDto.fromDomain(post);
	}
}
