import { DomainError } from '@shared/common/errors/domain.error';

export class UserNotFoundException extends DomainError {
	constructor() {
		super(`User not found`, 404);
		this.name = 'UserNotFoundException';
	}
}
