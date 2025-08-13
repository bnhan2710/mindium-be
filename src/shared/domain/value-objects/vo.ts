export abstract class ValueObject<T> {
	protected readonly _value: T;

	protected constructor(value: T) {
		this.validate(value);
		this._value = value;
	}

	public getValue(): T {
		return this._value;
	}

	public equals(other: ValueObject<T>): boolean {
		return JSON.stringify(this._value) === JSON.stringify(other._value);
	}

	public toString(): string {
		return String(this._value);
	}

	protected abstract validate(value: T): void;
}


