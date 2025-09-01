import { OffsetPagination } from "@libs/common/dtos";

export interface FeedRepository {
  getFeed(userId: string, pagination : OffsetPagination)
}