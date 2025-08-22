import { ValueObject } from "@shared/domain/base/value-object";

export class Tag extends ValueObject<string> {
	private constructor(value: string) {
		super(value);
	}

	public static create(value: string): Tag {
		return new Tag(Tag.toCapitalized(value));
	}

	protected validate(value: string): void {
		if (value.length > 50) {
			throw new Error('Tag cannot exceed 50 characters');
		}
		if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
			throw new Error('Tag can only contain alphanumeric characters and spaces');
		}
	}

	static toCapitalized(value: string): string {
		return value
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
}
