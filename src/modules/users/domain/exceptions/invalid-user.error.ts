import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class InvalidUserDataError extends DomainException {
	constructor(message: string) {
		super(`Invalid user: ${message}`, 400);
		this.name = 'InvalidUserDataError';
	}
}
