import { ApiProperty } from '@nestjs/swagger';

export class FeedDto {
	@ApiProperty({ description: 'Post ID' })
	postId: string;

	@ApiProperty({ description: 'Author ID' })
	authorId: string;

	@ApiProperty({ description: 'Post title' })
	title: string;

	@ApiProperty({ description: 'Post tags', type: [String] })
	tags: string[];

	@ApiProperty({ description: 'Post slug' })
	slug: string;

	@ApiProperty({ description: 'Post summary' })
	summary: string;

	@ApiProperty({ description: 'Post creation date' })
	createdAt: Date;
}
