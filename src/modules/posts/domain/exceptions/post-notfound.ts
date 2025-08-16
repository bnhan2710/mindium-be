import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class PostNotFoundError extends DomainException {
	constructor() {
		super(`Post not found.`);
		this.name = 'PostNotFoundError';
	}
}
