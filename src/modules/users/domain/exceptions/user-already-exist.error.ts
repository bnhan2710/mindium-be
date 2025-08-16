import { DomainException } from '@shared/domain/exceptions/domain.exception';
export class UserAlreadyExistsError extends DomainException {
	constructor(username: string) {
		super(`User with username ${username} already exists`, 400);
		this.name = 'UserAlreadyExistsError';
	}
}
