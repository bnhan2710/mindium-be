export class PostId {
	private readonly value: string;

	private constructor(value: string) {
		if (!value) {
			throw new Error('PostId cannot be empty');
		}
		this.value = value;
	}

	public static create(id: string): PostId {
		return new PostId(id);
	}

	public getValue(): string {
		return this.value;
	}

	public equals(otherId: PostId): boolean {
		return this.value === otherId.value;
	}
}
