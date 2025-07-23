import { randomUUID } from 'crypto';

export class FollowId {
	private readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	public static generate(): FollowId {
		return new FollowId(randomUUID());
	}

	public static from(value: string): FollowId {
		return new FollowId(value);
	}

	public getValue(): string {
		return this.value;
	}

	public equals(other: FollowId): boolean {
		return this.value === other.value;
	}

	public toString(): string {
		return this.value;
	}
}
