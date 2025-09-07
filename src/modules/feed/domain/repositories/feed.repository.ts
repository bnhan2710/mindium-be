import { OffsetPagination } from '@libs/common/dtos';
import { IPageRequest } from '@libs/common/types';
import { FeedItem } from '../entities/feed-item';

export interface IFeedRepository {
	getUserFeed(userId: string, pageRequest: IPageRequest): Promise<FeedItem[]>;
}
