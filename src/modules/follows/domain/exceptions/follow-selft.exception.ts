import { DomainError } from '@shared/domain/domain.error';
export class FollowSelfException extends DomainError {
	constructor() {
		super('User cannot follow themselves', 400);
		this.name = 'FollowSelfException';
	}
}
