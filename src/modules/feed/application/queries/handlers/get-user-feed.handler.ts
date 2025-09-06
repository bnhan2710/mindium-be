import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserFeedQuery } from '../implements/get-user-feed.query';
import { IFeedRepository } from '@modules/feed/domain/repositories/feed.repository';
import { FEED_TOKENS } from '@modules/feed/feed.tokens';

@QueryHandler(GetUserFeedQuery)
export class GetUserFeedHandler implements IQueryHandler<GetUserFeedQuery> {
    constructor(
        @Inject(FEED_TOKENS.FEED_REPOSITORY)
        private readonly feedRepository: IFeedRepository
    ) {}

    async execute(query: GetUserFeedQuery): Promise<any[]> {
        return []
    }   
}
