import { BaseEntity } from "@shared/domain/base/base.entity"
import { FeedId } from "../value-objects/feed-id"

export class FeedProps {
    postId: string
    authorId: string
    title: string
    content: string
    tags: string[]
    slug: string
    summary: string
    createdAt: Date
}

export class FeedItem extends BaseEntity<FeedId, FeedProps> {
    constructor(id: FeedId, props: FeedProps, createdAt?: Date, updatedAt?: Date) {
        super(id, props, createdAt, updatedAt)
    }
}