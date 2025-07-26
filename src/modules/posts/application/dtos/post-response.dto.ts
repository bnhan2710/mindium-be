import { Post } from '@modules/posts/domain/entities/post.entity';

export class PostResponseDto {
	public readonly id: string;
	public readonly title: string;
	public readonly content: string;
	public readonly tags: string[];
	public readonly author: string;
	public readonly createdAt?: Date;
	public readonly updatedAt?: Date;

	private constructor(
		id: string,
		title: string,
		content: string,
		tags: string[],
		author: string,
		createdAt?: Date,
		updatedAt?: Date,
	) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.tags = tags;
		this.author = author;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	static fromDomain(post: Post): PostResponseDto {
		return new PostResponseDto(
			post.getId().getValue(),
			post.getTitle(),
			post.getContent(),
			post.getTags().map((tag) => tag.getValue()),
			post.getAuthor(),
			post.getCreatedAt(),
			post.getUpdatedAt(),
		);
	}

	static fromDomainList(posts: Post[]): PostResponseDto[] {
		return posts.map((post) => PostResponseDto.fromDomain(post));
	}
}
