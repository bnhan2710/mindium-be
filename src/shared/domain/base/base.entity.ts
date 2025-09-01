export abstract class BaseEntity<TId, TProps> {
	protected readonly _id: TId;
	protected readonly _createdAt: Date;
	protected _updatedAt: Date;
	protected readonly props: TProps;

	constructor(id: TId, props: TProps, createdAt?: Date, updatedAt?: Date) {
		this._id = id;
		this.props = props;
		this._createdAt = createdAt || new Date();
		this._updatedAt = updatedAt || new Date();
	}

	public getId(): TId {
		return this._id;
	}

	public getProps(): TProps {
		return this.props;
	}

	public getCreatedAt(): Date {
		return this._createdAt;
	}

	public getUpdatedAt(): Date {
		return this._updatedAt;
	}

	protected touch(): void {
		this._updatedAt = new Date();
	}

	public equals(entity: BaseEntity<TId, TProps>): boolean {
		if (!(entity instanceof BaseEntity)) {
			return false;
		}
		return this._id === entity._id;
	}
}
