import { SlugGenerator } from '@libs/services';
import { ValueObject } from '@shared/domain/base/value-object';

export class Slug extends ValueObject<string> {
	private constructor(value: string) {
		super(value);
	}

	protected validate(value: string): void {
		if (!value || value.trim() === '') {
			throw new Error('Slug cannot be empty');
		}
	}

	public static createFromTitle(title: string): Slug {
		const slug = SlugGenerator.generate(title);
		return new Slug(slug);
	}

	public static create(value: string): Slug {
		if (!value || value.trim() === '') {
			throw new Error('Slug cannot be empty');
		}
		return new Slug(value);
	}
}
