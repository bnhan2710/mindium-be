import { AggregateRoot } from '@shared/domain/base/base.aggregate-root';
import { SlugGenerator } from '@libs/services';
import { Slug } from '../value-objects/slug';
import { PostId } from '../value-objects/post-id';
import { Tag } from '../value-objects/tag';
import { v7 } from 'uuid';
import { PublishPostEvent } from '../events/post-published.event';

export interface PostProps {
	title: string;
	content: string;
	authorId: string;
	slug: Slug;
	tags: Tag[];
	summary: string;
}

export class Post extends AggregateRoot<PostId, PostProps> {
	constructor(id: PostId, props: PostProps, createdAt?: Date, updatedAt?: Date) {
		super(id, props, createdAt, updatedAt);
	}

	public static create(
		title: string,
		content: string,
		tags: string[] = [],
		authorId: string,
		createdAt: Date = new Date(),
		updatedAt: Date = new Date(),
	): Post {
		const slug = Slug.createFromTitle(title);
		const tagObjects = tags.map((tag) => Tag.create(tag));
		const summary = Post.generatePostSummary(content, 150);

		const post = new Post(
			PostId.create(v7()),
			{
				title,
				content,
				authorId,
				slug,
				tags: tagObjects,
				summary,
			},
			createdAt,
			updatedAt,
		);



		post.addDomainEvent(
			new PublishPostEvent(
				post.getId().getValue(),
				authorId,
				title,
				content,
				tags,
				summary,
				createdAt,
			),
		);

		return post;
	}

	private static generatePostSummary(markdownContent: string, maxLength = 150): string {
		const codeRegex = /<code[^>]*>.*?<\/code>/gs;
		const withoutCode = markdownContent.replace(codeRegex, '');

		const htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
		let summary = withoutCode.replace(htmlRegex, '');

		summary = summary.replace(/\s+/g, ' ').trim();

		if (summary.length > maxLength) {
			summary = summary.substring(0, maxLength) + '...';
		}

		return summary;
	}

	public toPrimitives() {
		return {
			id: this.getId().getValue(),
			title: this.props.title,
			content: this.props.content,
			authorId: this.props.authorId,
			slug: this.props.slug.getValue(),
			tags: this.props.tags.map((tag) => tag.getValue()),
			summary: this.props.summary,
			createdAt: this.getCreatedAt(),
			updatedAt: this.getUpdatedAt(),
		};
	}

	public getTitle(): string {
		return this.props.title;
	}

	public getContent(): string {
		return this.props.content;
	}

	public getAuthorId(): string {
		return this.props.authorId;
	}

	public getSlug(): Slug {
		return this.props.slug;
	}

	public getTags(): Tag[] {
		return this.props.tags;
	}

	public getSummary(): string {
		return this.props.summary;
	}

	// domain behavior
	public generateSlug(title: string): string {
		return SlugGenerator.generate(title);
	}

	public updatePost(title?: string, content?: string, tags?: string[]): Post {
		if (title) this.props.title = title;
		if (content) this.props.content = content;
		if (tags) this.props.tags = tags.map((tag) => Tag.create(tag));

		this.props.slug = Slug.createFromTitle(this.props.title);
		this.touch();

		return this;
	}

	public addTag(tag: string): void {
		const newTag = Tag.create(tag);
		if (this.props.tags.some((t) => t.getValue() === newTag.getValue())) {
			throw new Error('Tag already exists');
		}
		this.props.tags.push(newTag);
		this.touch();
	}

	public removeTag(tag: string): void {
		const tagIndex = this.props.tags.findIndex((t) => t.getValue() === tag);
		if (tagIndex === -1) {
			throw new Error('Tag not found');
		}
		this.props.tags.splice(tagIndex, 1);
		this.touch();
	}
}
