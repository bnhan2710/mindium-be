import { DomainError } from '@shared/common/errors/domain.error';

export class AlreadyFollowingException extends DomainError {
	constructor() {
		super(`User already followed`, 400);
		this.name = 'AlreadyFollowingException';
	}
}
