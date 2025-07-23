import { UserId } from '../value-objects/user-id.vo';
import { v4 } from 'uuid';
import { InvalidUserDataError } from '../exceptions';
export interface UserProps {
	id: UserId;
	email: string;
	name: string;
	avatar?: string;
}

export class User {
	private readonly props: UserProps;

	constructor(props: UserProps) {
		if (!props.id || !props.email || !props.name) {
			throw new InvalidUserDataError('User must have an id, email, and name');
		}
		this.props = props;
	}

	public static create(props: Omit<UserProps, 'id'>, id?: UserId): User {
		return new User({
			id: id || UserId.create(v4()),
			...props,
		});
	}

	public getId(): UserId {
		return this.props.id;
	}

	public getEmail(): string {
		return this.props.email;
	}

	public getAvatarUrl(): string | undefined {
		return this.props.avatar;
	}

	public getName(): string {
		return this.props.name;
	}

	public updateProfile(name: string, avatar?: string) {
		if (!name && !avatar) {
			throw new InvalidUserDataError(
				'At least one field (name or avatar) must be provided for update',
			);
		}

		if (name.trim().length < 2) {
			throw new InvalidUserDataError('Name must be at least 2 characters long');
		}

		this.props.name = name;
		if (avatar) {
			this.props.avatar = avatar;
		}
	}
}
