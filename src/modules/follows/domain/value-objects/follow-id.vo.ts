import { randomUUID } from 'crypto';
import { ValueObject } from '@shared/domain/value-objects/vo';
export class FollowId extends ValueObject<string> {
	private constructor(value: string) {
		super(value);
	}

	protected validate(value: string): void {
		if (!value || typeof value !== 'string') {
			throw new Error('FollowId must be a non-empty string');
		}
	}

	public static generate(): FollowId {
		return new FollowId(randomUUID());
	}

	public static create(value: string): FollowId {
		return new FollowId(value);
	}
}
