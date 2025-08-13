import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { EditPostCommand } from '../implements/edit-post.command';
import { IPostRepository } from '@modules/posts/domain/repositories/post.repository';
import { Post } from '@modules/posts/domain/entities/post.entity';
import { POST_TOKENS } from '@modules/posts/post.tokens';
import { Inject } from '@nestjs/common';
import { PostNotFoundError } from '@modules/posts/domain/exceptions';
import { PostResponseDto } from '../../dtos/post-response.dto';

@CommandHandler(EditPostCommand)
export class EditPostCommandHanler implements ICommandHandler<EditPostCommand> {
	constructor(
		@Inject(POST_TOKENS.POST_REPOSITORY)
		private readonly postRepository: IPostRepository,
	) {}

	async execute(command: EditPostCommand): Promise<string> {
		const { postId, title, content, tags } = command;

		const post = await this.postRepository.findById(postId);

		if (!post) {
			throw new PostNotFoundError();
		}
		const updatedPost = Post.updatePost(post, title, content);

		const updatedId = await this.postRepository.update(updatedPost);

		return JSON.stringify(updatedId);
	}
}
