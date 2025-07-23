import { IQuery } from '@nestjs/cqrs';
import { OffsetPagination } from '@shared/common/dtos/offset-pagination.request';
export class GetUserPostQuery implements IQuery {
	constructor(
		public readonly userId: string,
		public readonly pagination: OffsetPagination,
	) {}
}
