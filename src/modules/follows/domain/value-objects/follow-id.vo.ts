import { v4 } from 'uuid';
import { ValueObject } from '@shared/domain/base/value-object';
export class FollowId extends ValueObject<string> {
	private constructor(value: string) {
		super(value);
	}

	protected validate(value: string): void {
		if (!value || typeof value !== 'string') {
			throw new Error('FollowId must be a non-empty string');
		}
	}

	public generate(): string {
		return v4();
	}

	public static create(value: string): FollowId {
		return new FollowId(value);
	}
}
