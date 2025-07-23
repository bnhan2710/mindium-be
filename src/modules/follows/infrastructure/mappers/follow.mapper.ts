import { Follow } from '@modules/follows/domain/entities/follow.entity';
import { FollowDocument } from '../adapter/persistence/schema/follow.schema';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '@modules/follows/domain/value-objects/follow-id.vo';

export class FollowMapper {
	static toPersistence(follow: Follow): Partial<FollowDocument> {
		return {
			followerId: follow.getFollowerId().getValue(),
			followeeId: follow.getFolloweeId().getValue(),
			createdAt: follow.getCreatedAt(),
		};
	}

	static toDomain(doc: FollowDocument): Follow {
		return Follow.reconstitute({
			id: FollowId.from((doc._id as any).toString()),
			followerId: UserId.create(doc.followerId),
			followeeId: UserId.create(doc.followeeId),
			createdAt: doc.createdAt,
		});
	}

	static toDomainMany(docs: FollowDocument[]): Follow[] {
		return docs.map((doc) => this.toDomain(doc));
	}
}
