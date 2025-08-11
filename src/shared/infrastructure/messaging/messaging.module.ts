import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQMessageBus } from './rabbitmq/rabbitmq-message-bus';
import { EnvironmentKeyFactory } from '@libs/environment-key.factory';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [EnvironmentKeyFactory],
      useFactory: (environmentKeyFactory: EnvironmentKeyFactory) => ({
        uri: environmentKeyFactory.getRabbitMQConfig().url,
        connectionInitOptions:{
            wait: true,
            timeout: 5000,
        },
        exchanges: [
          {
            name: environmentKeyFactory.getRabbitMQConfig().exchange,
            type: 'topic',
          },
        ],
      }),
    }),
  ],
  providers: [RabbitMQMessageBus],
  exports: [RabbitMQMessageBus],
})
export class MessagingModule {}