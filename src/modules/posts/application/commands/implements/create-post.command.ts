import { ICommand } from '@nestjs/cqrs';
import { CreatePostDto } from '../../dtos/request/create-post.dto';
export class CreatePostCommand implements ICommand {
	constructor(
		public readonly createPostDto: CreatePostDto,
		public readonly authorId: string,
	) {}
}
