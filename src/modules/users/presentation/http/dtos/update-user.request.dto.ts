import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserRequestDto {
	@ApiProperty({
		description: 'User full name',
		example: 'John Doe',
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'Name must be a string' })
	@MinLength(2, { message: 'Name must be at least 2 characters long' })
	@MaxLength(50, { message: 'Name cannot exceed 50 characters' })
	name?: string;

	@ApiProperty({
		description: 'User avatar URL',
		example: 'https://example.com/avatar.jpg',
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'Avatar must be a valid URL string' })
	avatar?: string;

	@ApiProperty({
		description: 'User biography',
		example: 'Software developer and tech enthusiast',
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'Bio must be a string' })
	bio?: string;
}
