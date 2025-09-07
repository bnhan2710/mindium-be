export interface RedisConfig {
	host: string;
	port: number;
	db?: number;
	defaultTtlSeconds?: number;
}
