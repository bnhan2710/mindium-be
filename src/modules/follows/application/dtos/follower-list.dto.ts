import { Follow } from "@modules/follows/domain/entities/follow.entity";

export class FollowListDto {
    constructor(
        public readonly followers: {
            id: string;
            followerId: string;
            followeeId: string;
            createdAt: Date;
        }[],
        public readonly total: number,
    ) {}

    static fromDomain(followers: Follow[], total: number): FollowListDto {
        return new FollowListDto(
            followers.map(follow => ({
                id: follow.getId().getValue(),
                followerId: follow.getFollowerId().getValue(),
                followeeId: follow.getFolloweeId().getValue(),
                createdAt: follow.getCreatedAt(),
            })),
            total,
        );
    }
}