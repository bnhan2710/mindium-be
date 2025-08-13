import { DomainEvent } from '../events/domain-event';

export interface IMessageBus {
	publishEvent<T extends DomainEvent>(event: T): Promise<void>;
	publishEvents(events: DomainEvent[]): Promise<void>;
	publishCommand<T>(command: T, queue: string): Promise<void>;
	subscribe<T extends DomainEvent>(
		eventType: string,
		handler: (event: T) => Promise<void>,
	): Promise<void>;
}

export interface MessageConfig {
	exchange: string;
	routingKey: string;
	queue?: string;
	persistent?: boolean;
	priority?: number;
}

export interface MessageMetadata {
	messageId: string;
	correlationId?: string;
	timestamp: Date;
	source: string;
	eventVersion: string;
}

export interface DomainMessage<T = any> {
	payload: T;
	metadata: MessageMetadata;
	config: MessageConfig;
}
