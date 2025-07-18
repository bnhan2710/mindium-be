import { SlugGenerator } from '@shared/services';
import { Slug } from '../value-objects/slug';
import { Tag } from '../value-objects/tag';
import { PostId } from '../value-objects/post-id';
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
		props: Omit<PostProps, 'id'>,
		id?: PostId
	): Post {
		return new Post({
			id: id || PostId.create(v4()),
			...props,
			slug: Slug.createFromTitle(props.title),
			tags: props.tags || [],
			summary: props.summary || '',
		});
	}

	public generatePostSummary(markdownContent, maxLength = 150) {
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

	public generateSlug(title): string {
		return SlugGenerator.generate(title);
	}

	public addTag(tag: Tag): void {
		if (this.props.tags.some((t) => t.getValue() === tag.getValue())) {
			throw new Error('Tag already exists');
		}
		this.props.tags.push(tag);
	}

	public removeTag(tag: Tag): void {
		const index = this.props.tags.findIndex((t) => t.getValue() === tag.getValue());
		if (index === -1) {
			throw new Error('Tag not found');
		}
		this.props.tags.splice(index, 1);
	}
}
