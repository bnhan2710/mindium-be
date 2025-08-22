import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQMessageBus } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.service'; 
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';

@Global()
@Module({
    imports: [
        RabbitMQModule.forRootAsync({
            inject: [EnvironmentKeyFactory],
            useFactory: (environmentKeyFactory: EnvironmentKeyFactory) => ({
                uri: environmentKeyFactory.getRabbitMQConfig().url,
                connectionInitOptions: {
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
    exports: [RabbitMQMessageBus, RabbitMQModule],
})
export class RabbitModule {}