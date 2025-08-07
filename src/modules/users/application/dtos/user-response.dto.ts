import { User } from '@modules/users/domain/entities/user.entity';

export class UserResponseDto {
	public readonly id: string;
	public readonly email: string;
	public readonly name: string;
	public readonly avatar?: string | null;
	public readonly bio?: string | null;

	private constructor(id: string, email: string, name: string, avatar?: string | null, bio?: string | null) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.avatar = avatar;
		this.bio = bio;
	}

	static fromDomain(user: User): UserResponseDto {
		return new UserResponseDto(
			user.getId().getValue(),
			user.getEmail(),
			user.getName(),
			user.getAvatarUrl(),
			user.getBio()
		);
	}

	static fromDomainList(users: User[]): UserResponseDto[] {
		return users.map((user) => UserResponseDto.fromDomain(user));
	}
}
