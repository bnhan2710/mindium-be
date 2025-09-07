import { IQuery } from '@nestjs/cqrs';
import { OffsetPagination } from '@libs/common/dtos';
export class GetUserFeedQuery implements IQuery {
	constructor(
		public readonly userId: string,
		public readonly pagination: OffsetPagination,
	) {}
}
