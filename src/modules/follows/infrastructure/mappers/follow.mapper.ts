import { Follow } from '@modules/follows/domain/entities/follow.entity';
import { FollowDocument } from '../persistence/schema/follow.schema';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { FollowId } from '@modules/follows/domain/value-objects/follow-id.vo';
import { Types } from 'mongoose';

export class FollowMapper {
	static toPersistence(follow: Follow): Partial<FollowDocument> {
		return {
			followerId: new Types.ObjectId(follow.getFollowerId().toString()),
			followeeId: new Types.ObjectId(follow.getFolloweeId().toString()),
		};
	}

	static toDomain(doc: FollowDocument): Follow {
		const followId = FollowId.create((doc._id as any).toString());
		const followerId = UserId.create((doc.followerId as any).toString());
		const followeeId = UserId.create((doc.followeeId as any).toString());

		return Follow.reconstitute(
			{
				followerId,
				followeeId,
			},
			followId,
			(doc as any).createdAt,
			(doc as any).updatedAt,
		);
	}

	static toDomainMany(docs: FollowDocument[]): Follow[] {
		return docs.map((doc) => this.toDomain(doc));
	}
}
