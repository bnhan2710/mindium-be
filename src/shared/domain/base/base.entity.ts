export abstract class Entity {
	protected readonly id: string;
	protected readonly createdAt: Date;
	protected updatedAt: Date;

	protected constructor(id: string, createdAt?: Date, updatedAt?: Date) {
		this.id = id;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || new Date();
	}

	public getId(): string {
		return this.id;
	}

	public getCreatedAt(): Date {
		return this.createdAt;
	}

	public getUpdatedAt(): Date {
		return this.updatedAt;
	}

	protected touch(): void {
		this.updatedAt = new Date();
	}

	public equals(other: Entity): boolean {
		return this.id === other.id;
	}

	public hashCode(): string {
		return this.id;
	}
}
