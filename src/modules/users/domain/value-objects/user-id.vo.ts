import { ValueObject } from "@shared/domain";

export class UserId extends ValueObject<string> {
	private readonly value: string;
	
	protected validate(value: string): void {
		if (!value || value.trim().length === 0) {
			throw new Error("UserId cannot be empty");
		}
	}

	private constructor(value: string) {
		super(value);
		this.value = value;
	}

	public static create(id: string): UserId {
		return new UserId(id);
	}
}
