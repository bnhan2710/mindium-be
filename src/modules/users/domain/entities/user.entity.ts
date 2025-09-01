import { UserId } from '../value-objects/user-id.vo';
import { v4 } from 'uuid';
import { InvalidUserDataError } from '../exceptions';
import { AggregateRoot } from '@shared/domain/base/base.aggregate-root';

export interface UserProps {
	email: string;
	name: string;
	avatar?: string;
	bio?: string;
}

export class User extends AggregateRoot<UserId, UserProps> {
	constructor(id: UserId, props: UserProps, createdAt?: Date, updatedAt?: Date) {
		super(id, props, createdAt, updatedAt);
	}
	public static create(
		email: string,
		name: string,
		avatar?: string,
		bio?: string,
		id?: UserId,
		createdAt: Date = new Date(),
		updatedAt: Date = new Date(),
	): User {
		if (!email || !name) {
			throw new InvalidUserDataError(
				'Email and name are required to create a user',
			);
		}
		const userId = id || UserId.create(v4());
		const user = new User(userId, { email, name, avatar, bio }, createdAt, updatedAt);
		return user;
	}

	public getEmail(): string {
		return this.props.email;
	}

	public getName(): string {
		return this.props.name;
	}

	public getAvatarUrl(): string | undefined {
		return this.props.avatar;
	}

	public getBio(): string | undefined {
		return this.props.bio;
	}

	public editProfile(name?: string, avatar?: string, bio?: string): void {
		if (!name && !avatar && !bio) {
			throw new InvalidUserDataError(
				'At least one of name, avatar, or bio must be provided for update',
			);
		}

		if (name) this.props.name = name;
		if (avatar) this.props.avatar = avatar;
		if (bio) this.props.bio = bio;
		this.touch();
	}
}
