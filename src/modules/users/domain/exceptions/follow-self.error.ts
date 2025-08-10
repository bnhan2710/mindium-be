import { DomainError } from '@shared/domain/domain.error';

export class CannotFollowSelfError extends DomainError {
	constructor() {
		super('You cannot follow yourself', 400);
		this.name = 'CannotFollowSelfError';
	}
}
