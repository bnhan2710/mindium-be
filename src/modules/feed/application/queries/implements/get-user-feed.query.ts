import { IQuery } from '@nestjs/cqrs';

export class GetUserFeedQuery implements IQuery {
    constructor(
        public readonly userId: string,
    ) {}
}
