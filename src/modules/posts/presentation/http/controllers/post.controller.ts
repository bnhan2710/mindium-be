import { Body, Delete, Inject, Post, Put, Query, Request } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublishPostCommand } from '../../../application/commands/implements/publish-post.command';
import { OffsetPagination } from '@libs/common/dtos';
import { PostResponseDto } from '@modules/posts/application/dtos/post-response.dto';
import { ObjectIdValidationPipe } from '@libs/common/pipes/object-id-validation.pipe';
import { CreatePostRequestDto } from '../dtos/create-post.request';
import { GetPostDetailsQuery } from '@modules/posts/application/queries/implements/get-post-detail.query';
import { GetUserPostsQuery } from '@modules/posts/application/queries/implements/get-user-post.query';
import { EditPostCommand } from '@modules/posts/application/commands/implements/edit-post.command';
import { UpdatePostRequestDto } from '../dtos/update-post.request';
import { DeletePostCommand } from '@modules/posts/application/commands/implements/delete-post.command';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infrastructure/guards/jwt-auth.guard';
import { GetUser } from '@libs/common/decorators/get-user.decorator';
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

	@UseGuards(JwtAuthGuard)
	@Post()
	@ApiOperation({ summary: 'Create a new post' })
	@ApiResponse({
		status: 201,
		description: 'Post created successfully',
	})
	async createPost(
		@Body() createPostDto: CreatePostRequestDto,
		@GetUser('sub') userId: string,
	) {
		const { title, content, tags } = createPostDto;
		return await this.commandBus.execute(
			new PublishPostCommand(title, content, tags, userId),
		);
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
		return this.queryBus.execute(new GetUserPostsQuery(userId, pagination));
	}

	@Get(':postId/:slug')
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
		const query = new GetPostDetailsQuery(postId);
		return this.queryBus.execute(query);
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
			new EditPostCommand(postId, title, content, tags),
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
