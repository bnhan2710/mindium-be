import { ValueObject } from '@shared/domain/value-objects/vo';

export class UserId extends ValueObject<string> {
	constructor(private readonly value: string) {
		super(value);
	}

	protected validate(value: string): void {
		if (!value || value.trim().length === 0) {
			throw new Error('UserId cannot be empty');
		}
	}
}
