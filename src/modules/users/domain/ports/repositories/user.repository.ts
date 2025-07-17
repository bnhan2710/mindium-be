import { User } from '../../entities/user.entity';

export interface IUserRepository {
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findByIdWithFollowers(userId: string): Promise<User[] | null>;
	findByIdWithFollowings(userId: string): Promise<User[] | null>;
	save(user: User): Promise<void>;
	createUserIfNotExists(
		email: string,
		name: string,
		avatar?: string | null,
	): Promise<User>;
}
