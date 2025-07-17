export class Tag {
	private constructor(private readonly value: string) {
		if (!value.trim()) throw new Error('Tag cannot be empty');
	}

	public static create(value: string): Tag {
		return new Tag(value.toLowerCase());
	}

	public getValue(): string {
		return this.value;
	}
}
