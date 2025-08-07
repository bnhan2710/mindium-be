import { User } from '../../entities/user.entity';

export interface IUserRepository {
	save(user: User): Promise<void>;
	update(userId: string, user: Partial<User>): Promise<void>;
	findById(id: string): Promise<User | null>;
	findByIds(ids: string[]): Promise<User[]>;
	findByEmail(email: string): Promise<User | null>;
}
