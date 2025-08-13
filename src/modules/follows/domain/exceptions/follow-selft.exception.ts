import { DomainException } from '@shared/domain/exceptions/domain.exception';
export class FollowSelfException extends DomainException {
	constructor() {
		super('User cannot follow themselves', 400);
		this.name = 'FollowSelfException';
	}
}
