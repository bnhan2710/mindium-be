import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class NotFollowingException extends DomainException {
	constructor() {
		super('User is not following', 400);
		this.name = 'NotFollowingException';
	}
}
