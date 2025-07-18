import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
	@ApiProperty({
		description: 'The title of the post',
		example: 'Understanding CQRS in NestJS',
	})
	@IsString()
	@MinLength(5, {
		message: 'Title must be at least 5 characters long',
	})
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'The content of the post in HTML format',
		example: '<p>This is a detailed explanation of CQRS...</p>',
	})
	@IsString()
	@MinLength(10, {
		message: 'Content must be at least 10 characters long',
	})
	@IsNotEmpty()
	content: string;
}
