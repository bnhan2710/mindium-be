import { DomainError } from '@shared/domain/domain.error';
export class InvalidPostDataError extends DomainError {
	constructor(message: string) {
		super(`Invalid post data: ${message}`);
		this.name = 'InvalidPostDataError';
	}
}
