import { Post } from '@modules/posts/domain/entities/post.entity';

export class PostResponseDto {
	public readonly id: string;
	public readonly title: string;
	public readonly content: string;
	public readonly tags: string[];
	public readonly author: string;

	private constructor(
		id: string,
		title: string,
		content: string,
		tags: string[],
		author: string,
	) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.tags = tags;
		this.author = author;
	}

	static fromDomain(post: Post): PostResponseDto {
		return new PostResponseDto(
			post.getId().getValue(),
			post.getTitle(),
			post.getContent(),
			post.getTags().map((tag) => tag.getValue()),
			post.getAuthor(),
		);
	}
}