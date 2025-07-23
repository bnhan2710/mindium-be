import { DomainError } from '@shared/common/errors/domain.error';
export class FollowSelfException extends DomainError {
	constructor() {
		super('User cannot follow themselves', 400);
		this.name = 'FollowSelfException';
	}
}
