export abstract class DomainEvent {
	public readonly occurredOn: Date;
	public readonly aggregateId: string;

	protected constructor(aggregateId: string) {
		this.aggregateId = aggregateId;
		this.occurredOn = new Date();
	}

	abstract getEventName(): string;
}
