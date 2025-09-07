import { User } from '@modules/users/domain/entities/user.entity';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { UserDocument } from '../persistence/schema/user.schema';
import { Types } from 'mongoose';
export class UserMapper {
	static toDomain(userDoc: UserDocument): User {
		const userId = UserId.create((userDoc._id as any).toString());
		return new User(
			userId,
			{
				email: userDoc.email,
				name: userDoc.name,
				avatar: userDoc.avatar,
				bio: userDoc.bio,
			},
			(userDoc as any).createdAt,
			(userDoc as any).updatedAt,
		);
	}

	static toPersistence(user: User): Partial<UserDocument> {
		return {
			_id: new Types.ObjectId(),
			email: user.getEmail(),
			name: user.getName(),
			avatar: user.getAvatarUrl(),
			bio: user.getBio(),
		};
	}

	static toPersistenceUpdate(user: User): Partial<UserDocument> {
		const result: Partial<UserDocument> = {};

		if (user.getName) {
			result.name = user.getName();
		}

		if (user.getAvatarUrl) {
			result.avatar = user.getAvatarUrl();
		}

		if (user.getBio) {
			result.bio = user.getBio();
		}

		return result;
	}
}
