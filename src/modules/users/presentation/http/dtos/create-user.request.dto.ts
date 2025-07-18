import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUserRequestDto {
    @ApiProperty({
        description: 'User email address',
        example: 'hihi@example.com'
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        description: 'User full name',
        example: 'Bao Nhan'
    })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;

    @ApiProperty({
        description: 'User avatar URL',
        example: 'https://example.com/avatar.jpg',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'Avatar must be a valid URL string' })
    avatar?: string;
}