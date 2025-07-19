import { DomainError } from '@shared/common/errors/domain.error';

export class NotFollowedError extends DomainError {
	constructor() {
		super(`User is not followed`, 400);
		this.name = 'NotFollowedError';
	}
}
