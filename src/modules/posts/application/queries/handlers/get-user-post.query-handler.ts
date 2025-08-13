import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserPostsQuery } from '../implements/get-user-post.query';
import { IPostRepository } from '@modules/posts/domain/repositories/post.repository';
import { PostResponseDto } from '../../dtos/post-response.dto';
import { POST_TOKENS } from '@modules/posts/post.tokens';
import { PageRequest } from '@libs/common/dtos';

@QueryHandler(GetUserPostsQuery)
export class GetUserPostsQueryHandler implements IQueryHandler<GetUserPostsQuery> {
	constructor(
		@Inject(POST_TOKENS.POST_REPOSITORY)
		private readonly postRepository: IPostRepository,
	) {}

	async execute(query: GetUserPostsQuery): Promise<any> {
		const { userId, pagination } = query;

		const pageRequest = PageRequest.of(pagination);

		const posts = await this.postRepository.findByUserId(userId, pageRequest);

		return PostResponseDto.fromDomainList(posts);
	}
}
