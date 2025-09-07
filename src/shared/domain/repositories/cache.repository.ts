export interface ICacheRepository {
	get<T>(key: string): Promise<T | null>;
	getByList(keys: string[]): Promise<string[] | null>;
	setByList(keyValues: Record<string, string>,score: number, ttlSeconds?: number): Promise<void>;
	set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
	addToSet(key: string, value: string): Promise<void>;
	del(key: string): Promise<void>;
	exists(key: string): Promise<boolean>;
	expire(key: string, seconds: number): Promise<void>;
	flushAll(): Promise<void>;
	zadd(key: string, score: number, value: string): Promise<void>;
	zrevrange(key: string, start: number, stop: number): Promise<string[]>;
}
