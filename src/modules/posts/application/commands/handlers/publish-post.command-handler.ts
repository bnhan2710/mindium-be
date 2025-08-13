import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { PublishPostCommand } from '../implements/publish-post.command';
import { IPostRepository } from '@modules/posts/domain/repositories/post.repository';
import { Post } from '@modules/posts/domain/entities/post.entity';
import { POST_TOKENS } from '@modules/posts/post.tokens';
import { Inject } from '@nestjs/common';

@CommandHandler(PublishPostCommand)
export class PublishPostHandler implements ICommandHandler<PublishPostCommand> {
	constructor(
		@Inject(POST_TOKENS.POST_REPOSITORY)
		private readonly postRepository: IPostRepository,
	) {}

	async execute(command: PublishPostCommand): Promise<{ id: string }> {
		const { title, content, tags, authorId } = command;

		const post = Post.create(title, content, tags, authorId);

		const createdId = await this.postRepository.save(post);

		return { id: createdId };
	}
}
