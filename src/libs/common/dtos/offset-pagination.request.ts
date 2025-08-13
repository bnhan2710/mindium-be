import { IsOptional, IsPositive, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OffsetPagination {
	@ApiPropertyOptional({
		description: 'Page number (starts from 1)',
		example: 1,
		minimum: 1,
		default: 1,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: 'Page must be an integer' })
	@IsPositive({ message: 'Page must be a positive number' })
	@Min(1, { message: 'Page must be at least 1' })
	page: number = 1;

	@ApiPropertyOptional({
		description: 'Number of items per page',
		example: 10,
		minimum: 1,
		maximum: 100,
		default: 10,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: 'Size must be an integer' })
	@IsPositive({ message: 'Size must be a positive number' })
	@Min(1, { message: 'Size must be at least 1' })
	@Max(100, { message: 'Size cannot exceed 100' })
	size: number = 10;
}
