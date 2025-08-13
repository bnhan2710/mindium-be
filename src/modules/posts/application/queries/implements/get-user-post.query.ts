import { IQuery } from '@nestjs/cqrs';
import { OffsetPagination } from '@libs/common/dtos/offset-pagination.request';
export class GetUserPostsQuery implements IQuery {
	constructor(
		public readonly userId: string,
		public readonly pagination: OffsetPagination,
	) {}
}
