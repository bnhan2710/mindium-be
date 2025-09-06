import { OffsetPagination } from "@libs/common/dtos";

export interface IFeedRepository {
  getUserFeed(userId: string, pagination : OffsetPagination)
}