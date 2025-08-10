import { DomainError } from '@shared/domain/domain.error';

export class AlreadyFollowingException extends DomainError {
	constructor() {
		super(`User already followed`, 400);
		this.name = 'AlreadyFollowingException';
	}
}
