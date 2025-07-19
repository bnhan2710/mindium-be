export class Tag {
	private constructor(private readonly value: string) {
		if (!value.trim()) throw new Error('Tag cannot be empty');
	}

	public static create(value: string): Tag {
		return new Tag(Tag.toCapitalized(value));
	}

	public getValue(): string {
		return this.value;
	}

	static toCapitalized(value: string): string {
		return value
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
}
