import { Global, Module } from '@nestjs/common';
import { RabbitModule } from '@shared/infrastructure/messaging/rabbitmq/rabbitmq.module';

@Global()
@Module({
	imports: [RabbitModule],
	exports: [RabbitModule],
})
export class MessagingModule {}
