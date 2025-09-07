export class FeedItemProps {
	postId: string;
	authorId: string;
	title: string;
	tags: string[];
	slug: string;
	summary: string;
	createdAt: Date;
}

export class FeedItem {
	private readonly props : FeedItemProps;

	constructor(props: FeedItemProps) {
		this.props = props;
	}

	get postId(): string {
		return this.props.postId;
	}

	get authorId(): string {
		return this.props.authorId;
	}

	get title(): string {
		return this.props.title;
	}

	get tags(): string[] {
		return this.props.tags;
	}

	get slug(): string {
		return this.props.slug;
	}

	get summary(): string {
		return this.props.summary;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
}
