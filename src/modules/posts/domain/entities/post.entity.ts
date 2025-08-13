import { AggregateRoot } from '@shared/domain/base/base.aggregate-root';
import { SlugGenerator } from '@libs/services';
import { Slug } from '../value-objects/slug';
import { PostId } from '../value-objects/post-id';
import { Tag } from '../value-objects/tag';
import { v4 } from 'uuid';

export interface PostProps {
	id: PostId;
	title: string;
	content: string;
	authorId: string;
	slug: Slug;
	tags: Tag[];
	summary: string;
	createdAt?: Date;
	updatedAt?: Date;
}
export class Post extends AggregateRoot {
	private readonly props: PostProps;
	constructor(props: PostProps) {
		super(props.id.getValue());
		if (!props.id || !props.title || !props.content || !props.authorId) {
			throw new Error('Post must have an id, title, content, and author');
		}
		this.props = props;
	}

	public static create(
		title: string,
		content: string,
		tags: string[] = [],
		authorId: string,
		id?: PostId,
		createAt: Date = new Date(),
		updatedAt: Date = new Date(),
	): Post {
		const slug = Slug.createFromTitle(title);
		const tagObjects = tags.map((tag) => Tag.create(tag));
		return new Post({
			id: id || PostId.create(v4()),
			title,
			content,
			authorId,
			slug,
			tags: tagObjects,
			summary: Post.generatePostSummary(content, 150),
			createdAt: createAt ? new Date(createAt) : new Date(),
			updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
		});
	}

	static generatePostSummary(markdownContent, maxLength = 150) {
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
			id: this.props.id.getValue(),
			title: this.props.title,
			content: this.props.content,
			authorId: this.props.authorId,
			slug: this.props.slug.getValue(),
			tags: this.props.tags.map((tag) => tag.getValue()),
			summary: this.props.summary,
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

	public generateSlug(title): string {
		return SlugGenerator.generate(title);
	}

	public static updatePost(
		post: Post,
		title?: string,
		content?: string,
		tags?: string[],
	): Post {
		const updatedProps: PostProps = {
			...post.props,
			title: title ?? post.props.title,
			content: content ?? post.props.content,
			slug: Slug.createFromTitle(title ?? post.props.title),
			tags: tags ? tags.map((tag) => Tag.create(tag)) : post.props.tags,
			updatedAt: new Date(),
		};

		return new Post(updatedProps);
	}

	public addTag(tag: string): void {
		const newTag = Tag.create(tag);
		if (this.props.tags.some((t) => t.getValue() === newTag.getValue())) {
			throw new Error('Tag already exists');
		}
		this.props.tags.push(newTag);
		this.props.updatedAt = new Date();
	}

	public removeTag(tag: string): void {
		const tagIndex = this.props.tags.findIndex((t) => t.getValue() === tag);
		if (tagIndex === -1) {
			throw new Error('Tag not found');
		}
		this.props.tags.splice(tagIndex, 1);
		this.props.updatedAt = new Date();
	}
}
