import { Injectable, Inject, Logger } from '@nestjs/common';
import { FanoutService, PostFanoutData } from '@modules/feed/domain/services/fanout.service';
import { IFollowRepository } from '@modules/follows/domain/repositories/follow.repository';
import { ICacheRepository } from '@shared/domain/repositories/cache.repository';
import { FOLLOW_TOKENS } from '@modules/follows/follow.tokens';
import { CACHE_TOKENS } from '@shared/di-tokens';

@Injectable()
export class RabbitMQFanout implements FanoutService {

    constructor(
        @Inject(FOLLOW_TOKENS.REPOSITORY)
        private readonly followRepository: IFollowRepository,
        @Inject(CACHE_TOKENS.CACHE_REPOSITORY)
        private readonly cacheReposiotory: ICacheRepository,
    ) {}

    async run(postData: PostFanoutData): Promise<void> {
        
        const followers = await this.followRepository.getFollowerIds(postData.authorId);
        if (followers.length === 0) {
            return;
        }

        await this.cacheReposiotory.setByList(
            followers.reduce((acc, followerId) => {
                const feedKey = `user:${followerId}:feed`;
                const postEntry = JSON.stringify({
                    postId: postData.postId,
                    authorId: postData.authorId,
                    title: postData.title,
                    summary: postData.summary,
                    tags: postData.tags,
                    createdAt: postData.createdAt,
                });
                acc[feedKey] = postEntry;
                return acc;
            }, {} as Record<string, string>),
            3600,
        );
  }
}