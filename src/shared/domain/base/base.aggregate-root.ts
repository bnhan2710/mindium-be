import { DomainEvent } from './domain-event';
import { BaseEntity } from './base.entity';

export abstract class AggregateRoot<TId, TProps> extends BaseEntity<TId, TProps> {
	private _domainEvents: DomainEvent[] = [];

	protected constructor(id: TId, props: TProps, createdAt?: Date, updatedAt?: Date) {
		super(id, props, createdAt, updatedAt);
	}

	protected addDomainEvent(event: DomainEvent): void {
		this._domainEvents.push(event);
	}

	public getUncommittedEvents(): DomainEvent[] {
		return [...this._domainEvents];
	}

	public markEventsAsCommitted(): void {
		this._domainEvents = [];
	}

	public clearEvents(): void {
		this._domainEvents = [];
	}

	public hasUncommittedEvents(): boolean {
		return this._domainEvents.length > 0;
	}
}
