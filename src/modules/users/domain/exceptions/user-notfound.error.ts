import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class UserNotFoundError extends DomainException {
	constructor(userId: string) {
		super(`User with ID ${userId} not found`, 404);
	}
}
