import { DomainException } from '@shared/domain/exceptions/domain.exception';
export class InvalidPostDataError extends DomainException {
	constructor(message: string) {
		super(`Invalid post data: ${message}`);
		this.name = 'InvalidPostDataError';
	}
}
