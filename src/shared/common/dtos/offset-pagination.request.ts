import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class OffsetPagination {
	@Type(() => Number)
	@Optional()
	@IsNumber()
	page: number;

	@Type(() => Number)
	@Optional()
	@IsNumber()
	size: number;
}
