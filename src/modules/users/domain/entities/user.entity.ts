import { UserId } from '../value-objects/user-id.vo';
import { v4 } from 'uuid';
import { InvalidUserDataError } from '../exceptions';
export interface UserProps {
	id: UserId;
	email: string;
	name: string;
	avatar?: string;
	bio?: string
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

	public getBio(): string | undefined {
		return this.props.bio;
	}

	

	public editProfile(name?: string, avatar?: string, bio?: string) {
		if (!name && !avatar && !bio) {
			throw new InvalidUserDataError(
				'At least one of name, avatar, or bio must be provided for update'
			);
		}

		if (name) {
			this.props.name = name;
		}

		if (avatar) {
			this.props.avatar = avatar;
		}

		if (bio) {
			this.props.bio = bio;
		}
		
		if( this.props.name && this.props.name.length > 50) {
			throw new InvalidUserDataError('Name must not exceed 50 characters');
		}

		if( this.props.avatar && this.props.avatar.length > 200) {
			throw new InvalidUserDataError('Avatar URL must not exceed 200 characters');
		}

		if( this.props.bio && this.props.bio.length > 160) {
			throw new InvalidUserDataError('Bio must not exceed 160 characters');
		}


	}
}
