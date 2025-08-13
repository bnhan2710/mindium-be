export interface RabbitMQConfig {
	url: string;
	queue: string;
	exchange: string;
	routingKey: string;
	prefetch?: number;
}
