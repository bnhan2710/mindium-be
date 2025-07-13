import { User } from '@modules/users/domain/entities/user.entity';

export class UserApplicationDto {
    public readonly id: string;
    public readonly email: string;
    public readonly name: string;
    public readonly avatar?: string | null; 

    private constructor(id: string, email: string, name: string, avatar?: string | null) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.avatar = avatar;
    }


    static fromDomain(user: User): UserApplicationDto {
        return new UserApplicationDto(
            user.id,
            user.email,
            user.name,
            user.avatar 
        );
    }

    static fromDomainList(users: User[]): UserApplicationDto[] {
        return users.map(user => UserApplicationDto.fromDomain(user));
    }
}