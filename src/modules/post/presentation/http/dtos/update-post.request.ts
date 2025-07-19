import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePostRequestDto {
	@ApiProperty({
		description: 'The title of the post',
		example: 'Updating Posts',
	})
	@IsString()
	@MinLength(5, {
		message: 'Title must be at least 5 characters long',
	})
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'The content of the post in HTML format',
		example: '<p>This is the updated content of the post...</p>',
	})
	@IsString()
	@MinLength(10, {
		message: 'Content must be at least 10 characters long',
	})
	@IsNotEmpty()
	content: string;

	@ApiProperty({
		description: 'Optional tags for the post',
		example: ['update', 'post'],
		required: false,
	})
	@IsString({ each: true })
	tags?: string[];
}
