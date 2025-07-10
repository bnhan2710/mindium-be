import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserDocument, UserModel } from '../adapters/persistence/schema/user.schema';
import { Types } from 'mongoose'; 

export class UserMapper {
  static toDomain(user: UserDocument): UserEntity {
    return new UserEntity(
      (user as any)._id,
      user.email,
      user.name,
      user.bio,
      user.avatar,
      
    );
  }

  static toPersistence(entity: UserEntity): Partial<UserDocument> {
    return {
      email: entity.email,
      name: entity.name,
      bio: entity.bio,
      avatar: entity.avatar,
	}
  }
}