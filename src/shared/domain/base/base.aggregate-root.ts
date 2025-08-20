import { DomainEvent } from './domain-event';
import { BaseEntity } from './base.entity';


export abstract class AggregateRoot<TId, TProps> extends BaseEntity<TId, TProps> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(
    id: TId,
    props: TProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, props, createdAt, updatedAt);
  }

	/**
	 * Add domain event to be published later
	 */
	protected addDomainEvent(event: DomainEvent): void {
		this._domainEvents.push(event);
	}

	/**
	 * Get all uncommitted domain events
	 */
	public getUncommittedEvents(): DomainEvent[] {
		return [...this._domainEvents];
	}

	/**
	 * Mark all events as committed (usually called after publishing)
	 */
	public markEventsAsCommitted(): void {
		this._domainEvents = [];
	}

	/**
	 * Clear all events without publishing
	 */
	public clearEvents(): void {
		this._domainEvents = [];
	}

	/**
	 * Check if aggregate has uncommitted events
	 */
	public hasUncommittedEvents(): boolean {
		return this._domainEvents.length > 0;
	}
}
