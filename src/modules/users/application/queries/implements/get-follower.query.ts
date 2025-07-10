import { IQuery } from '@nestjs/cqrs';

export class GetFollowerQuery implements IQuery {
	constructor(public readonly userId: string) {}
}
