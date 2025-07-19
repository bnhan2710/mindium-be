import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from '../implements/update-post.command';
import { IPostRepository } from '@modules/post/domain/port/repositories/post.repository';
import { Post } from '@modules/post/domain/entities/post.entity';
import { POST_TOKENS } from '@modules/post/post.tokens';
import { Inject } from '@nestjs/common';
import { PostNotFoundError } from '@modules/post/domain/exceptions';
import { PostResponseDto } from '../../dtos/post-response.dto';

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler implements ICommandHandler<UpdatePostCommand> {
	constructor(
		@Inject(POST_TOKENS.POST_REPOSITORY)
		private readonly postRepository: IPostRepository,
	) {}

	async execute(command: UpdatePostCommand): Promise<string> {
		const { postId, title, content, tags } = command;

		const post = await this.postRepository.findById(postId);

		if (!post) {
			throw new PostNotFoundError();
		}
		const updatedPost = Post.updatePost(post, title, content);

		const updatedId = await this.postRepository.update(updatedPost);

		return updatedId;
	}
}
