import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IMessageBus, DomainMessage } from '@shared/domain/messaging/message-bus.port';
import { DomainEvent } from '@shared/domain/domain-event';
import { EnvironmentKeyFactory } from '@libs/environment-key.factory';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RabbitMQMessageBus implements IMessageBus {
  private readonly logger = new Logger(RabbitMQMessageBus.name);


  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly environmentKeyFactory: EnvironmentKeyFactory
) {}

  async publishEvent<T extends DomainEvent>(event: T): Promise<void> {
    const message: DomainMessage<T> = {
      payload: event,
      metadata: {
        messageId: uuidv4(),
        correlationId: event.aggregateId,
        timestamp: new Date(),
        source: 'blog-system',
        eventVersion: '1.0',
      },
      config: {
        exchange: this.environmentKeyFactory.getRabbitMQConfig().exchange,
        routingKey: event.getEventName().toLowerCase(),
      },
    };

    await this.amqpConnection.publish(
      message.config.exchange,
      message.config.routingKey,
      message,
    );

    this.logger.log(`Published event: ${event.getEventName()}`);
  }

  async publishEvents(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map(event => this.publishEvent(event)));
  }

  async publishCommand<T>(command: T, queue: string): Promise<void> {
    await this.amqpConnection.publish('', queue, command);
    this.logger.log(`Published command to: ${queue}`);
  }

  async subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => Promise<void>
  ): Promise<void> {
  }
}