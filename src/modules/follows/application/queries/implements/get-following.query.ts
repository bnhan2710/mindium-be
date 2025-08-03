import { IQuery } from '@nestjs/cqrs';
import { UserId } from '@modules/users/domain/value-objects/user-id.vo';
import { OffsetPagination } from '@shared/common/dtos';


export class GetFollowingQuery implements IQuery {
	constructor(
		public readonly userId: UserId,
		public readonly pagination: OffsetPagination,
	) {}
}
