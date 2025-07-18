import { SlugGenerator } from '@shared/services';
import { Slug } from '../value-objects/slug';
import { PostId } from '../value-objects/post-id';
import { Tag } from '../value-objects/tag';
import { v4 } from 'uuid';

export interface PostProps {
	id: PostId;
	title: string;
	content: string;
	author: string;
	slug: Slug;
	tags: Tag[];
	summary: string;
}
export class Post {
	private readonly props: PostProps;
	constructor(props: PostProps) {
		if (!props.id || !props.title || !props.content || !props.author) {
			throw new Error('Post must have an id, title, content, and author');
		}
		this.props = props;
	}

	public static create(
		title: string,
		content: string,
		tags: string[] = [],
		author: string,
		id?: PostId,
	): Post {
		const slug = Slug.createFromTitle(title);
		const tagObjects = tags.map((tag) => Tag.create(tag));
		return new Post({
			id: id || PostId.create(v4()),
			title,
			content,
			author,
			slug,
			tags: tagObjects,
			summary: Post.generatePostSummary(content, 150),
		});
	}

	static generatePostSummary(markdownContent, maxLength = 150) {
		// Remove code blocks and HTML tags from the markdown content
		const codeRegex = /<code[^>]*>.*?<\/code>/gs;
		const withoutCode = markdownContent.replace(codeRegex, '');

		// Remove HTML tags
		const htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
		let summary = withoutCode.replace(htmlRegex, '');

		// Remove markdown syntax
		summary = summary.replace(/\s+/g, ' ').trim();

		// Truncate the summary to the specified length
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
			author: this.props.author,
			slug: this.props.slug.getValue(),
			tags: this.props.tags.map((tag) => tag.getValue()),
			summary: this.props.summary,
		};
	}

	public getId(): PostId {
		return this.props.id;
	}
	public getTitle(): string {
		return this.props.title;
	}
	public getContent(): string {
		return this.props.content;
	}
	public getAuthor(): string {
		return this.props.author;
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

	public addTag(tag: string): void {
		const newTag = Tag.create(tag);
		if (this.props.tags.some((t) => t.getValue() === newTag.getValue())) {
			throw new Error('Tag already exists');
		}
		this.props.tags.push(newTag);
	}

	public removeTag(tag: string): void {
		const tagIndex = this.props.tags.findIndex((t) => t.getValue() === tag);
		if (tagIndex === -1) {
			throw new Error('Tag not found');
		}
		this.props.tags.splice(tagIndex, 1);
	}
}
