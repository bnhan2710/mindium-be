import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class CannotFollowSelfError extends DomainException {
	constructor() {
		super('You cannot follow yourself', 400);
		this.name = 'CannotFollowSelfError';
	}
}
