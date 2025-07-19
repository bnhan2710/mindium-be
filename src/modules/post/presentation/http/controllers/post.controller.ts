import { Body, Delete, Inject, Post, Put, Query } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostCommand } from '../../../application/commands/implements/create-post.command';
import { OffsetPagination } from '@shared/common/dtos';
import { PostResponseDto } from '@modules/post/application/dtos/post-response.dto';
import { ObjectIdValidationPipe } from '@shared/common/pipes/object-id-validation.pipe';
import { CreatePostRequestDto } from '../dtos/create-post.request';
import { GetPostDetailQuery } from '@modules/post/application/queries/implements/get-post-detail.query';
import { GetUserPostQuery } from '@modules/post/application/queries/implements/get-user-post.query';
import { UpdatePostCommand } from '@modules/post/application/commands/implements/update-post.command';
import { UpdatePostRequestDto } from '../dtos/update-post.request';
import { DeletePostCommand } from '@modules/post/application/commands/implements/delete-post.command';
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
		return await this.commandBus.execute(
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

	@Get('users/:userId')
	@ApiOperation({ summary: 'Get posts by user ID' })
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Page number (default: 1)',
	})
	@ApiQuery({
		name: 'size',
		required: false,
		type: Number,
		description: 'Page size (default: 10)',
	})
	@ApiResponse({
		status: 200,
		description: 'Posts retrieved successfully',
		type: [PostResponseDto],
	})
	@ApiResponse({
		status: 404,
		description: 'User not found or no posts available',
	})
	async getUserPosts(
		@Param('userId', ObjectIdValidationPipe) userId: string,
		@Query() pagination: OffsetPagination,
	) {
		return this.queryBus.execute(new GetUserPostQuery(userId, pagination));
	}

	@Put(':postId')
	@ApiOperation({ summary: 'Update a post by ID' })
	@ApiResponse({
		status: 200,
		description: 'return the updated post ID',
	})
	@ApiResponse({
		status: 404,
		description: 'Post not found',
	})
	async updatePost(
		@Param('postId', ObjectIdValidationPipe) postId: string,
		@Body() updatePostDto: UpdatePostRequestDto,
	) {
		const { title, content, tags } = updatePostDto;
		return await this.commandBus.execute(
			new UpdatePostCommand(postId, title, content, tags),
		);
	}

	@Delete(':postId')
	@ApiOperation({ summary: 'Delete a post by ID' })
	@ApiResponse({
		status: 200,
		description: 'return true if the post was deleted successfully',
	})
	@ApiResponse({
		status: 404,
		description: 'Post not found',
	})
	async deletePost(@Param('postId', ObjectIdValidationPipe) postId: string) {
		return await this.commandBus.execute(new DeletePostCommand(postId));
	}
}
