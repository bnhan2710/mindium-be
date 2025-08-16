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
		return Follow.reconstitute({
			id: FollowId.create((doc._id as any).toString()),
			followerId: UserId.create(doc.followerId.toString()),
			followeeId: UserId.create(doc.followeeId.toString()),
			createdAt: (doc as any).createdAt,
		});
	}

	static toDomainMany(docs: FollowDocument[]): Follow[] {
		return docs.map((doc) => this.toDomain(doc));
	}
}
