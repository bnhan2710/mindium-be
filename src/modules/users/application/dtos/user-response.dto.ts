import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: 'Unique identifier for the user.',
        example: 'clv6r49o40000j6q51234abcd', 
    })
    public readonly id: string;

    @ApiProperty({
        description: 'Email address of the user.',
        example: 'john.doe@example.com', 
    })
    public readonly email: string;

    @ApiProperty({
        description: 'Name of the user.',
        example: 'John Doe',
        type: String,
    })
    public readonly name: string;

    @ApiProperty({
        description: 'URL of the user\'s avatar image.',
        example: 'https://cdn.example.com/abcdef.jpg',
    })
    public readonly avatar?: string | null; 


    private constructor(id: string, email: string, name: string, avatar?: string | null) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.avatar = avatar;
    }


    static fromDomain(user: UserEntity): UserResponseDto {
        return new UserResponseDto(
            user.id,
            user.email,
            user.name,
            user.avatar 
        );
    }

    static fromDomainList(users: UserEntity[]): UserResponseDto[] {
        return users.map(user => UserResponseDto.fromDomain(user));
    }
}