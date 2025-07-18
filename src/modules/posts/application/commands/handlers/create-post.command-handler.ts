import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../implements/create-post.command';
import { IPostRepository } from '@modules/posts/domain/port/repositories/post.repository';
import { Post } from '@modules/posts/domain/entities/post.entity';



@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
	constructor(private readonly postRepository: IPostRepository) {}

	async execute(command: CreatePostCommand): Promise<void> {
		const { title, content, tags, authorId } = command;

		const post = Post.create({
			title,
			content,
			tags,
			author: authorId,
		});

		// await this.postRepository.save(post);
	}
}
