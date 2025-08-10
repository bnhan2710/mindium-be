import { DomainError } from '@shared/domain/domain.error';
export class UserAlreadyExistsError extends DomainError {
	constructor(username: string) {
		super(`User with username ${username} already exists`, 400);
		this.name = 'UserAlreadyExistsError';
	}
}
