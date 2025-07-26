import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { OffsetPagination } from '@shared/common/dtos/offset-pagination.request';

export class GetFollowersDto extends OffsetPagination {
	@ApiProperty({
		description: 'ID of the user to get followers for',
		example: '123e4567-e89b-12d3-a456-426614174000',
		required: false,
	})
	@IsOptional()
	@IsUUID()
	userId?: string;
}
