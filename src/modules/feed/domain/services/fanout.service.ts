import { FeedItem } from "../entities/feed-item";

export interface FanoutService {
	run(feedItem: FeedItem): Promise<void>;
}
