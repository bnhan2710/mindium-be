import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from '../implements/delete-post.command';
import { IPostRepository } from '@modules/post/domain/port/repositories/post.repository';
import { PostNotFoundError } from '@modules/post/domain/exceptions';
import { POST_TOKENS } from '@modules/post/post.tokens';
import { Inject } from '@nestjs/common';

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler {
	constructor(
		@Inject(POST_TOKENS.POST_REPOSITORY)
		private readonly postRepository: IPostRepository,
	) {}

	async execute(command: DeletePostCommand): Promise<true> {
		const { postId } = command;

		const post = await this.postRepository.findById(postId);

		if (!post) {
			throw new PostNotFoundError();
		}

		await this.postRepository.delete(postId);

		return true;
	}
}
