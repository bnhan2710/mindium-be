import { ApiProperty } from '@nestjs/swagger';

export type PostAuthor =
	| string
	| {
			id: string;
			name: string;
			email: string;
			avatar?: string | null;
	  };

export class GetPostResponseDto {
	@ApiProperty({
		description: 'The unique identifier of the post',
		example: 'clv6r49o40000j6q51234abcd',
	})
	public readonly id: string;

	@ApiProperty({
		description: 'The title of the post',
		example: 'Understanding CQRS in NestJS',
	})
	public title: string;

	@ApiProperty({
		description: 'The content of the post in HTML format',
		example: '<p>This is a detailed explanation of CQRS...</p>',
	})
	public: string;

	@ApiProperty({
		description: 'The author of the post',
		example: 'John Doe',
	})
	public author: string | PostAuthor;

	@ApiProperty({
		description: 'The tags associated with the post',
		example: ['nestjs', 'cqrs', 'hexagonal architecture'],
		type: [String],
	})
	public tags: string[];

	@ApiProperty({
		description: 'A brief summary of the post',
		example: 'This post explains the concepts of CQRS in NestJS.',
	})
	public summary: string;
	@ApiProperty({
		description: 'The date and time when the post was created',
		example: '2023-10-01T12:00:00Z',
	})
	public readonly createdAt: Date;
	public updatedAt: Date;
}
