import { Body, Inject, Post } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../../../application/commands/implements/create-post.command';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '@shared/common/pipes/object-id-validation.pipe';
import { CreatePostRequestDto } from '../dtos/create-post.request';
import { GetPostDetailQuery } from '@modules/posts/application/queries/implements/get-post-detail.query';
import { PostResponseDto } from '@modules/posts/application/dtos/post-response.dto';

@ApiTags('Posts')
@Controller({
	path: 'posts',
	version: '1',
})
export class PostController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	@ApiOperation({ summary: 'Create a new post' })
	@ApiResponse({
		status: 201,
		description: 'Post created successfully',
	})
	async createPost(@Body() createPostDto: CreatePostRequestDto) {
		const { title, content, tags } = createPostDto;
		await this.commandBus.execute(
			new CreatePostCommand(title, content, tags, '6869e5b94b65f19d000647ec'),
		);
	}

	@Get(':postId')
	@ApiOperation({ summary: 'Get post detail by ID' })
	@ApiResponse({
		status: 200,
		description: 'Post detail retrieved successfully',
		type: PostResponseDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Post not found',
	})
	async getPostDetail(@Param('postId', ObjectIdValidationPipe) postId: string) {
		return this.queryBus.execute(new GetPostDetailQuery(postId));
	}
}
