import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
	constructor() {
		super(`User not found`, 404);
		this.name = 'UserNotFoundException';
	}
}
