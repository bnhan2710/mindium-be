import { IQuery } from '@nestjs/cqrs';

export class GetUserByIdsQuery implements IQuery {
	constructor(public readonly userIds: string[]) {}
}
