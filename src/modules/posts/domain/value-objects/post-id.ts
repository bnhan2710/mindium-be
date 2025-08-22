import { ValueObject } from "@shared/domain/base/value-object";

export class PostId extends ValueObject<string> {
	private constructor(value: string) {
		super(value);
	}

	protected validate(value: string): void {
		if (!value || value.trim().length === 0) {
			throw new Error('PostId cannot be empty');
		}

	}

	public static create(id: string): PostId {
		return new PostId(id);
	}

}
