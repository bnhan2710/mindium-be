import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class FollowUserDto {
	@ApiProperty({
		description: 'MongoDB ID of the user to follow',
		example: '687a173d08d98f241d31e5e4',
	})
	@IsNotEmpty()
	followeeId!: string;
}
