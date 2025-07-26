export class UserId {
	private readonly value: string;

	private constructor(value: string) {
		if (!value) {
			throw new Error('User ID cannot be empty');
		}
		this.value = value;
	}

	public static create(id: string): UserId {
		return new UserId(id);
	}

	public getValue(): string {
		return this.value;
	}

	public equals(otherId: UserId): boolean {
		return this.value === otherId.value;
	}

	public toString(): string {
		return this.value;
	}
}
