import { User } from '@modules/users/domain/entities/user.entity';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { UserDocument } from '../adapters/persistence/schema/user.schema';
import { Types } from 'mongoose';
export class UserMapper {
	static toDomain(userDoc: UserDocument): User {
		const userId = UserId.create((userDoc._id as any).toString());
		return User.create(
			{
				email: userDoc.email,
				name: userDoc.name,
				avatar: userDoc.avatar,
			},
			userId,
		);
	}

	static toPersistence(user: User): Partial<UserDocument> {
		return {
			_id: new Types.ObjectId(user.getId().getValue()),
			email: user.getEmail(),
			name: user.getName(),
			avatar: user.getAvatarUrl(),
		};
	}

	static toPersistenceCreate(user: User): Partial<UserDocument> {
		return {
			email: user.getEmail(),
			name: user.getName(),
			avatar: user.getAvatarUrl(),
		};
	}

	static toPersistenceUpdate(user: User): Partial<UserDocument> {
		return {
			name: user.getName(),
			avatar: user.getAvatarUrl(),
		};
	}
}
