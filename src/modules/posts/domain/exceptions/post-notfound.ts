import { DomainError } from '@shared/domain/domain.error';

export class PostNotFoundError extends DomainError {
	constructor() {
		super(`Post not found.`);
		this.name = 'PostNotFoundError';
	}
}
