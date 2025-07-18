import { SlugGenerator } from '@shared/services';

export class Slug {
	private constructor(private readonly value: string) {}

	public static createFromTitle(title: string): Slug {
		const slug = SlugGenerator.generate(title);
		return new Slug(slug);
	}

	public getValue(): string {
		return this.value;
	}
}
