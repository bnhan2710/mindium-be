import { DomainError } from '@shared/common/errors/domain.error';

export class NotFollowingException extends DomainError {
	constructor() {
		super('User is not following', 400);
		this.name = 'NotFollowingException';
	}
}
