import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class AlreadyFollowingException extends DomainException {
	constructor() {
		super(`User already followed`, 400);
		this.name = 'AlreadyFollowingException';
	}
}
